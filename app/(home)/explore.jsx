import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function explore() {

  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" style={{ marginTop: 10 }} />
        </TouchableOpacity>
        <Text style={styles.title}>Our Physical Store</Text>
      </View>

      <View style={styles.body}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 3.2503,
            longitude: 101.7376,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: 3.2503, longitude: 101.7376 }}
            title="Our Store"
            description="Visit us here!"
          />
        </MapView>
        <Text style={styles.reachText}>Come and Reach us Here!!!</Text>
        <View style={styles.horizontalLine} />
        <Text style={styles.collaboratedText}>Collaborated With:</Text>
        <View style={styles.iconContainer}>
          <View style={styles.iconWithText}>
            <FontAwesome5 name="tiktok" size={30} color="black" />
            <Text style={styles.iconText}>Tiktok</Text>
          </View>
          <View style={styles.iconWithText}>
            <FontAwesome name="shopping-cart" size={30} color="orange" />
            <Text style={styles.iconText}>Shopee</Text>
          </View>
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
    fontFamily: 'outfit-bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 90,
    marginLeft: 50,
    alignContent: 'center',
  },
  body: {
    marginTop: 10,
    padding: 10
  },
  map: {
    width: '100%',
    height: 200,
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: 18,
    textAlign: 'center'
  },
  reachText: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    marginTop: 10,
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 10,
    marginTop: 60,
    marginBottom: 30
  },
  collaboratedText: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  iconWithText: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
    fontSize: 18,
    fontFamily: 'outfit',
  },
});