import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, BackHandler } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Colors } from './../../constants/Colors'

export default function myProfile() {

  const router=useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  // Handle logout button press (show modal)
  const handleLogoutPress = () => {
    setModalVisible(true);
  };

  // Handle cancel button press (hide modal)
  const handleCancelLogout = () => {
    setModalVisible(false);
  };

  // Handle confirm logout (implement logout logic here)
  const handleConfirmLogout = () => {
    setModalVisible(false);

  // Exit the app and navigate to the home screen
  BackHandler.exitApp();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={()=>router.back()} style={{marginTop:10}}>
      <Ionicons name="arrow-back" size={28} color="black" />    
      </TouchableOpacity>
        <Text style={styles.headerText}>User Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={require('./../../assets/images/akim.jpg')} 
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Aiman Akim</Text>
        <Text style={styles.profileBio}>Always be positive</Text>
        <TouchableOpacity style={styles.editButton} onPress={()=>router.push('(my-profile)/edit-profile')}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={()=>router.push('(my-profile)/faq')}> 
          <Text style={styles.optionText}>FAQ</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={()=>router.push('(my-profile)/about-us')}>
          <Text style={styles.optionText}>About US</Text>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container1}>
      {/* Modal for Logout Confirmation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Logout?</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton1} onPress={handleCancelLogout}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton1} onPress={handleConfirmLogout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'outfit-bold',
    marginLeft: 85,
    marginTop:80,
    alignItems:'center'
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontFamily:'outfit-bold',
    marginBottom: 5,
  },
  profileBio: {
    fontSize: 16,
    fontFamily:'outfit',
    color:Colors.GRAY,
    marginBottom: 20
  },
  editButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom:40,
    width:'55%',
    marginLeft:15
  },
  editButtonText: {
    color: Colors.WHITE,
    fontFamily:'outfit-bold',
    fontSize:20,
    textAlign:'center'
  },
  optionsContainer: {
    marginBottom: 45
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHTGRAY,
  },
  optionText: {
    fontSize: 20,
    fontFamily:'outfit-medium'
  },
  arrow: {
    fontSize: 24,
  },
  logoutButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 35,
    width: '55%',
    marginLeft: 15
  },
  logoutButtonText: {
    color: Colors.WHITE,
    fontFamily:'outfit-bold',
    fontSize: 20,
    textAlign:'center'
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily:'outfit-bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 18,
    fontFamily:'outfit-medium',
    textAlign: 'center',
    marginBottom: 30,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton1: {
    backgroundColor: Colors.LIGHTGRAY,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  logoutButton1: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
  },
  cancelText: {
    color: Colors.BLACK,
    fontFamily:'outfit',
    fontSize:15
  },
  logoutText: {
    color: Colors.BLACK,
    fontFamily:'outfit',
    fontSize:15
  }
});
