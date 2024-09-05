import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ContactInfoCard from '../components/InfoCards/Contact';

const Information: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
     
      <ContactInfoCard />
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
