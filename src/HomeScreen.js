import React, { useState, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, Dimensions, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

export default function HomeScreen() {
  const [groupedNotes, setGroupedNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null); // Selected note
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility
  const screenWidth = Dimensions.get('window').width;

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);

        const updatedNotes = parsedNotes.map((note) => {
          const dateObject = new Date(note.date); 
          const formattedDate = dateObject.toISOString();
          return { ...note, date: formattedDate };
        });

        const sortedNotes = updatedNotes.sort((a, b) => new Date(a.date) - new Date(b.date));

        const grouped = sortedNotes.reduce((acc, note) => {
          const dateObject = new Date(note.date);
          const formattedDate = dateObject.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          if (!acc[formattedDate]) {
            acc[formattedDate] = [];
          }
          acc[formattedDate].push(note);
          return acc;
        }, {});

        setGroupedNotes(Object.entries(grouped));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const openModal = (note) => {
    setSelectedNote(note);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedNote(null);
  };

  const renderNoteItem = ({ item }) => (
    <View style={[styles.noteCard, { width: screenWidth - 20 }]}>
      <TouchableOpacity onPress={() => openModal(item)}>
        <Image source={{ uri: item.image }} style={styles.noteImage} />
      </TouchableOpacity>
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

      {/* Heart-Shaped Modal */}
      {selectedNote && (
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.heartContainer}>
              {/* Heart Shape SVG */}
              <Svg width="100%" height="100%" viewBox="0 0 1000 800" style={styles.heartBackground}>
                <Path
                  d="M500 160
                     C640 -80, 1000 240, 500 680
                     C0 240, 360 -80, 500 160
                     Z"
                  fill="#fff"
                />
              </Svg>
              <View style={styles.heartContent}>
                <Text style={styles.modalDate}>
                  {new Date(selectedNote.date).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
                <Image source={{ uri: selectedNote.image }} style={styles.modalImage} />
                <Text style={styles.modalNoteText}>{selectedNote.note}</Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Kapat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 15,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginVertical: 15,
    marginLeft: 15,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    alignSelf: 'center',
    paddingBottom: 10,
  },
  noteImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  heartContainer: {
    width: 500,
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heartBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heartContent: {
    alignItems: 'center',
    padding: 30,
    width: '70%',
    position: 'absolute',
    top: '10%', // Positioning the content slightly down within the heart
  },
  modalDate: {
    fontSize: 18,
    color: '#FF69B4',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalNoteText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  closeButton: {
    backgroundColor: '#FF69B4',
    padding: 12,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
