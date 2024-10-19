import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from './../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Homepage() {  

  const router = useRouter();

  // Initial water and food levels
  const [waterLevel, setWaterLevel] = useState(0.4); // Set to 40% initially
  const [foodLevel, setFoodLevel] = useState(0.4); // Set to 40% initially

  // To track whether the switch is being held (for both water and food)
  const [waterToggleActive, setWaterToggleActive] = useState(false);
  const [foodToggleActive, setFoodToggleActive] = useState(false);

  // Interval references
  const waterIntervalRef = useRef(null);
  const foodIntervalRef = useRef(null);

  // Handle water level increment by 1% every second
  const startWaterIncrease = () => {
    if (!waterToggleActive) {
      setWaterToggleActive(true);
      waterIntervalRef.current = setInterval(() => {
        setWaterLevel(prevLevel => (prevLevel >= 1 ? 1 : prevLevel + 0.01)); // Increment by 1%
      }, 1000);
    }
  };

  const stopWaterIncrease = () => {
    setWaterToggleActive(false);
    clearInterval(waterIntervalRef.current); // Stop the increment
  };

  // Handle food level increment by 1% every second
  const startFoodIncrease = () => {
    if (!foodToggleActive) {
      setFoodToggleActive(true);
      foodIntervalRef.current = setInterval(() => {
        setFoodLevel(prevLevel => (prevLevel >= 1 ? 1 : prevLevel + 0.01)); // Increment by 1%
      }, 1000);
    }
  };

  const stopFoodIncrease = () => {
    setFoodToggleActive(false);
    clearInterval(foodIntervalRef.current); // Stop the increment
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.icon1} onPress={() => router.push('(home)/my-profile')}>
          <Ionicons name="person-circle-sharp" size={48} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon2} onPress={() => router.push('(home)/notifications')}>
          <Icon name="bell" size={38} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon3} onPress={() => router.push('(home)/add-device')}>
          <Icon name="plus-circle" size={38} color="black" />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.title}>
            Pawtector's Dashboard
        </Text>
      </View>

      {/* Water Level */}
      <View style={styles.WaterBackground}>
      <View style={styles.levelContainer}>
        <Text style={styles.levelTitle}>Water Level</Text>
        <View style={styles.waterCircle}>
          {/* Water fill with dynamic opacity */}
          <LinearGradient
            colors={['rgba(127,255,212,1)', 'rgba(127,255,212,0.5)']}
            style={[
              styles.waterFill, 
              { height: 200 * waterLevel } // Dynamic height based on water level
            ]}
          />
          {/* Display percentage inside the container */}
          <Text style={styles.percentageText}>{`${Math.round(waterLevel * 100)}%`}</Text>
        </View>
        <Switch
          value={waterToggleActive} // Show the active state of the toggle
          onValueChange={val => val ? startWaterIncrease() : stopWaterIncrease()} // Start or stop the water increment
          trackColor={{ false: Colors.GRAY, true: Colors.BLACK }}
          thumbColor={waterToggleActive ? 'orange' : 'white'}
        />
      </View>
      </View>

      {/* Food Level */}
      <View style={styles.FoodBackground}>
      <View style={styles.levelContainer}>
        <Text style={styles.levelTitle}>Food Level</Text>
        <View style={styles.foodContainer}>
          {/* Food fill with dynamic opacity */}
          <LinearGradient
            colors={['rgba(165,42,42,1)', 'rgba(165,42,42,0.5)']}
            style={[
              styles.foodFill, 
              { height: 150 * foodLevel } // Dynamic height based on food level
            ]}
          />
          {/* Display percentage inside the container */}
          <Text style={styles.percentageText}>{`${Math.round(foodLevel * 100)}%`}</Text>
        </View>
        <Switch
          value={foodToggleActive} // Show the active state of the toggle
          onValueChange={val => val ? startFoodIncrease() : stopFoodIncrease()} // Start or stop the food increment
          trackColor={{ false: Colors.GRAY, true: Colors.BLACK }}
          thumbColor={foodToggleActive ? 'orange' : 'white'}
        />
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PEACH,
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 28,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.PRIMARY
  },
  icon1: {
    paddingLeft: 2
  },
  icon2: {
    paddingLeft: 225
  },
  icon3: {
    paddingRight: 2
  },
  levelContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  levelTitle: {
    fontSize: 25,
    fontFamily: 'outfit-medium',
    marginBottom: 20,
    color: Colors.BLACK,
    backgroundColor: 'yellow',
    padding: 3
  },
  waterCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.BLACK,
    overflow: 'hidden',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    marginBottom: 10,
    backgroundColor: Colors.WHITE,
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  foodContainer: {
    width: 120,
    height: 154,
    borderWidth: 2,
    borderColor: Colors.BLACK,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    marginBottom: 10,
    backgroundColor: Colors.WHITE, 
  },
  foodFill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.BLACK,
    position: 'absolute', // Place it on top of the container
  },
});