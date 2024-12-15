import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { useWaterLevel } from '../(dashboard-logic)/waterData';

export default function waterLevel() {

  const router = useRouter();
  
  const {
    waterLevel,
    isPumpOn,
    togglePump,
  } = useWaterLevel();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" style={{ marginTop: 10 }} />
        </TouchableOpacity>
        <Text style={styles.title}>Water Level</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.levelsContainer}>
          <View style={styles.box}>
            <Svg width={200} height={200} viewBox="0 0 100 100">
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
                {Math.round(waterLevel * 100)}%
              </SvgText>
              <SvgText
                x="41"
                y="47"
                textAnchor="middle"
                fontSize="7"
                fill="#0a0a0a"
                dy="16"
              >
                approx.{Math.round(waterLevel * 20)}ml
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
        </View>
        <View style={styles.horizontalLine} />
        <Text style={styles.summaryText}>Summary Graph</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
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
    marginTop: 5,
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
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 2, // Increase the width to make it more visible
    marginVertical: 20,
    width: '100%', // Ensure it spans the full width
  },
  summaryText: {
    fontFamily: 'outfit-bold',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 5,
  },
});