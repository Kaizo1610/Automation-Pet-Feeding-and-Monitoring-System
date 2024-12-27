import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from './../../constants/Colors'
import { requestNotificationPermission } from './../../configs/FirebaseConfig';

export default function notifications() {

  const router=useRouter();

  const [deviceAlertEnabled, setDeviceAlertEnabled] = useState(false);
  const [systemNotificationEnabled, setSystemNotificationEnabled] = useState(false);

  const handleDeviceAlertToggle = async (value) => {
    setDeviceAlertEnabled(value);
    if (value) {
      const token = await requestNotificationPermission();
      if (token) {
        // Save the token to your backend or use it to send notifications
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={()=>router.back()} style={{marginTop:10}}>
      <Ionicons name="arrow-back" size={28} color="black" />    
      </TouchableOpacity>
        <Text style={styles.title}>Notifications Settings</Text>
      </View>

      <View style={styles.settings}>
        <View style={styles.setting1}>
          <Text style={styles.settingTitle1}>Device Alert</Text>
          <Switch
            value={deviceAlertEnabled}
            onValueChange={handleDeviceAlertToggle}
            trackColor={{ false: 'GRAY', true: '#f0f0f0' }}
            thumbColor={deviceAlertEnabled ? '#F2982F' : '#FFFFFF'}
          />
        </View>
        <View style={styles.setting2}>
          <Text style={styles.settingTitle2}>Get Notified by</Text>
        </View>
        <View style={styles.setting3}>
          <View style={styles.setting4}>
          <Text style={styles.settingTitle1}>System Notification</Text>
          <Text style={styles.settingDescription}>
            Pushed to the notification bar.
          </Text>
          </View>
          <Switch style={styles.switch1}
            value={systemNotificationEnabled}
            onValueChange={setSystemNotificationEnabled}
            trackColor={{ false: 'GRAY', true: '#f0f0f0' }}
            thumbColor={systemNotificationEnabled ? '#F2982F' : '#FFFFFF'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    marginLeft: 55,
    marginTop: 80,
    alignItems:'center'
  },
  settings: {
    paddingHorizontal: 16,
  },
  setting1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BLACK,
  },
  setting2:{
    marginTop:2,
    paddingLeft: 12,
    marginBottom: 15
  },
  setting3: {
    flexDirection:'row',
    paddingLeft: 12,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setting4: {
    flexDirection: 'column'
  },
  settingTitle1: {
    fontSize: 18,
    fontFamily:'outfit-medium'
  },
  settingTitle2: {
    fontSize: 12,
    fontFamily:'outfit-bold'
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.GRAY,
    fontFamily: 'outfit'
  },
  switch1: {
    marginTop:5,
    marginRight:12
  }
});
