import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'

export default function Loading() {

  const router=useRouter();

  useEffect(()=>{
    const timer=setTimeout(()=>{
      router.replace('auth/login');
    },2000);

    return ()=> clearTimeout(timer);
  },[router]);

  return (
    <View>
      <Image style={{
        justifyContent:'center',
        alignItems:'center',
        marginBottom: 200
      }} 
      source={require('./../assets/images/pawtectorLogo.png')}/>

      <View>
        <Text style={{
          fontFamily:'outfit-bold',
          fontSize:45,
          marginTop:100,
          textAlign:'center'
        }}>
            Loading...
        </Text>
      </View>

    </View>
  )
}