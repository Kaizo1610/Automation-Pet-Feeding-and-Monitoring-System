import Checkbox from 'expo-checkbox';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { Colors } from './../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { getCurrentUserId, firestore } from './../../configs/FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function DeleteSchedule() {
  const router = useRouter();
  const [scheduleData, setScheduleData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      const userId = getCurrentUserId();
      if (!userId) {
        console.error("User not authenticated");
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(firestore, `users/${userId}/wateringSchedules`));
        const fetchedSchedules = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setScheduleData(fetchedSchedules);
      } catch (error) {
        console.error("Error fetching schedules: ", error);
      }
    };

    fetchSchedules();
  }, []);

  const handleCheckBox = (id) => {
    setScheduleData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.timeText}>{item.time}</Text>
      <Text style={styles.portionsText}>{item.portions}</Text>
      <Checkbox
        value={item.checked}
        onValueChange={() => handleCheckBox(item.id)}
        tintColors={{ true: '#F79C34', false: '#ccc' }}
        boxType="circle"
        style={styles.checkbox}
      />
    </View>
  );

  const handleDeletePress = () => {
    setModalVisible(true);
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
  };

  const handleConfirmDelete = () => {
    setModalVisible(false);
    // Implement delete logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 10 }}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Delete Watering Schedule</Text>
      </View>

      <View style={styles.container1}>
        <View style={styles.row1}>
          <Text style={styles.text1}>Time</Text>
          <Text style={styles.text2}>Portions</Text>
        </View>
        <FlatList
          data={scheduleData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <View style={styles.container2}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalOverlay1}>
            <View style={styles.modalView1}>
              <Text style={styles.modalTitle1}>Delete?</Text>
              <Text style={styles.modalMessage1}>Are you sure you want to delete?</Text>
              <View style={styles.modalButtons1}>
                <TouchableOpacity style={styles.cancelButton1} onPress={handleCancelDelete}>
                  <Text style={styles.cancelText1}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton1} onPress={handleConfirmDelete}>
                  <Text style={styles.deleteText1}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 22,
    fontFamily: 'outfit-bold',
    marginLeft: 40,
    marginTop: 60,
    textAlign:'center'
  },
  container1: {
    marginTop: 50
  },
  row1: {
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor: Colors.LIGHTGRAY
  },
  text1: {
    fontSize:18,
    fontFamily:'outfit-bold'
  },
  text2: {
    fontSize:18,
    fontFamily:'outfit-bold',
    marginLeft: 120
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  timeText: {
    fontSize: 16,
    fontFamily:'outfit',
  },
  portionsText: {
    fontSize: 14,
    fontFamily:'outfit',
    color: Colors.GRAY,
  },
  checkbox: {
    marginLeft: 10, // Optional: Adjust spacing between checkbox and text
  },
  deleteButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom:200,
    width:'80%',
    marginLeft: 40
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
    fontFamily:'outfit-bold',
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView1: {
    width: '80%',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle1: {
    fontSize: 22,
    fontFamily:'outfit-bold',
    marginBottom: 10,
  },
  modalMessage1: {
    fontSize: 18,
    fontFamily:'outfit-medium',
    textAlign: 'center',
    marginBottom: 30,
  },
  modalButtons1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton1: {
    backgroundColor: Colors.LIGHTGRAY,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton1: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
  },
  cancelText1: {
    color: Colors.BLACK,
    fontFamily:'outfit',
    fontSize:15
  },
  deleteText1: {
    color: Colors.BLACK,
    fontFamily:'outfit',
    fontSize:15
  }
});
