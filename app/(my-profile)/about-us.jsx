import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function aboutUs() {

  const router=useRouter();

  return (
    
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" style={{marginTop:10}}/>
        </TouchableOpacity>
        <Text style={styles.title}>About US</Text>
      </View>

    <View style={styles.body}>
      <Text style={styles.subtitle}>
      PawTector is an IoT mobile application solution to cater the common problem faced by pet's owner with traditional method of feeding pets. The mobile applications act as a remote controller where users can monitor the food and water level measurement through the monitoring dashboard including dispense food automatically.
      </Text>
    </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE, // Light beige background
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontFamily:'outfit-bold',
    marginBottom: 10,
    textAlign:'center',
    marginTop: 90,
    marginLeft: 100
  },
  body: {
    marginTop: 30,
    padding: 15
  },
  subtitle: {
    fontFamily:'outfit',
    fontSize:18,
    textAlign:'center'
  }
});