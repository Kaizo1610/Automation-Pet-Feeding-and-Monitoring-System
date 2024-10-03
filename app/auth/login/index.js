import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from './../../../constants/Colors'

export default function login() {
  const router = useRouter();  // Using useRouter for navigation

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('./../../../assets/images/pawtectorLogo.png')} 
        style={styles.logo}
      />

      {/* Welcome Text */}
      <Text style={styles.header}>Hey, Welcome!</Text>
      <Text style={styles.subHeader}>While you sit and stay – We'll go out and play</Text>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={() => router.push('auth/sign-in')}>
        <Text style={styles.signInButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Create Account Link */}
      <TouchableOpacity onPress={() => router.push('auth/sign-up')}>
        <Text style={styles.createAccount}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
    marginTop: 200
  },
  header: {
    fontFamily: 'kaushan', 
    fontSize: 40,
    color: Colors.BLACK,
    marginTop: 40,
    textAlign: 'center'
  },
  subHeader: {
    fontFamily: 'outfit', 
    fontSize: 22,
    color: Colors.BLACK,
    textAlign: 'center',
    marginTop: 15
  },
  signInButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 20,
    marginBottom: 20,
    marginTop:150,
    alignItems:'center'
  },
  signInButtonText: {
    fontFamily: 'outfit-bold', 
    fontSize: 35,
    color: Colors.WHITE
  },
  createAccount: {
    fontFamily: 'outfit-bold', 
    fontSize: 18,
    color: Colors.BLUE,  
    textDecorationLine: 'underline',
  },
});