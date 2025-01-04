import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; // Importing Ionicons from Expo
import { useRouter } from 'expo-router';
import { Colors } from './../../constants/Colors'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function AddDevice() {

  const router=useRouter();

  const [wifiEnabled, setWifiEnabled] = useState(false);

  const handleWifiToggle = () => {
    setWifiEnabled(!wifiEnabled);
    // logic to turn on Wi-Fi can go here
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>router.back()}> 
          <Ionicons name="arrow-back" size={28} color="black" style={{marginTop:10}} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Device</Text>
      </View>

      {/* Instructions */}
      <View style={styles.instructions1}>
      <FontAwesome5 name="satellite-dish" size={24} color="black" style={{marginTop:10}}/>
      <Text style={styles.instructions2}>
        Searching for nearby devices. Make sure your devices have entered{' '}
        <Text style={styles.linkText}>pairing mode</Text>.
      </Text>
      </View>

      {/* Wi-Fi Toggle */}
      <View style={styles.wifiButton} onPress={handleWifiToggle}>
        <Text style={styles.wifiText}>Turn on Wi-Fi at your own device</Text>
        <Ionicons name="wifi-outline" size={24} color="#000" />
      </View>

      {/* Manual Add Section */}
      <Text style={styles.addManuallyText}>Add Manually and connect with the pawtector smart pet feeder below.    Then configure it with your hotspot/WiFi SSID and Password.</Text>
      <View style={styles.manualAdd}>
        <Image
          source={require('./../../assets/images/smartPetIcon.png')} 
          style={styles.deviceImage}
        />
        <Text style={styles.deviceName}>Pawtector</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginLeft: 85,
    marginTop: 80,
    alignItems:'center'
  },
  instructions1: {
    flexDirection:'row',
    justifyContent:'space-between'
  },
  instructions2: {
    fontSize: 16,
    marginBottom: 30,
    paddingLeft: 10,
    fontFamily:'outfit',
    paddingRight: 20
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  wifiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 40,
  },
  wifiText: {
    fontSize: 18,
  },
  addManuallyText: {
    fontSize: 18,
    fontFamily:'outfit-bold',
    marginBottom: 40,
    marginTop: 10
  },
  manualAdd: {
    alignItems: 'center',
  },
  deviceImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    marginRight: 240
  },
  deviceName: {
    fontSize: 16,
    fontFamily:'outfit-medium',
    marginRight: 235
  },
});
