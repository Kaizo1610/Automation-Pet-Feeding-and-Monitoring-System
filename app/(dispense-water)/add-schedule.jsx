import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Vibration } from 'react-native';
import { Colors } from './../../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { getCurrentUserId, firestore } from './../../configs/FirebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Audio } from 'expo-av';

export default function AddSchedule() {

  const router=useRouter();

  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [portion, setPortion] = useState('');

  const handleHoursChange = (input) => {
    // Allow only digits
    const sanitizedInput = input.replace(/[^0-9]/g, '');

    // Update hours only if valid (0-23)
    const numericHours = parseInt(sanitizedInput, 10);
    if (!isNaN(numericHours) && numericHours >= 0 && numericHours < 24) {
      setHours(sanitizedInput);
    } else if (sanitizedInput === '') {
      setHours(''); // Allow empty input
    }
  };

  const handleMinutesChange = (input) => {
    // Allow only digits
    const sanitizedInput = input.replace(/[^0-9]/g, '');

    // Update minutes only if valid (0-59)
    const numericMinutes = parseInt(sanitizedInput, 10);
    if (!isNaN(numericMinutes) && numericMinutes >= 0 && numericMinutes < 60) {
      setMinutes(sanitizedInput);
    } else if (sanitizedInput === '') {
      setMinutes(''); // Allow empty input
    }
  };

  const handlePortionChange = (input) => {
    const numericValue = parseInt(input, 10); // Convert to a number
    // Update portion if it's a valid number or allow empty input
    if ((!isNaN(numericValue) && numericValue <= 20) || input === '') {
      setPortion(input);
    }
  };

  const handleSave = async () => {
    if (hours === '' || minutes === '' || portion === '') {
      Vibration.vibrate();
      const { sound } = await Audio.Sound.createAsync(require('./../../assets/sounds/error.mp3'));
      await sound.playAsync();
      Alert.alert("Incomplete Data", "Please fill in all fields before saving.");
      return;
    }

    const userId = getCurrentUserId();
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(firestore, `users/${userId}/wateringSchedules`));
      if (querySnapshot.size >= 5) {
        Alert.alert("Limit Reached", "You can only add up to 5 watering schedules.");
        return;
      }

      const dispenseTime = `${hours}:${minutes}`;
      const portionValue = parseInt(portion, 10);
      const approxVolume = portionValue * 5; // Calculate approximate volume
      const newSchedule = {
        time: dispenseTime,
        portions: `${portion} Portions (Approx. ${approxVolume}ml)`,
        enabled: true,
      };

      await addDoc(collection(firestore, `users/${userId}/wateringSchedules`), newSchedule);
      console.log('Schedule added:', newSchedule);
      Vibration.vibrate();
      const { sound } = await Audio.Sound.createAsync(require('./../../assets/sounds/success.mp3'));
      await sound.playAsync();
      Alert.alert("Success", "New watering schedule has been added");
      router.back(); // Navigate back to the previous screen
    } catch (error) {
      console.error("Error adding schedule: ", error);
    }
  };

  return (

    <View style={styles.container}>

    <View style={styles.header}>
      <TouchableOpacity onPress={()=>router.back()} style={{marginTop:10}}>
      <Ionicons name="arrow-back" size={28} color="black" />    
      </TouchableOpacity>
        <Text style={styles.headerText}>Set Watering Schedule</Text>
      </View>

      <View style={styles.container1}>
      <Text style={styles.label1}>Set Dispense Time:</Text>
      <View style={styles.row1}>
        <TextInput
          style={styles.inputHour}
          placeholder="hr"
          value={hours}
          keyboardType='numeric'
          maxLength={2} // Allow max 2 digits for hours
          onChangeText={handleHoursChange} // Handle hour input
        />
        <Text style={styles.colon}>:</Text>
        <TextInput
          style={styles.inputMinute}
          placeholder="min"
          value={minutes}
          keyboardType='numeric'
          maxLength={2} // Allow max 2 digits for minutes
          onChangeText={handleMinutesChange} // Handle minute input
        />
      </View>

      <TouchableOpacity style={styles.row2}>
        <Text style={styles.label2}>Number of Portions:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter portions"
          value={portion}
          keyboardType='numeric'
          maxLength={2}
          onChangeText={handlePortionChange} // Handle portion input
        />
      </TouchableOpacity>

      <View>
        <Text style={styles.limit}>Maximum: 20portions</Text>
      </View>

      </View>

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
  container1: {
    marginTop: 30,
    alignItems:'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 22,
    fontFamily: 'outfit-bold',
    marginLeft: 50,
    marginTop: 60,
    textAlign:'center'
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  row2: {
    flexDirection: 'Column',
    alignItems: 'center',
  },
  label1: {
    marginBottom: 10,
    fontFamily:'outfit-medium',
    fontSize:20
  },
  label2: {
    marginBottom: 10,
    fontFamily:'outfit-medium',
    fontSize:20
  },
  input: {
    fontFamily:'outfit',
    borderWidth: 1,
    borderColor: Colors.LIGHTGRAY,
    borderRadius: 4,
    padding: 8,
    width: '40%',
    textAlign: 'center',
  },
  inputHour: {
    fontFamily:'outfit',
    borderWidth: 1,
    borderColor: Colors.LIGHTGRAY,
    borderRadius: 4,
    padding: 8,
    width: 50,
    textAlign: 'center', 
  },
  inputMinute: {
    fontFamily:'outfit',
    borderWidth: 1,
    borderColor: Colors.LIGHTGRAY,
    borderRadius: 4,
    padding: 8,
    width: 50,
    textAlign: 'center', 
  },
  colon: {
    fontSize: 20, 
    marginHorizontal: 10, 
  },
  saveButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop:120,
    width:'80%',
    marginLeft: 40,
    marginTop: 50
  },
  saveButtonText: {
    color: 'white',
    fontSize: 20,
    fontFamily:'outfit-bold',
  },
  limit: {
    fontFamily: 'outfit',
    fontSize: 12,
    color: Colors.GRAY,
    marginTop: 10,
  }
});
