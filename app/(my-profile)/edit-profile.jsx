import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Colors } from './../../constants/Colors';
import { getCurrentUserId, firestore, uploadProfileImage } from './../../configs/FirebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Audio } from 'expo-av';

export default function EditProfile() {
  const router = useRouter();
  
  // Permanent profile image state (only updates when Save is pressed)
  const [profileImage, setProfileImage] = useState("");
  
  // Temporary profile image state (used for live preview before saving)
  const [tempProfileImage, setTempProfileImage] = useState("");

  const [username, setUsername] = useState('');
  const [quotes, setQuotes] = useState('');

  const [originalUsername, setOriginalUsername] = useState('');
  const [originalQuotes, setOriginalQuotes] = useState('');

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');

  // Fetch existing profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) throw new Error("User not authenticated");

        const docRef = doc(firestore, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched profile data:", data); // Debug log
          setUsername(data.username);
          setQuotes(data.quotes);
          setProfileImage(data.profileImage || ""); // Ensure profileImage is a string
          setTempProfileImage(data.profileImage || ""); // Ensure profileImage is a string
          setOriginalUsername(data.username);
          setOriginalQuotes(data.quotes);
        } else {
          // Set default values if no profile data exists
          setUsername("Username");
          setQuotes("Your Quotes");
          setProfileImage("");
          setTempProfileImage("");
          setOriginalUsername("Username");
          setOriginalQuotes("Your Quotes");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  // Show alert function
  const showAlert = async (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
    Vibration.vibrate();
    const { sound } = await Audio.Sound.createAsync(require('./../../assets/sounds/error.mp3'));
    await sound.playAsync();
    setTimeout(() => {
      setAlertVisible(false);
    }, 4000); // Hide the alert after 4 seconds
  };

  const showSuccessAlert = async (message) => {
    setSuccessAlertMessage(message);
    setSuccessAlertVisible(true);
    Vibration.vibrate();
    const { sound } = await Audio.Sound.createAsync(require('./../../assets/sounds/success.mp3'));
    await sound.playAsync();
    setTimeout(() => {
      setSuccessAlertVisible(false);
      router.back(); // Navigate back after the alert is hidden
    }, 4000); // Hide the alert after 4 seconds
  };

  // Handle save button (commit temp changes to actual profile state)
  const handleSave = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error("User not authenticated");

      let profileImageUrl = tempProfileImage;
      if (tempProfileImage) {
        profileImageUrl = await uploadProfileImage(userId, tempProfileImage);
      }

      await setDoc(doc(firestore, "users", userId), {
        username,
        quotes: quotes || "Your Quotes",
        profileImage: profileImageUrl || ""
      });

      showSuccessAlert('Profile saved successfully!');
      setProfileImage(profileImageUrl); // Commit temporary image to permanent state
      setTempProfileImage(""); // Reset temporary image state
      setOriginalUsername(username); // Reset original username to the saved username
      setOriginalQuotes(quotes); // Reset original quotes to the saved quotes
    } catch (error) {
      console.error("Error saving profile data:", error);
      showAlert('Failed to save profile.');
    }
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
      setTempProfileImage(result.uri); // Set temporary image for preview
    }
  };

  // Go back function (discard temporary changes)
  const goBack = () => {
    setTempProfileImage(profileImage); // Reset to the last saved image on back
    setUsername(originalUsername); // Reset to the original username
    setQuotes(originalQuotes); // Reset to the original quotes
    if (router.canGoBack()) {
      router.back(); // Navigate back if possible
    } else {
      router.replace('(tabs)/homepage'); // Navigate to homepage if no previous screen
    }
  };

  return (
    <View style={styles.container}>
      {alertVisible && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>{alertMessage}</Text>
        </View>
      )}
      {successAlertVisible && (
        <View style={styles.successAlertContainer}>
          <Text style={styles.successAlertText}>{successAlertMessage}</Text>
        </View>
      )}
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
  alertContainer: {
    position: 'absolute',
    top: 20,
    left: '10%',
    right: '10%',
    backgroundColor: Colors.GREEN,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:'center',
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'green'
  },
  alertText: {
    fontFamily:'outfit-medium',
    fontSize: 15,
    color: Colors.WHITE
  },
  successAlertContainer: {
    position: 'absolute',
    top: 20,
    left: '10%',
    right: '10%',
    backgroundColor: Colors.GREEN,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:'center',
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'green'
  },
  successAlertText: {
    fontFamily:'outfit-medium',
    fontSize: 15,
    color: Colors.WHITE
  }
});