import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window'); // Get the screen width

interface CustomHeaderProps {
  userName: string;
}

export default function CustomHeader({ userName }: CustomHeaderProps) {
  const navigation = useNavigation();

  // Extract the first letter of the user's name
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : '?';

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <MaterialCommunityIcons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.connectionStatusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.connectionText}>Connected to Tank</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstLetter}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%', // Make the header take up the full width of the screen
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25, // Increased padding on both left and right sides
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#25B34F', 
    marginRight: 8,
  },
  connectionText: {
    color: 'black',
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginLeft: 10,
  },
  avatar: {
    width: 40, 
    height: 40,
    borderRadius: 20, 
    backgroundColor: '#C4C4C4', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, 
    borderColor: '#4299E1', 
  },
  avatarText: {
    fontSize: 18,
    color: 'white', 
    fontWeight: 'bold',
  },
});

