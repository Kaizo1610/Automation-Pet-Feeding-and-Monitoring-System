import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, Button, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from './../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFoodLevel } from '../(dashboard-logic)/foodData';
import { useWaterLevel } from '../(dashboard-logic)/waterData';

export default function Homepage() {  
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    require('./../../assets/images/promote.png'),
    require('./../../assets/images/playingcat.jpg'),
    require('./../../assets/images/feedingcat.jpg')
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

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
        {/* Greeting */}
        <Text style={styles.greeting}>HELLO PET LOVERS!!🤗</Text>

        {/* Image Carousel */}
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          renderItem={({ item }) => (
            <Image source={item} style={styles.promoteImage} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        {/*Real Time Digital*/}
        <View style={styles.timeContainer}>
          <View style={styles.line} />
          <View style={styles.timeBox}>
            <Text style={styles.timeText}>
              {currentTime.toLocaleTimeString()}
            </Text>
          </View>
          <View style={styles.line} />
        </View>

        {/* Levels Container */}
        <View style={styles.levelsContainer}>
          {/* Food Level Box */}
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

          {/* Water Level Box */}
          <View style={styles.box}>
            <Text style={styles.title}>Water Level</Text>
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
                est.{Math.round(waterLevel * 20)}ml
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
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Set Timer(minutes):</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={timerValue}
                onChangeText={setTimerValue}
              />
              <Button title="Set Timer" onPress={updateTimerValue} color="#4CAF50" />
            </View>
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
    marginBottom: 5,
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
    backgroundColor: Colors.SECONDARY,
    paddingVertical: 20,
  },
  promoteImage: {
    width: Dimensions.get('window').width,
    height: 250,
    marginBottom: 20,
    borderRadius: 15,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#000',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#000',
    marginHorizontal: 10,
  },
  timeBox: {
    backgroundColor: 'lightblue',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 24,
    fontFamily: 'outfit-medium',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop:20,
    fontFamily: 'outfit-bold',
    color: 'black',
  },
  levelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  box: {
    width: '48%',
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
  greeting: {
    fontSize: 26,
    fontFamily: 'outfit-bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'left',
    width: '100%',
    paddingLeft: 20,
  },
});