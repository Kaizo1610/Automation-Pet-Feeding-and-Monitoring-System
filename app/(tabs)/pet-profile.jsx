import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from './../../constants/Colors';
import { useRouter } from 'expo-router';
import { getDocs, collection } from "firebase/firestore";
import { firestore, getCurrentUserId, storage } from './../../configs/FirebaseConfig';
import { ref, getDownloadURL } from "firebase/storage";

export default function PetProfile() {  
  const router = useRouter();

  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const userId = getCurrentUserId();
      if (!userId) throw new Error("User not authenticated");

      const querySnapshot = await getDocs(collection(firestore, `users/${userId}/pets`));
      const petsData = querySnapshot.docs.map(async (doc) => {
        const petData = doc.data();
        const petImageRef = ref(storage, `users/${userId}/pets/${petData.name}/petProfile.jpg`);
        try {
          const url = await getDownloadURL(petImageRef);
          return { id: doc.id, ...petData, image: url };
        } catch (error) {
          if (error.code === 'storage/object-not-found') {
            return { id: doc.id, ...petData, image: null };
          } else {
            throw error;
          }
        }
      });

      const resolvedPetsData = await Promise.all(petsData);
      setPets(resolvedPetsData);
    };

    fetchPets();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Profiles</Text>
      <Text style={styles.subtitle}>
        Manage and store your <Text style={{color:'green'}}>pet information</Text> here.
      </Text>

      <View style={styles.container2}>
        <Text style={styles.sectionTitle}>My Pet(s)</Text>

        <ScrollView style={styles.scrollView}>
          {pets.map((pet) => (
            <TouchableOpacity 
              key={pet.id} 
              style={styles.petItem} 
              onPress={() => router.push({ pathname: '(pet-profile)/pets-info', params: { petId: pet.id, petName: pet.name } })}
            >
              <View style={styles.petBox}>
                {pet.image ? (
                  <Image source={{ uri: pet.image }} style={styles.petImage} />
                ) : (
                  <Image source={require('./../../assets/images/placeholderProfile.png')} style={styles.petImage} />
                )}
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.arrowText}>🔖</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={styles.addPetButton} 
          onPress={() => router.push('(pet-profile)/add-pet-details')}
        >
          <Text style={styles.addPetButtonText}>Add Pet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  container2: {
    backgroundColor: Colors.PEACH,
    padding: 15,
  },
  title: {
    fontSize: 30,
    fontFamily: 'outfit-bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 50,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'outfit',
    marginBottom: 50,
  },
  sectionTitle: {
    fontSize: 25,
    fontFamily: 'outfit-bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  petBox: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  petImage: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 5,
  },
  petName: {
    fontSize: 20,
    fontFamily: 'outfit-medium',
    marginRight: 15,
    flex: 1,
  },
  arrow: {
    alignItems: 'flex-end', 
    justifyContent: 'center', 
  },
  arrowText: {
    fontSize: 24,
  },
  addPetButton: {
    backgroundColor: Colors.PRIMARY, // Orange color
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  addPetButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: 'outfit-bold',
  },
  scrollView: {
    maxHeight: 480, // Adjust the height as needed
    marginBottom: 10,
  },
});
