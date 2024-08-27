import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import TankLevel from '../../components/AvailableTank/TankLevel';
import DailyConsumption from '../../components/Consumption/DaillyConsumption';
import PastConsumption from '../../components/Graph/PastConsumption';

const testData = [
    { date: '20 Aug', consumption: 10 },
    { date: '21 Aug', consumption: 15 },
    { date: '22 Aug', consumption: 7 },
    { date: '23 Aug', consumption: 20 },
    { date: '24 Aug', consumption: 13 },
    { date: '25 Aug', consumption: 18 },
    { date: '26 Aug', consumption: 12 },
];

export default function AvailableScreen() {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.tankLevelContainer}>
                <TankLevel />
            </View>
            <View style={styles.consumptionContainer}>
                <DailyConsumption date="27th Aug" amount={12} />
            </View>
            <View style={styles.pastConsumptionContainer}>
                <PastConsumption data={testData} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start', 
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 20,
    },
    tankLevelContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    consumptionContainer: {
        width: '100%', 
        alignItems: 'center', 
    },
    pastConsumptionContainer: {
        width: '100%', 
        alignItems: 'center', 
        marginTop: 20, // Add some space between DailyConsumption and PastConsumption
    },
});
