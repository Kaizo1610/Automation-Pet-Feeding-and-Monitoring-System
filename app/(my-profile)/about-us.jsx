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
      <View style={styles.horizontalLine} />
      <Text style={styles.contactText}>
        Feel free to contact us:
      </Text>
      <View style={styles.contactDetails}>
        <Ionicons name="mail" size={20} color="black" />
        <Text style={styles.contactInfo}>info@pawtector.com</Text>
      </View>
    </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE, 
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
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 20,
    marginTop: 40,
    marginBottom: 40
  },
  contactText: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
    textAlign: 'center',
  },
  contactDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  contactInfo: {
    fontFamily: 'outfit',
    fontSize: 16,
    marginLeft: 10,
  }
});