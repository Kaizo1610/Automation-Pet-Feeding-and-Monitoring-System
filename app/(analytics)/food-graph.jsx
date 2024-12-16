import React from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useFoodLevel } from './../(dashboard-logic)/foodData';

export default function WeeklyDispenseGraph() {
  const { weeklyData } = useFoodLevel();
  const screenWidth = Dimensions.get('window').width;

  // Validate and clean data
  const cleanedData = weeklyData && weeklyData.length
    ? weeklyData.map((item) => (isNaN(item) ? 0 : Number(item)))
    : [0, 0, 0, 0, 0, 0, 0]; // Default data if invalid

  // console.log('Cleaned Data:', cleanedData); // Debugging log
  // console.log('Weekly Data:', weeklyData); // Debugging log

  return (
    <View style={styles.container1}>
      <Text style={styles.title1}>Food Dispenses Over the Past Week</Text>
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
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Light background
  },
  title1: {
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
