import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {Colors} from './../../constants/Colors'


export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown:false,
      tabBarActiveTintColor:Colors.PRIMARY,
    }}>
      <Tabs.Screen name="homepage"
        options={{
          tabBarLabel:'',
          tabBarIcon:({color})=><Ionicons name="home-sharp" size={34} color={color} />
        }}
      />
      <Tabs.Screen name="pet-profile"
       options={{
          tabBarLabel:'',
          tabBarIcon:({color})=><Ionicons name="paw-sharp" size={34} color={color} />
        }}
      />
      <Tabs.Screen name="dispense-schedule"
       options={{
        tabBarLabel:'',
        tabBarIcon:({color})=><FontAwesome5 name="equals" size={34} color={color} />
        }}
      />
    </Tabs>
  )
}