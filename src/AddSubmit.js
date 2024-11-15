import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  Image,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  const [image, setImage] = useState(null);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // AsyncStorage'dan verileri yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error);
      }
    };
    loadData();
  }, []);

  // Resim seçme fonksiyonu
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Galeriye erişim izni verilmedi!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Yeni bir not ekle
  const addNote = async () => {
    if (!image || !date || !note) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      image,
      date,
      note,
    };

    const updatedNotes = [...notes, newEntry];

    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      Alert.alert('Başarılı', 'Not kaydedildi!');
      setImage(null);
      setDate('');
      setNote('');
    } catch (error) {
      Alert.alert('Hata', 'Not kaydedilemedi!');
      console.error(error);
    }
  };

  // Notları temizle
  const clearNotes = async () => {
    try {
      await AsyncStorage.removeItem('notes');
      setNotes([]);
      Alert.alert('Başarılı', 'Tüm notlar silindi!');
    } catch (error) {
      Alert.alert('Hata', 'Notlar silinemedi!');
      console.error(error);
    }
  };

  // Tarih seçme işlemi
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD formatı
      setDate(formattedDate);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff0f6" />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>📷 Resim Seç</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.buttonText}>📅 Tarih Seç</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        {date && <Text style={styles.selectedDate}>Seçilen Tarih: {date}</Text>}

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="💕 Not Ekle"
          value={note}
          onChangeText={setNote}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={addNote}>
          <Text style={styles.buttonText}>💌 Not Ekle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearNotes}>
          <Text style={styles.buttonText}>🗑️ Tüm Notları Temizle</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Kaydedilen Notlar:</Text>
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              {item.image && (
                <Image source={{ uri: item.image }} style={styles.noteImage} />
              )}
              <Text style={styles.noteText}>📅 Tarih: {item.date}</Text>
              <Text style={styles.noteText}>💕 Not: {item.note}</Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff0f6', // Safe area background
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#f9a8d4',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#f9a8d4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDate: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: '#ff69b4',
  },
  noteCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  noteImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 5,
  },
  noteText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
});
