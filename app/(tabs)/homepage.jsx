import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, Button, ScrollView, Image } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from './../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useFoodLevel } from '../(dashboard-logic)/foodData';
import { useWaterLevel } from '../(dashboard-logic)/waterData';

export default function Homepage() {  

  const router = useRouter();

  const {
    foodLevel,
    isServoOn,
    timerValue,
    setTimerValue,
    toggleServo,
    updateTimerValue,
  } = useFoodLevel();

  const {
    waterLevel,
    isPumpOn,
    togglePump,
  } = useWaterLevel();

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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Promote Image */}
      <Image
        source={require('./../../assets/images/promote.png')}
        style={styles.promoteImage}>
      </Image>
      {/* Food Level Box */}
      <Text style={styles.title}>Food Level</Text>
      <View style={styles.box}>
        <Svg width={150} height={150} viewBox="0 0 100 100">
          <G rotation="-90" origin="50, 50">
            <Circle
              cx="50"
              cy="50"
              r="40"
              stroke="#E0E0E0"
              strokeWidth="8"
              fill="none"
            />
            <Circle
              cx="50"
              cy="50"
              r="40"
              stroke="#2196F3"
              strokeWidth="8"
              fill="none"
              strokeDasharray={Math.PI * 2 * 40}
              strokeDashoffset={Math.PI * 2 * 40 * (1 - foodLevel)}
            />
          </G>
          <SvgText
            x="45"
            y="48"
            textAnchor="middle"
            fontSize="17"
            fontWeight="bold"
            fill="#2196F3"
            dy="2"
          >
            {Math.round(foodLevel * 100)}%
          </SvgText>
          <SvgText
    x="41"
    y="47"
    textAnchor="middle"
    fontSize="7" // Font size for the "est." text
    fill="#0a0a0a"
    dy="16" // Adjusted vertical position for the second text
  >
    est.{Math.round(foodLevel*20)}g
  </SvgText>
        </Svg>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Servo Motor</Text>
          <Switch
            value={isServoOn}
            onValueChange={toggleServo}
            trackColor={{ false: '#ccc', true: '#4CAF50' }}
            thumbColor={isServoOn ? '#FFFFFF' : '#888'}
            ios_backgroundColor="#E0E0E0"
            style={styles.toggleSwitch}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Set Timer (in minutes):</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            value={timerValue}
            onChangeText={setTimerValue}
          />
          <Button title="Set Timer" onPress={updateTimerValue} />
        </View>
      </View>

      {/* Water Level Box */}
      <Text style={styles.title}>Water Level</Text>
      <View style={styles.box}>
        <Svg width={150} height={150} viewBox="0 0 100 100">
          <G rotation="-90" origin="50, 50">
            <Circle
              cx="50"
              cy="50"
              r="40"
              stroke="#E0E0E0"
              strokeWidth="8"
              fill="none"
            />
            <Circle
              cx="50"
              cy="50"
              r="40"
              stroke="#4CAF50"
              strokeWidth="8"
              fill="none"
              strokeDasharray={Math.PI * 2 * 40}
              strokeDashoffset={Math.PI * 2 * 40 * (1 - waterLevel)}
            />
          </G>
          <SvgText
            x="45"
            y="47"
            textAnchor="middle"
            fontSize="17"
            fontWeight="bold"
            fill="#4CAF50"
            dy="2"
          >
            {Math.round(waterLevel*100)}%
          </SvgText>
          <SvgText
    x="41"
    y="47"
    textAnchor="middle"
    fontSize="7" // Font size for the "est." text
    fill="#0a0a0a"
    dy="16" // Adjusted vertical position for the second text
  >
    est.{Math.round(waterLevel*20)}ml
  </SvgText>
        </Svg>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Water Pump</Text>
          <Switch
            value={isPumpOn}
            onValueChange={togglePump}
            trackColor={{ false: '#ccc', true: '#2196F3' }}
            thumbColor={isPumpOn ? '#FFFFFF' : '#888'}
            ios_backgroundColor="#E0E0E0"
            style={styles.toggleSwitch}
          />
        </View>
      </View>
    </ScrollView>

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
  icon1: {
    paddingLeft: 2
  },
  icon2: {
    paddingLeft: 225
  },
  icon3: {
    paddingRight: 2
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
  },
  promoteImage: {
    width: 350,
    height: 200,
    marginBottom: 20,
    borderRadius: 15
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop:20,
    fontWeight: 'bold',
    color: '#333',
  },
  box: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  toggleSwitch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  inputContainer: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
    color: '#555',
  },
  textInput: {
    width: 80,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    alignSelf: 'center',
    textAlign: 'center',
  },
});