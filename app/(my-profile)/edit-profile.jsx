import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Colors } from './../../constants/Colors';

export default function EditProfile() {
  const router = useRouter();
  
  // Permanent profile image state (only updates when Save is pressed)
  const [profileImage, setProfileImage] = useState(null);
  
  // Temporary profile image state (used for live preview before saving)
  const [tempProfileImage, setTempProfileImage] = useState(null);

  const [username, setUsername] = useState('');
  const [quotes, setQuotes] = useState('');

  // Handle save button (commit temp changes to actual profile state)
  const handleSave = () => {
    setProfileImage(tempProfileImage); // Commit temporary image to permanent state
    console.log("Profile saved:", { username, quotes, profileImage: tempProfileImage });
    // Add your logic to save the profile data
  };

  // Handle image picking (update the profile image directly)
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access the gallery is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],  // Square image
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.uri); // Set profile image directly
      setTempProfileImage(result.uri); // Set temporary image for preview
    }
  };

  // Go back function (discard temporary changes)
  const goBack = () => {
    setTempProfileImage(profileImage); // Reset to the last saved image on back
    router.back(); // Navigate back
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Edit Profile</Text>
      </View>

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        <Image
          style={styles.profilePicture}
          // Show tempProfileImage if it exists, otherwise show profileImage (the saved one)
          source={tempProfileImage ? { uri: tempProfileImage } : (profileImage ? { uri: profileImage } : require('./../../assets/images/placeholderProfile.png'))}
        />
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Ionicons name="pencil" size={16} color="white" />
        </TouchableOpacity>
      </View>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#999"
      />

      {/* Quotes Input */}
      <TextInput
        style={styles.input}
        placeholder="Quotes"
        value={quotes}
        onChangeText={setQuotes}
        placeholderTextColor="#999"
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection:'row'
  },
  backButton: {
    marginTop: 40,
    top: 20,
  },
  title: {
    fontFamily:'outfit-bold',
    fontSize:30,
    marginTop: 100,
    marginLeft: 72
  },
  profilePictureContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  profilePicture: {
    width: 160,
    height: 160,
    borderRadius: 10,
    backgroundColor: Colors.BLACK,
  },
  editIcon: {
    position: 'absolute',
    bottom: 1,
    right: 105,
    backgroundColor: Colors.PRIMARY,
    padding: 8,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHTGRAY,
    marginBottom: 25,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 50,
    marginLeft: 35,
    width: '80%',
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily: 'outfit-bold',
  },
}); 