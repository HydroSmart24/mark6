import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window'); // Get the screen width

export default function CustomHeader({ userName }: { userName: string }) {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
   
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
          <MaterialCommunityIcons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionText}>Connected to Tank</Text>
        </View>
      </View>

      
      <View style={styles.rightSection}>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarContainer}>
        
          <View style={styles.avatar} />
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
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionStatus: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#C4C4C4', // Grey circle as placeholder avatar
  },
});
