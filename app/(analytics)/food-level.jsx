import { View, Text, StyleSheet, Switch, TextInput, Button } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { useFoodLevel } from '../(dashboard-logic)/foodData';

export default function foodLevel() {

  const router = useRouter();
  const {
    foodLevel,
    isServoOn,
    timerValue,
    setTimerValue,
    toggleServo,
    updateTimerValue,
  } = useFoodLevel();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" style={{ marginTop: 10 }} />
        </TouchableOpacity>
        <Text style={styles.title}>Food Level</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.levelsContainer}>
          <View style={styles.box}>
            <Text style={styles.title}>Food Level</Text>
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
                fontSize="7"
                fill="#0a0a0a"
                dy="16"
              >
                est.{Math.round(foodLevel * 20)}g
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
              <Text style={styles.inputLabel}>Set Timer(minutes):</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={timerValue}
                onChangeText={setTimerValue}
              />
              <Button title="Set Timer" onPress={updateTimerValue} />
            </View>
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
    marginLeft: 100,
    alignContent: 'center'
  },
  body: {
    marginTop: 30,
    padding: 15
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: 18,
    textAlign: 'center'
  },
  levelsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the container
    width: '100%',
    marginBottom: 20,
  },
  box: {
    width: '90%', // Adjust width to center the box
    backgroundColor: '#fff',
    padding: 10,
    paddingBottom: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
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
    fontFamily: 'outfit-medium',
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
    fontFamily: 'outfit-medium',
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