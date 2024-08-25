import React from 'react';
import { View, Text, StyleSheet } from 'react-native'; // Import the 'Text' component from 'react-native'
import TankLevel from '../../components/AvailableTank/TankLevel'; // Adjust the path based on your file structure

export default function AvailableScreen() {
    return (
        <View style={styles.container}>
            <TankLevel />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centers vertically
        alignItems: 'center', // Centers horizontally
        backgroundColor: '#f5f5f5', // Optional: Set a background color for the screen
    },
});
