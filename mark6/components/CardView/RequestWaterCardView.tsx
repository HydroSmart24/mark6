import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CardProps {
    title: string;
    description: string;
    onRequestPress: () => void;
}
  
const CardView: React.FC<CardProps> = ({ title, description, onRequestPress }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <TouchableOpacity style={styles.button} onPress={onRequestPress}>
          <Text style={styles.buttonText}>Request</Text>
        </TouchableOpacity>
      </View>
    );
};
  
export default CardView;
  
  
const styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      marginVertical: 10,
      marginHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: '#666',
      marginBottom: 12,
    },
    button: {
      backgroundColor: '#4299E1',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 4,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
});
    