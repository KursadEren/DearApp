import React, { useState, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        // Tarihe göre sıralama (en yeni en üstte olacak şekilde)
        const sortedNotes = parsedNotes.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setNotes(sortedNotes);
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
    <View style={styles.noteCard}>
      <Image source={{ uri: item.image }} style={styles.noteImage} />
      <Text style={styles.noteText}>{item.note}</Text>
      <Text style={styles.dateText}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderNoteItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f6',
    padding: 20,
  },
  noteCard: {
    alignItems: 'center',
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
    borderRadius: 5,
    marginBottom: 10,
  },
  noteText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 5,
  },
});
