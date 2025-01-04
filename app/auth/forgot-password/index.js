import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './../../../constants/Colors';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './../../../configs/FirebaseConfig';
import { Audio } from 'expo-av';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('error'); // 'error' or 'success'

  const handleSubmit = () => {
    if (!email) {
      showAlert('Please enter your email address', 'error');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent to:", email);
        showAlert('Password reset email sent. Please check your inbox.', 'success');
      })
      .catch((error) => {
        console.log(error.code, error.message);
        if (error.code === 'auth/user-not-found') {
          showAlert('The email address is not registered.', 'error');
        } else if (error.code === 'auth/invalid-email') {
          showAlert('The email address is invalid.', 'error');
        } else {
          showAlert('Failed to send password reset email.', 'error');
        }
      });
  };

  const showAlert = async (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
    Vibration.vibrate(500); // Vibrate for 500 milliseconds

    const soundObject = new Audio.Sound();
    try {
      const soundFile = type === 'success' 
        ? require('./../../../assets/sounds/success.mp3') 
        : require('./../../../assets/sounds/error.mp3');
      await soundObject.loadAsync(soundFile);
      await soundObject.playAsync();
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      setAlertVisible(false);
    }, 4000); // Hide the alert after 4 seconds
  };

  return (
    <View style={styles.container}>
      {alertVisible && (
        <View style={[styles.alertContainer, alertType === 'success' ? styles.successAlert : styles.errorAlert]}>
          <Text style={styles.alertText}>{alertMessage}</Text>
        </View>
      )}
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="black" style={styles.arrowback}/>
      </TouchableOpacity>
      
      {/* Logo */}
      <Image
        source={require('./../../../assets/images/pawtectorLogo.png')} 
        style={styles.logo}
      />
      
      <Text style={styles.title}>FORGOT PASSWORD</Text>
      <Text style={styles.subtitle}>Enter your email address, we will send you a verification code.</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      
        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  logo: {
    resizeMode: 'contain',
    marginTop: 50,
    marginLeft: 42
  },
  arrowback: {
    marginTop: 25
  },
  title: {
    fontSize: 30,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.BLACK,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.GRAY,
    marginBottom: 20,
    fontFamily: 'outfit-medium',
  },
  inputContainer: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.WHITE,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    width: '90%',
    marginLeft: 15,
    fontFamily: 'outfit'
  },
  submitButton: {
    backgroundColor: Colors.BLACK,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    width: '90%',
    marginLeft: 15,
    marginTop: 30
  },
  submitButtonText: {
    fontSize: 20,
    color: Colors.WHITE,
    fontFamily: 'outfit-bold',
  },
  alertContainer: {
    position: 'absolute',
    top: 55,
    left: '10%',
    right: '10%',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    zIndex: 1,
    borderWidth: 1,
  },
  errorAlert: {
    backgroundColor: Colors.RED,
    borderColor: 'red'
  },
  successAlert: {
    backgroundColor: Colors.GREEN,
    borderColor: 'green'
  },
  alertText: {
    fontFamily: 'outfit-medium',
    fontSize: 15,
    color: Colors.BLACK
  }
});
