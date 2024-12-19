import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from './../../constants/Colors';
import { useRouter } from 'expo-router';
import { getCurrentUserId, firestore, storage } from '../../configs/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from "firebase/storage";

export default function PetsInfo() {
  const router = useRouter();
  const petId = router.query?.petId; // Ensure petId is correctly extracted

  const [modalVisible, setModalVisible] = useState(false);
  const [petImage, setPetImage] = useState(null);
  const [pets, setPets] = useState([]);
  const [filteredPet, setFilteredPet] = useState(null);

  // Handle delete icon press (show modal)
  const handleDeletePress = () => {
    setModalVisible(true);
  };

  // Handle cancel button press (hide modal)
  const handleCancelDelete = () => {
    setModalVisible(false);
  };

  // Handle confirm delete (implement delete logic here)
  const handleConfirmDelete = () => {
    setModalVisible(false);
    // Implement delete logic here
  };

  useEffect(() => {
    const fetchPets = async () => {
      const userId = getCurrentUserId();
      if (!userId) throw new Error("User not authenticated");

      const querySnapshot = await getDocs(collection(firestore, `users/${userId}/pets`));
      const petsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPets(petsData);

      // Filter pet by name "Putehh"
      const putehhPet = petsData.find(pet => pet.name === 'Putehh');
      setFilteredPet(putehhPet);
    };

    fetchPets();
  }, []);

  useEffect(() => {
    const fetchPetImage = async () => {
      const userId = getCurrentUserId();
      if (!userId) throw new Error("User not authenticated");

      const petImageRef = ref(storage, `users/${userId}/pets/${petId}/petProfile.jpg`);
      try {
        const url = await getDownloadURL(petImageRef);
        setPetImage(url);
      } catch (error) {
        if (error.code === 'storage/object-not-found') {
          setPetImage(null);
        } else {
          throw error;
        }
      }
    };

    if (petId) {
      fetchPetImage();
    }
  }, [petId]);

  return (
    <View style={styles.container}>
      {/* Cat Image with absolute positioned back arrow and icons */}
      <View style={styles.imageContainer}>
        {/* Back Arrow */}
        <TouchableOpacity style={styles.arrowback} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Image
          source={petImage ? { uri: petImage } : require('./../../assets/images/oyen.png')}
          style={styles.catImage}
        />
        {/* Edit (Pencil) Icon */}
        <TouchableOpacity style={styles.editIcon} onPress={() => router.push('(pet-details)/edit-oyen')}>
          <Ionicons name="pencil" size={18} color="white" />
        </TouchableOpacity>
        {/* Trash Icon */}
        <TouchableOpacity style={styles.deleteIcon} onPress={handleDeletePress}>
          <Ionicons name="trash-bin-sharp" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Pet Details Section */}
      {filteredPet && (
        <View key={filteredPet.id} style={styles.detailCard}>
          <Text style={styles.petName}>{filteredPet.name}'s Detail</Text>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.info}>{filteredPet.gender}</Text>
          <Text style={styles.label}>Weight</Text>
          <Text style={styles.info}>{filteredPet.weight}</Text>

          {/* Health Information */}
          <Text style={styles.healthHeader}>Health Information</Text>
          <Text style={styles.label}>Appointment</Text>
          <Text style={styles.info}>{filteredPet.appointment}</Text>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.info}>{filteredPet.date}</Text>
        </View>
      )}

      <View style={styles.container1}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Delete?</Text>
              <Text style={styles.modalMessage}>Are you sure you want to delete?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton1} onPress={handleCancelDelete}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton1} onPress={handleConfirmDelete}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f0ea', // Light beige background
  },
  imageContainer: {
    position: 'relative', // Important for absolute positioning
  },
  arrowback: {
    position: 'absolute',
    top: 40, 
    left: 20,
    zIndex: 1, // Make sure the arrow appears on top of the image
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Optional: Adding semi-transparent background
    padding: 5, 
    borderRadius: 15, 
  },
  catImage: {
    width: '100%',
    height: 250, 
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  editIcon: {
    position: 'absolute',
    top: 10,
    right: 45, 
    backgroundColor: Colors.PRIMARY,
    padding: 5,
    borderRadius: 5,
    marginTop: 170,
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10, 
    backgroundColor: Colors.PRIMARY,
    padding: 5,
    borderRadius: 5,
    marginTop: 170,
  },
  detailCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 25,
    marginHorizontal: 20,
    marginTop: -25, // To overlap slightly with the image
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  petName: {
    fontSize: 22,
    fontFamily:'outfit-bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    fontFamily:'outfit-medium',
    marginTop: 10,
  },
  info: {
    fontSize: 18,
    color: Colors.GRAY,
    fontFamily:'outfit-medium',
  },
  healthHeader: {
    fontSize: 22,
    fontFamily:'outfit-bold',
    marginVertical: 20,
    textAlign: 'center'
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily:'outfit-bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 18,
    fontFamily:'outfit-medium',
    textAlign: 'center',
    marginBottom: 30,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton1: {
    backgroundColor: Colors.LIGHTGRAY,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton1: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
  },
  cancelText: {
    color: Colors.BLACK,
    fontFamily:'outfit',
    fontSize:15
  },
  deleteText: {
    color: Colors.BLACK,
    fontFamily:'outfit',
    fontSize:15
  }
});

