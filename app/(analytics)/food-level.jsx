import { View, Text, StyleSheet, Switch, TextInput, Button, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { useFoodLevel } from '../(dashboard-logic)/foodData';
import { LineChart } from 'react-native-chart-kit';

export default function foodLevel() {

  const router = useRouter();
  
  const {
    foodLevel,
    isServoOn,
    toggleServo,
  } = useFoodLevel();

  const { weeklyData } = useFoodLevel();
  const screenWidth = Dimensions.get('window').width;

  // Validate and clean data
  const cleanedData = weeklyData && weeklyData.length
    ? weeklyData.map((item) => (isNaN(item) ? 0 : Number(item)))
    : [3, 3, 4, 3, 3, 5, 1]; // Default data if invalid

  // console.log('Cleaned Data:', cleanedData); // Debugging log
  // console.log('Weekly Data:', weeklyData); // Debugging log

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            <Svg width={200} height={200} viewBox="0 0 100 100">
              <G rotation="-90" origin="50, 50">
                <Circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#E0E0E0"
                  strokeWidth="10"
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
                approx.{Math.round(foodLevel * 3000)}ml
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
          </View>
        </View>
        <View style={styles.horizontalLine} />
        <Text style={styles.summaryText}>Graph Summary</Text>
        </View>
    
      <View style={styles.containerchart}>
        <Text style={styles.titlechart}>Food Dispenses Over the Past Week</Text>
        <View style={styles.graphBox}>
        <LineChart
          data={{
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{ data: cleanedData }],
          }}
          width={screenWidth - 75} // Adjust width for padding
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            labelColor: (opacity = 1) => `rgba(0, 191, 255, ${opacity})`, // Light blue labels
            color: (opacity = 1) => `rgba(0, 191, 255, ${opacity})`,
            style: { borderRadius: 8 },
          }}
          style={styles.chartStyle}
        />
      </View>
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
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1, 
    borderStyle: 'dashed', // Make the line dashed
    marginVertical: 20,
    width: '100%', // Ensure it spans the full width
  },
  summaryText: {
    fontFamily: 'outfit-bold',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 5,
  },
  containerchart: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Light background
  },
  titlechart: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  graphBox: {
    backgroundColor: '#ffffff', // White box
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000', // Shadow for elevation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Android shadow
    alignItems: 'center', // Center the graph
    justifyContent: 'center',
  },
  chartStyle: {
    borderRadius: 8,
  },
});