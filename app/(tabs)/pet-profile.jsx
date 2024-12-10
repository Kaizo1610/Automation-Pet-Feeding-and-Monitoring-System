import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from './../../constants/Colors';
import { useRouter } from 'expo-router';

export default function PetProfile() {  
  const router = useRouter();

  const [pets, setPets] = useState([
    { name: 'Oyen', image: require('./../../assets/images/oyen.png') },
    { name: 'John', image: require('./../../assets/images/john.png') },
    { name: 'Ujang', image: require('./../../assets/images/ujang.png') },
    { name: 'Kiko', image: require('./../../assets/images/kiko.jpeg') }, // Added Kiko
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Profiles</Text>
      <Text style={styles.subtitle}>
        Manage and store your <Text style={{color:'green'}}>pet information</Text> here.
      </Text>

      <View style={styles.container2}>
        <Text style={styles.sectionTitle}>My Pet</Text>

        <ScrollView style={styles.scrollView}>
          {pets.map((pet) => (
            <View key={pet.name} style={styles.petItem}>
              <Image source={pet.image} style={styles.petImage} />
              <Text style={styles.petName}>{pet.name}</Text>
              <TouchableOpacity 
                style={styles.arrow} 
                onPress={() => router.push(`(pet-profile)/${pet.name.toLowerCase()}`)} // Navigate to the specific pet's detail page
              >
                <Text style={styles.arrowText}>&gt;</Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 50,
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
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
  },
  arrow: {
    flex: 1,
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
    marginTop: 20,
    alignItems: 'center',
  },
  addPetButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: 'outfit-bold',
  },
  scrollView: {
    maxHeight: 400, // Adjust the height as needed
    marginBottom: 20,
  },
});
