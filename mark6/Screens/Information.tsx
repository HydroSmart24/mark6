import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ContactInfoCard from '../components/InfoCards/Contact';
import LogoutCard from '../components/InfoCards/Logout';

const Information: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
     
      <ContactInfoCard />
      <LogoutCard />
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
});

export default Information;
