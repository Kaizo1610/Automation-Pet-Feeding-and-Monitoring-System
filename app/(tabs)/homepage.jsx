import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, Button, ScrollView, Image, FlatList, Dimensions } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Colors } from './../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFoodLevel } from '../(dashboard-logic)/foodData';
import { useWaterLevel } from '../(dashboard-logic)/waterData';
import { getCurrentUserId, firestore } from './../../configs/FirebaseConfig';
import { onSnapshot, doc, getDocs, collection } from "firebase/firestore";

export default function Homepage() {  
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [username, setUsername] = useState('');
  const [petsCount, setPetsCount] = useState(0);
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

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) throw new Error("User not authenticated");

        const userDocRef = doc(firestore, 'users', userId);
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
          const data = doc.data();
          setUsername(data && data.username ? data.username.toUpperCase() : 'PET LOVERS');
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Failed to fetch username:", error);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchPetsCount = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) throw new Error("User not authenticated");

        const petsCollectionRef = collection(firestore, `users/${userId}/pets`);
        const querySnapshot = await getDocs(petsCollectionRef);
        setPetsCount(querySnapshot.size);
      } catch (error) {
        console.error("Failed to fetch pets count:", error);
      }
    };

    fetchPetsCount();
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
    weeklyData: foodWeeklyData,
  } = useFoodLevel();

  const {
    waterLevel,
    isPumpOn,
    togglePump,
    weeklyData: waterWeeklyData,
  } = useWaterLevel();

  const todayFoodDispenses = foodWeeklyData[6]; // Assuming the last element is for today
  const todayWaterDispenses = waterWeeklyData[6]; // Assuming the last element is for today

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
        <Text style={styles.greeting}>HELLO {username}!!🤗</Text>

        {/* Image Carousel */}
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          renderItem={({ item, index }) => (
            <View style={styles.carouselItem}>
              <Image source={item} style={styles.promoteImage} />
              {index === 0 && (
                <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('(home)/explore')}>
                  <Text style={styles.exploreButtonText}>Explore More</Text>
                </TouchableOpacity>
              )}
            </View>
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

        {/* Levels Container */}
        <View style={styles.levelsContainer}>
          {/* Food Level Box */}
          <TouchableOpacity style={styles.box} onPress={() => router.push('(analytics)/food-level')}>
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
                approx.{Math.round(foodLevel * 3000)}ml
              </SvgText>
            </Svg>
          </TouchableOpacity>

          {/* Water Level Box */}
          <TouchableOpacity style={styles.box} onPress={() => router.push('(analytics)/water-level')}>
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
                approx.{Math.round(waterLevel * 800)}ml
              </SvgText>
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Dashboard Box */}
        <View style={styles.dashboardBox}>
          <View style={styles.dashboardContent}>
            <View style={styles.dashboardItem}>
              <FontAwesome name="paw" size={32} color="black" />
              <Text style={styles.dashboardNumber}>You own {petsCount} pets for now!😎</Text>
            </View>
            <View style={styles.dashboardItem}>
              <Ionicons name="fish" size={32} color="black" />
              <Text style={styles.dashboardNumber}>You managed to dispense food   {todayFoodDispenses} times for today!😻</Text>
            </View>
            <View style={styles.dashboardItem}>
              <FontAwesome name="tint" size={38} color="black" />
              <Text style={styles.dashboardNumber}>You managed to dispense water   {todayWaterDispenses} times for today!😽</Text>
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
    backgroundColor: 'white',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  },
  icon1: {
    paddingLeft: 5,
    paddingTop: 60
  },
  icon2: {
    paddingLeft: 250,
    paddingTop: 60
  },
  icon3: {
    paddingRight: 5,
    paddingTop: 60
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop:20,
    fontFamily: 'outfit-bold',
    color: 'black',
  },
  levelsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  box: {
    width: '100%',
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
    marginBottom: 20,
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
    fontSize: 25,
    fontFamily: 'outfit-bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center', // Center the text
    width: '100%',
  },
  dashboardBox: {
    width: '90%',
    backgroundColor: 'lightblue',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center', // Center the box
  },
  dashboardContent: {
    flexDirection: 'column',
    justifyContent: 'center', // Center the content
    width: '100%',
  },
  dashboardItem: {
    flexDirection: 'row',
    alignItems: 'left', 
    marginBottom: 15,
  },
  dashboardGap: {
    width: 30, // Add a gap between items
  },
  dashboardNumber: {
    fontSize: 20,
    fontFamily: 'outfit-medium',
    color: Colors.BLACK,
    marginLeft: 10,
    textAlign: 'left',
  },
  dashboardText: {
    fontSize: 18,
    fontFamily: 'outfit-medium',
    color: '#555',
  },
  carouselItem: {
    position: 'relative',
  },
  exploreButton: {
    position: 'absolute',
    top: 10,
    right: 5,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  exploreButtonText: {
    color: Colors.WHITE,
    fontSize: 22,
    fontFamily: 'outfit-bold',
  },
});