import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from './../../constants/Colors'
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';


export default function FAQ() {

  const router=useRouter();

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    { question: 'What is PawTector?', answer: 'PawTector is ...' },
    { question: 'What PawTector can do?', answer: 'PawTector can ...' },
    { question: 'Why use PawTector?', answer: 'PawTector is useful because ...' },
    { question: 'How to connect PawTector with smart pet feeder?', answer: 'To connect ...' },
  ];

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={()=>router.back()}>
        <Ionicons name="arrow-back" size={28} color="black" style={{marginTop:10}} />
        <Text style={styles.headerTitle}>FAQ</Text>
      </TouchableOpacity>

      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqContainer}>
          <Pressable onPress={() => toggleFAQ(index)} style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Ionicons
              name={activeIndex === index ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="black"
            />
          </Pressable>
          {activeIndex === index && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 25,
    fontFamily:'outfit-bold',
    marginBottom: 10,
    textAlign:'center',
    marginTop: 100,
    marginLeft: 130
  },
  faqContainer: {
    marginBottom: 30,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHTGRAY,
  },
  faqQuestion: {
    fontSize: 18,
    fontFamily:'outfit-bold',
    color: Colors.PRIMARY, 
    justifyContent:'center'
  },
  faqAnswer: {
    marginTop: 10,
    fontFamily:'outfit-medium',
    fontSize: 14,
    color: Colors.BLACK,
  },
});
