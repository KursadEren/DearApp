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
        const sortedNotes = parsedNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
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
      <View style={styles.dateContainer}>
        <View style={styles.line} />
        <Text style={styles.dateText}>{item.date}</Text>
        <View style={styles.line} />
      </View>
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
    padding: 20,
  },
  noteCard: {
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  noteImage: {
    width: '90%',
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 18, // Daha büyük font boyutu
    color: '#333',
    fontWeight: '600', // Daha belirgin yazı stili
    textAlign: 'center',
    marginVertical: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc', // Daha açık çizgi rengi
    marginHorizontal: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#777', // Daha yumuşak tarih rengi
    fontStyle: 'italic', // Eğik yazı stili
    textAlign: 'center',
  },
});
