import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ToastAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from './../../../constants/Colors'
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './../../../configs/FirebaseConfig'

export default function SignIn() {

  const router=useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 4000); // Hide the alert after 4 seconds
  };

  const onSignIn = () => {
    if (!email && !password) {
      showAlert('Please Enter The Correct Email and Password!');
      return;
    }
  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        router.replace('(tabs)/homepage');
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        if (errorCode == 'auth/invalid-credential') {
          showAlert('Invalid Credentials');
        }
        if (errorCode == 'auth/missing-password') {
          showAlert('Password is Missing');
        }
        if (errorCode == 'auth/invalid-email') {
          showAlert('Invalid Email Address');
        }
      });
  }

  return (
    <View style={styles.container}>
      {alertVisible && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>{alertMessage}</Text>
        </View>
      )}
      {/* Logo */}
      <Image
        source={require('./../../../assets/images/pawtectorLogo.png')} 
        style={styles.logo}
      />
  
      <Text style={styles.title}>SIGN IN</Text>
  
      <View style={styles.container2}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={(value) => setEmail(value)}
          keyboardType="email-address"
        />
  
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Password"
            value={password}
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon1}>
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="black" />
          </TouchableOpacity>
        </View>
  
        <View>
          <TouchableOpacity onPress={() => router.push('auth/forgot-password')}>
            <Text style={styles.loginText1}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
  
        <TouchableOpacity style={styles.button} onPress={onSignIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
  
      <View style={styles.footer}>
        <Text style={styles.joinText}>Don't have an account yet?</Text>
        <TouchableOpacity onPress={() => router.push('auth/sign-up')}>
          <Text style={styles.loginText2}>Register</Text>
        </TouchableOpacity>
      </View>
  
      <View>
        <Text style={styles.loginText3}>--------------     Or Connect With     -------------</Text>
      </View>
  
      <View style={styles.footer2}>
        <TouchableOpacity style={styles.button1} onPress={() => router.push('/homepage')}>
          <Text style={styles.buttonText1}><FontAwesome name="google" size={26} color="white"/> Login With Google</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={styles.button2} onPress={() => router.push('/homepage')}>
          <Text style={styles.buttonText1}><FontAwesome name="facebook-square" size={26} color="white" /> Login With Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  )};

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
    marginBottom: 5,
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
  loginText1: {
    color: Colors.BLUE,
    fontFamily:'outfit-bold',
    fontSize:16,
    marginTop:5,
    marginLeft:155
  },
  button: {
    backgroundColor: Colors.BLACK,
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 10,
    marginBottom: 20,
    width: '90%',
    height: 60,
    marginTop: 15
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
    marginTop: 10
  },
  joinText: {
    fontFamily:'outfit-bold',
    fontSize:16,
    color:Colors.BLACK,
    marginTop:5
  },
  loginText2: {
    color: Colors.BLUE,
    fontFamily:'outfit-bold',
    fontSize:16,
    marginLeft: 5,
    marginTop:5
  },
  loginText3: {
    fontFamily:'outfit',
    fontSize:15,
    marginTop:20
  },
  footer2: {
    paddingLeft:5,
    alignItems:'center'
  },
  button1: {
    backgroundColor: Colors.BLACK,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginBottom: 10,
    width: '80%',
    height: 60,
    marginTop: 15
  },
  button2: {
    backgroundColor: Colors.BLACK,
    paddingVertical: 15,
    paddingHorizontal: 45,
    borderRadius: 10,
    marginBottom: 10,
    width: '80%',
    height: 60,
    marginTop: 15
  },
  buttonText1: {
    color: Colors.WHITE,
    fontFamily:'outfit-bold',
    fontSize: 22,
    textAlign:'center',
    paddingHorizontal:5,
    width:"85%",
    alignItems:'center'
  },
  alertContainer: {
    position: 'absolute',
    top: 55,
    width: '80%',
    backgroundColor: Colors.RED,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign:'center',
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'red'
  },
  alertText: {
    fontFamily:'outfit-medium',
    fontSize: 15,
    color: Colors.BLACK
  }
});