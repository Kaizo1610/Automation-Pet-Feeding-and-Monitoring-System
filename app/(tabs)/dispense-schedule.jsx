import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Animated, Image, Vibration } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from './../../constants/Colors';
import { useNavigation, useRouter } from 'expo-router';
import { getCurrentUserId, firestore } from './../../configs/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { ref, set } from 'firebase/database'; 
import { database } from '../../configs/FirebaseConfig';
import { useFoodLevel } from '../(dashboard-logic)/foodData';
import { useWaterLevel } from '../(dashboard-logic)/waterData';
import { registerBackgroundFetch } from './../../configs/FirebaseConfig';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';

export default function DispenseSchedule() {

  const router = useRouter();

  const navigation = useNavigation();

  const [selectedIcon, setSelectedIcon] = useState('fish');

  const [feedingSchedules, setFeedingSchedules] = useState([]);

  const [wateringSchedules, setWateringSchedules] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [portions, setPortions] = useState('');
  const [animationVisible, setAnimationVisible] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));
  const [currentPortion, setCurrentPortion] = useState(0);

  const { toggleServo } = useFoodLevel();
  const { togglePump } = useWaterLevel();

  useEffect(() => {
    const fetchSchedules = async () => {
      const userId = getCurrentUserId();
      if (!userId) {
        console.error("User not authenticated");
        return;
      }
  
      try {
        const collectionName = selectedIcon === 'fish' ? 'feedingSchedules' : 'wateringSchedules';
        const querySnapshot = await getDocs(collection(firestore, `users/${userId}/${collectionName}`));
        const fetchedSchedules = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        fetchedSchedules.sort((a, b) => {
          const [aHours, aMinutes] = a.time.split(':').map(Number);
          const [bHours, bMinutes] = b.time.split(':').map(Number);
          return aHours - bHours || aMinutes - bMinutes;
        }); 
        if (selectedIcon === 'fish') {
          setFeedingSchedules(fetchedSchedules);
        } else {
          setWateringSchedules(fetchedSchedules);
        }
      } catch (error) {
        console.error("Error fetching schedules: ", error);
      }
    };
  
    fetchSchedules();
  }, [selectedIcon, router]);

  useEffect(() => {
    registerBackgroundFetch();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => checkScheduledTimes(schedules), 60000); // Check every minute
  
    return () => {
      clearInterval(intervalId);
    };
  }, [schedules, selectedIcon]); // Runs whenever schedules or selectedIcon change
  
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data.screen;
      if (screen) {
        router.push(screen);
      }
    });
  
    return () => subscription.remove();
  }, []);

  const toggleSchedule = (id) => {
    const toggleFunc = selectedIcon === 'fish' ? setFeedingSchedules : setWateringSchedules;

    toggleFunc((prevSchedules) =>
      prevSchedules.map((schedule) =>
        schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule
      )
    );
  };

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <Checkbox
        value={item.enabled}
        onValueChange={() => toggleSchedule(item.id)}
        style={styles.checkbox}
      />
      <Text style={styles.scheduleText}>{item.time}</Text>
      <Text style={styles.portionText}>{item.portions}</Text>
      <View
        style={styles.arrow}
        onPress={() => router.push({
          pathname: editScheduleRoute,
          params: { 
            id: item.id, 
            time: item.time, 
            portions: item.portions 
          }
        })}
      >
        <Text style={styles.arrowText}>&gt;</Text>
      </View>
    </View>
  );

  const schedules = selectedIcon === 'fish' ? feedingSchedules : wateringSchedules;
  const scheduleTitle = selectedIcon === 'fish' ? 'Automatic Feeding Scheduling' : 'Automatic Watering Scheduling';
  const manualDispenseLabel = selectedIcon === 'fish' ? 'Manual Dispense Food' : 'Manual Dispense Water';
  const addScheduleLabel = selectedIcon === 'fish' ? 'Add Feeding Schedule' : 'Add Watering Schedule';

  const deleteScheduleRoute = selectedIcon === 'fish' ? '(dispense-food)/delete-schedule' : '(dispense-water)/delete-schedule';
  const addScheduleRoute = selectedIcon === 'fish' ? '(dispense-food)/add-schedule' : '(dispense-water)/add-schedule';
  const editScheduleRoute = selectedIcon === 'fish' ? '(dispense-food)/edit-schedule' : '(dispense-water)/edit-schedule';

  const handleSave = async () => {
    setModalVisible(false);
    setAnimationVisible(true);
    setCurrentPortion(0);
    Animated.timing(animationValue, {
      toValue: 1,
      duration: portions * 2000, // 2 seconds per portion
      useNativeDriver: true,
    }).start(() => {
      setAnimationVisible(false);
      animationValue.setValue(0);
    });

    const interval = setInterval(() => {
      setCurrentPortion((prev) => {
        if (prev < portions) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 2000);

    Vibration.vibrate();
    const { sound } = await Audio.Sound.createAsync(require('./../../assets/sounds/success.mp3'));
    await sound.playAsync();

    if (selectedIcon === 'fish') {
      toggleServo(true);
      setTimeout(() => {
        toggleServo(false);
      }, portions * 2000); // 2 seconds per portion

      // Log manual food dispense
      await logManualDispense('food', portions);
    } else {
      togglePump(true);
      setTimeout(() => {
        togglePump(false);
      }, portions * 2000); // 2 seconds per portion

      // Log manual water dispense
      await logManualDispense('water', portions);
    }
  };

  const logManualDispense = async (type, portions) => {
    try {
      const currentTime = Date.now();
      const logRef = ref(database, `${type}Dispenses/${currentTime}`);
      await set(logRef, {
        dispenseTime: currentTime,
        portions: portions,
      });
      console.log(`Manual ${type} dispense logged: ${portions} portions`);
    } catch (error) {
      if (error.code === 'PERMISSION_DENIED') {
        console.error(`Permission denied while logging manual ${type} dispense:`, error);
      } else {
        console.error(`Error logging manual ${type} dispense:`, error);
      }
    }
  };

  const handleCancel = () => {
    setPortions('');   // Reset values
    setModalVisible(false);
  };

  const scheduleNotification = async (title, body, trigger) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        sound: 'default', // Add sound for the notification
        data: { screen: 'DispenseSchedule' }, // Add data to navigate to the specific screen
      },
      trigger: trigger,
    });
  };

  const checkScheduledTimes = (schedules) => {
    const currentTime = new Date();
    const currentHours = String(currentTime.getHours()).padStart(2, '0');
    const currentMinutes = String(currentTime.getMinutes()).padStart(2, '0');
    const formattedCurrentTime = `${currentHours}:${currentMinutes}`;
  
    schedules.forEach((schedule) => {
      if (schedule.time === formattedCurrentTime && schedule.enabled) {
        const portions = parseInt(schedule.portions, 10);
        const duration = portions * 2000; // Duration in milliseconds (2 seconds per portion)
  
        if (selectedIcon === 'fish') {
          setTimeout(() => {
            toggleServo(true); // Turn on the servo
  
            setTimeout(() => {
              toggleServo(false); // Turn off the servo
              alert(`Successfully dispensed ${portions} portions of food at ${formattedCurrentTime}`);
            }, duration);
          }, 100); // Delay of 0.1 seconds
        } else {
          setTimeout(() => {
            togglePump(true); // Turn on the pump
  
            setTimeout(() => {
              togglePump(false); // Turn off the pump
              alert(`Successfully dispensed ${portions} portions of water at ${formattedCurrentTime}`);
            }, duration);
          }, 100); // Delay of 0.1 seconds
        }
  
        // Schedule notification
        scheduleNotification(
          'Dispense Notification',
          `${portions} portions successfully been dispensed for ${selectedIcon === 'fish' ? 'food' : 'water'} schedule.`,
          { seconds: 1 } // Trigger notification after 1 seconds
        );
      }
    });
  };
  
  // UseEffect for checking scheduled times
  useEffect(() => {
    const intervalId = setInterval(() => checkScheduledTimes(schedules), 60000); // Check every minute
  
    return () => {
      clearInterval(intervalId);
    };
  }, [schedules, selectedIcon]); // Runs whenever schedules or selectedIcon change
  
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data.screen;
      if (screen) {
        router.push(screen);
      }
    });
  
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Dispense scheduling</Text>

      {/* Icon Row */}
      <View style={styles.iconRow}>
        <TouchableOpacity
          style={[styles.icon2, selectedIcon === 'fish' && styles.activeIcon]}
          onPress={() => setSelectedIcon('fish')}
        >
          <Ionicons name="fish-sharp" size={30} color={selectedIcon === 'fish' ? Colors.BLACK : Colors.BLACK} style={{ marginLeft: 10 }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.icon1, selectedIcon === 'wave' && styles.activeIcon]}
          onPress={() => setSelectedIcon('wave')}
        >
          <Ionicons name="water-sharp" size={30} color={selectedIcon === 'wave' ? Colors.BLACK : Colors.BLACK} />
        </TouchableOpacity>
      </View>

      {/* Scheduling Card */}
      <View style={styles.card}>
        <View style={styles.title}>
          <Text style={styles.cardTitle}>{scheduleTitle}</Text>
          <TouchableOpacity style={styles.icon3} onPress={() => router.push(deleteScheduleRoute)}>
            <Ionicons name="trash-bin-sharp" size={25} color="white" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={schedules}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.id}
        />
        <TouchableOpacity style={styles.addScheduleButton} onPress={() => router.push(addScheduleRoute)}>
          <Text style={styles.addScheduleText}>{addScheduleLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* Manual dispense button */}
      <View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.setPortions1}>
        <Text style={styles.buttonText1}>{manualDispenseLabel}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer1}>
          <View style={styles.modalContent1}>
            <Text style={styles.modalTitle1}>Portions manually to dispense</Text>

            <View style={styles.inputContainer1}>
              <TextInput
                style={styles.portionsInput1}
                keyboardType="numeric"
                value={portions}
                onChangeText={setPortions}
                maxLength={2} // Only allows 2 digits
              />
              <Text style={styles.portionsLabel1}>Portions</Text>

            </View>

            <View style={styles.buttonContainer1}>
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton1}>
                <Text style={styles.cancelButtonText1}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSave} style={styles.okButton1}>
                <Text style={styles.okButtonText1 }>Dispense</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={animationVisible} transparent={true} animationType="fade">
        <View style={styles.animationModalContainer}>
          <Animated.View style={[styles.animationContainer, { opacity: animationValue }]}>
            <Text style={styles.animationText}>Dispensing {currentPortion} of {portions} portions...</Text>
            {selectedIcon === 'fish' ? (
              <Image source={require('./../../assets/images/oyen.png')} style={styles.dispenseMachine} />
            ) : (
              <Image source={require('./../../assets/images/john.png')} style={styles.dispenseMachine} />
            )}
          </Animated.View>
        </View>
      </Modal>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  header: {
    fontSize: 28,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 50,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  icon1: {
    backgroundColor: 'lightblue',
    height: 40,
    width: '12%',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  icon2: {
    backgroundColor: 'lightblue',
    height: 40,
    width: '12%',
    justifyContent: 'center',
    paddingRight: 5,
  },
  activeIcon: {
    backgroundColor: Colors.PRIMARY,
  },
  icon3: {
    backgroundColor: Colors.PRIMARY,
    width: '10%',
    height: 32,
    paddingLeft: 4,
    justifyContent: 'center',
    borderRadius: 10,
    marginLeft: 15,
    paddingRight: 2,
    marginBottom: 20,
  },
  arrowText: {
    fontSize: 24,
    marginLeft: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  checkbox: {
    marginRight: 10,
  },
  scheduleText: {
    fontSize: 16,
    flex: 1,
  },
  portionText: {
    fontSize: 14,
    color: '#888',
  },
  addScheduleButton: {
    backgroundColor: 'lightblue',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width:'90%',
    marginLeft:20
  },
  addScheduleText: {
    color: Colors.BLACK,
    fontFamily: 'outfit-bold',
    fontSize: 18,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setPortions1: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width:'80%',
    marginLeft: 40
  },
  buttonText1: {
    color: Colors.WHITE,
    fontSize: 18,
    fontFamily:'outfit-bold',
  },
  modalContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent1: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle1: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    marginBottom: 20,
    justifyContent:'center',
    marginBottom: 70
  },
  inputContainer1: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 90,
  },
  portionsInput1: {
    backgroundColor:Colors.PRIMARY,
    width: 80,
    height: 80,
    fontSize: 30,
    textAlign: 'center',
    padding: 15,
    borderRadius: 8,
    fontFamily:'outfit-bold'
  },
  portionsLabel1: {
    fontSize: 18,
    marginHorizontal: 10,
    marginTop:10,
    fontFamily:'outfit'
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton1: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: Colors.LIGHTGRAY,
    width: '45%',
    alignItems: 'center',
  },
  cancelButtonText1: {
    fontSize: 16,
    color: Colors.BLACK,
    fontFamily:'outfit-bold'
  },
  okButton1: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: Colors.PRIMARY,
    width: '45%',
    alignItems: 'center',
  },
  okButtonText1: {
    fontSize: 16,
    color: 'white',
    fontFamily:'outfit-bold'
  },
  animationModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  animationContainer: {
    backgroundColor: 'lightblue',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  animationText: {
    color: Colors.WHITE,
    fontSize: 22,
    fontFamily: 'outfit-bold',
  },
  dispenseMachine: {
    width: 100,
    height: 100,
  },
});
