import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ToastAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './../../../constants/Colors'
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from './../../../configs/FirebaseConfig'

export default function SignUp() {

  const router=useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onCreateAccount=()=>{

    if(!username || !email || !password || !confirmPassword)
    {
      ToastAndroid.show('Please enter all the details', ToastAndroid.BOTTOM);
    }

    createUserWithEmailAndPassword(auth, email, password, confirmPassword)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    ToastAndroid.show('Your account successfully been created', ToastAndroid.BOTTOM);
    console.log(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage,errorCode);
    if(errorCode=='auth/weak-password')
      {
        ToastAndroid.show('Password need at least 6 characters', ToastAndroid.LONG)
      }
    if(errorCode=='auth/email-already-in-use')
      {
        ToastAndroid.show('Email already in use', ToastAndroid.LONG)
      }
  });
  }

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('./../../../assets/images/pawtectorLogo.png')} 
        style={styles.logo}
      />

      <Text style={styles.title}>REGISTER</Text>

    <View style={styles.container2}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(value)=>setUsername(value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={(value)=>setEmail(value)}
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          value={password}
          onChangeText={(value)=>setPassword(value)}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon1}>
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(value)=>setConfirmPassword(value)}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.icon2}>
          <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={onCreateAccount}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.joinText}>Join Us Before?</Text>
        <TouchableOpacity onPress={() => router.push('auth/sign-in')}>
          <Text style={styles.loginText}> Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container2: {
    backgroundColor:Colors.PRIMARY,
    borderRadius:10,
    width:'90%',
    paddingLeft:30,
    paddingTop:25,
    marginLeft:40,
    marginRight:40,
    justifyContent:'center'
  },
  logo: {
    resizeMode: 'contain',
    marginTop: 120
  },
  title: {
    fontSize: 34,
    fontFamily: 'outfit-bold',
    color: Colors.BLACK,
    marginTop: 40,
    marginBottom:30
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: Colors.BLACK,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: Colors.WHITE,
    fontFamily:'outfit'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems:'center',
    width: '90%',
    marginBottom: 15,
  },
  inputPassword: {
    height: 50,
    borderColor: Colors.BLACK,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.WHITE,
    width:'100%',
    fontFamily:'outfit'
  },
  icon1: {
    paddingHorizontal:5,
    position:'absolute',
    marginLeft: '85%'
  },
  icon2: {
    paddingHorizontal:5,
    position:'absolute',
    marginLeft: '85%'
  },
  button: {
    backgroundColor: Colors.BLACK,
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 10,
    marginBottom: 20,
    width: '90%',
    height: 60,
    marginTop: 10
  },
  buttonText: {
    color: Colors.WHITE,
    fontFamily:'outfit-bold',
    fontSize: 22,
    textAlign:'center',
    paddingHorizontal:10,
    alignItems:'center'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  joinText: {
    fontFamily:'outfit-bold',
    fontSize:20,
    color:Colors.BLACK,
    marginTop:70
  },
  loginText: {
    color: Colors.BLUE,
    fontFamily:'outfit-bold',
    fontSize:20,
    marginLeft: 5,
    marginTop:70
  },
});
