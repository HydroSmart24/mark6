import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Information: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Information Screen</Text>
      <Text style={styles.infoText}>This is a basic screen component.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
});

export default Information;
