import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './../../../constants/Colors';
import { useRouter } from 'expo-router';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // Handle the process of sending verification code
    console.log("Verification code sent to:", email);
    // Navigate back or show verification step
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="black" style={styles.arrowback}/>
      </TouchableOpacity>
      
      {/* Logo */}
      <Image
        source={require('./../../../assets/images/pawtectorLogo.png')} 
        style={styles.logo}
      />
      
      <Text style={styles.title}>FORGOT PASSWORD</Text>
      <Text style={styles.subtitle}>Enter your email address, we will send you verification code.</Text>

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
    marginTop:25
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
    fontFamily:'outfit'
  },
  submitButton: {
    backgroundColor: Colors.BLACK,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    width:'90%',
    marginLeft: 15,
    marginTop: 30
  },
  submitButtonText: {
    fontSize: 20,
    color: Colors.WHITE,
    fontFamily: 'outfit-bold',
  },
});
