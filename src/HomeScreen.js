import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, Dimensions, Modal, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

export default function HomeScreen() {
  const [groupedNotes, setGroupedNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null); // Selected note
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility for details
  const [heartVisible, setHeartVisible] = useState(false); // Modal visibility for animated heart
  const screenWidth = Dimensions.get('window').width;
  const scaleAnim = useRef(new Animated.Value(0)).current; // Animation for the heart expansion

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

  const showHeartAnimation = () => {
    setHeartVisible(true);
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const closeHeartAnimation = () => {
    setHeartVisible(false);
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

      {/* Detail Modal */}
      {selectedNote && (
        <Modal
          visible={modalVisible}
          animationType="none"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalDate}>
                {new Date(selectedNote.date).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Image source={{ uri: selectedNote.image }} style={styles.modalImage} />
              <TouchableOpacity onPress={showHeartAnimation} style={styles.showNoteButton}>
                <Text style={styles.showNoteButtonText}>Show Note</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Heart-Shaped Note Modal */}
      {heartVisible && (
        <Modal
          visible={heartVisible}
          animationType="none"
          transparent={true}
          onRequestClose={closeHeartAnimation}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.heartContainer, { transform: [{ scale: scaleAnim }] }]}>
              <Svg width="100%" height="100%" viewBox="0 0 1400 1200" style={styles.heartBackground}>
                <Path
                  d="M700 300
                     C900 -100, 1400 400, 700 1100
                     C0 400, 500 -100, 700 300
                     Z"
                  fill="#fff"
                />
              </Svg>
              <View style={styles.heartContent}>
                <Text style={styles.modalNoteText}>{selectedNote?.note}</Text>
                <TouchableOpacity onPress={closeHeartAnimation} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
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
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
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
    marginBottom: 10,
  },
  showNoteButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  showNoteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF69B4',
    padding: 10,
    borderRadius: 25,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  heartContainer: {
    width: 600,
    height: 600,
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
    top: '25%', // Center content inside heart
  },
  modalNoteText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
});

