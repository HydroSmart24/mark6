import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TankLevel from '../../components/AvailableTank/TankLevel'; // Adjust the path based on your file structure

export default function AvailableScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.tankLevelContainer}>
                <TankLevel />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Water consumption for 26th Aug</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between', // Space between TankLevel and the info box
        alignItems: 'center',
        backgroundColor: '#f5f5f5', // Optional: Set a background color for the screen
        paddingVertical: 20, // Add some padding to top and bottom
    },
    tankLevelContainer: {
        width: '100%',
        alignItems: 'center', // Center the TankLevel horizontally
        marginBottom: 20, // Optional: Add some space below the TankLevel
    },
    infoContainer: {
        width: '85%', // Set width to 85% of the screen
        backgroundColor: '#007BA7', // Background color for the rectangle
        padding: 15, // Add some padding inside the rectangle
        borderRadius: 10, // Optional: Add rounded corners
        alignItems: 'center', // Center the text horizontally
    },
    infoText: {
        color: 'white', // Text color
        fontSize: 16, // Text size
        fontWeight: 'bold', // Make the text bold
    },
});
