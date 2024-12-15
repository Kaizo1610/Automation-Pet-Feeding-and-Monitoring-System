import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
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
        <Text style={styles.title}>Food Level</Text>
      </View>

    <View style={styles.body}>

    </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef9f4', // Light beige background
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
    marginLeft: 100,
    alignContent:'center'
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