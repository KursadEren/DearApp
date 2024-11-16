import React, { useState, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const [groupedNotes, setGroupedNotes] = useState([]);
  const screenWidth = Dimensions.get('window').width; // Ekran genişliği

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);

        // Tarih bilgisini ayrıştırma ve işlem yapma
        const updatedNotes = parsedNotes.map((note) => {
          const dateObject = new Date(note.date); // Date formatına çevir
          const formattedDate = dateObject.toISOString(); // ISO formatı ile kesin sıralama
          return { ...note, date: formattedDate }; // Güncellenmiş tarih formatını ekle
        });

        // Tarihe göre sıralama (en eski en üstte olacak şekilde)
        const sortedNotes = updatedNotes.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Notları tarihe göre grupla
        const grouped = sortedNotes.reduce((acc, note) => {
          const dateObject = new Date(note.date);
          const formattedDate = dateObject.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }); // Örneğin: "16 Kasım 2024"

          if (!acc[formattedDate]) {
            acc[formattedDate] = [];
          }
          acc[formattedDate].push(note);
          return acc;
        }, {});

        setGroupedNotes(Object.entries(grouped));
      }
    } catch (error) {
      console.error('Notlar yüklenirken hata oluştu:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const renderNoteItem = ({ item }) => (
    <View style={[styles.noteCard, { width: screenWidth - 20 }]}>
      <Image source={{ uri: item.image }} style={styles.noteImage} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {new Date(item.date).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>
      <Text style={styles.noteText}>{item.note}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={groupedNotes}
        keyExtractor={([date]) => date}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.dateHeader}>{item[0]}</Text>
            <FlatList
              data={item[1]}
              keyExtractor={(note) => note.id}
              renderItem={renderNoteItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f6',
    padding: 10,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginVertical: 10,
    marginLeft: 10,
  },
  noteCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    marginBottom: 20,
    alignSelf: 'center',
  },
  noteImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF69B4',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 15,
    elevation: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noteText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 15,
  },
});