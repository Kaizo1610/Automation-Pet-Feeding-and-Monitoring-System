import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, FlatList, Alert, ActivityIndicator, Vibration } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from './../../constants/Colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addPet, storage, getCurrentUserId } from './../../configs/FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Audio } from 'expo-av';

export default function AddPetDetails() {

  const router = useRouter();

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [appointment, setAppointment] = useState('');
  const [date, setDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [isGenderDropdownVisible, setIsGenderDropdownVisible] = useState(false);
  const [isAppointmentDropdownVisible, setIsAppointmentDropdownVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  const uploadImage = async () => {
    setIsUploading(true);
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error("User not authenticated");

      const response = await fetch(imageUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `users/${userId}/pets/${name}/petProfile.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', `Failed to upload image: ${error.message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    const formattedDate = moment(selectedDate).format('DD MMMM YYYY');
    setDate(formattedDate);
    hideDatePicker();
  };

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    setIsGenderDropdownVisible(false);
  };

  const handleAppointmentSelect = (selectedAppointment) => {
    setAppointment(selectedAppointment);
    setIsAppointmentDropdownVisible(false);
  };

  const handleSave = async () => {
    if (!name || !gender || !weight || !imageUri) {
      Vibration.vibrate();
      const { sound } = await Audio.Sound.createAsync(require('./../../assets/sounds/error.mp3'));
      await sound.playAsync();
      alert("Please fill in all the mandatory fields.");
      return;
    }

    const imageUrl = await uploadImage();
    if (!imageUrl) return;

    const newPet = { name, gender, weight, appointment, date, image: imageUrl };
    try {
      await addPet(newPet);
      Vibration.vibrate();
      const { sound } = await Audio.Sound.createAsync(require('./../../assets/sounds/success.mp3'));
      await sound.playAsync();
      Alert.alert('Success', 'New pet details added successfully!');
      router.push('/(tabs)/pet-profile');
    } catch (error) {
      console.error("Error saving pet: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="black" style={{ marginTop: 10 }} />
      </TouchableOpacity>
      <Text style={styles.title}>Add Pet Profile</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={imageUri ? { uri: imageUri } : require('./../../assets/images/catProfile.png')}
            style={styles.profileImage}
          />
          <Ionicons name="pencil" size={16} color="white" style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      {/* Form Section */}
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        {/* Gender Input */}
        <Text style={styles.label}>Gender</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setIsGenderDropdownVisible(!isGenderDropdownVisible)}
        >
          <Text style={gender ? styles.inputText : styles.placeholderText}>
            {gender || 'Select Gender'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="gray" />
        </TouchableOpacity>

        {isGenderDropdownVisible && (
          <FlatList
            data={['Male', 'Female']}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => handleGenderSelect(item)}>
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.dropdown1}
          />
        )}

        <Text style={styles.label}>Weight (Kg)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        <Text style={styles.label1}>Health Information</Text>

        {/* Appointment Picker */}
        <Text style={styles.label}>Appointment</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setIsAppointmentDropdownVisible(!isAppointmentDropdownVisible)}
        >
          <Text style={appointment ? styles.inputText : styles.placeholderText}>
            {appointment || 'Select Appointment'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="gray" />
        </TouchableOpacity>

        {isAppointmentDropdownVisible && (
          <FlatList
            data={['Vaccination', 'Nutrition', 'Diagnosis', 'Dentistry', 'Dermatology']}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => handleAppointmentSelect(item)}>
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.dropdown2}
          />
        )}

        {/* Date Picker */}
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity onPress={showDatePicker}>
          <TextInput
            style={[styles.input, { color: date ? 'black' : 'gray' }]}
            value={date}
            editable={false}
          />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isUploading}>
        {isUploading ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Save</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef9f4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    backgroundColor: Colors.WHITE,
  },
  editIcon: {
    position: 'absolute',
    right: 5,
    top: 70,
    backgroundColor: Colors.PRIMARY,
    padding: 4,
    borderRadius: 5,
  },
  form: {
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 10,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label1: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    marginBottom: 2,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'outfit',
  },
  inputText: {
    flex: 1,
    color: 'black',
  },
  placeholderText: {
    flex: 1,
    color: Colors.GRAY,
  },
  dropdown1: {
    position: 'absolute',
    bottom: 230,
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 5,
    elevation: 5,
    zIndex: 1,
  },
  dropdown2: {
    position: 'absolute',
    bottom: 170,
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 5,
    elevation: 5,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHTGRAY,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'outfit',
  },
  saveButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'outfit-bold',
  },
});
