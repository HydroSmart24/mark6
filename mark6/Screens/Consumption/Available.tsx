import React from 'react';
import { View, StyleSheet } from 'react-native';
import TankLevel from '../../components/AvailableTank/TankLevel';
import DailyConsumption from '../../components/Consumption/DaillyConsumption';

export default function AvailableScreen() {
 
    return (
        <View style={styles.container}>
            <View style={styles.tankLevelContainer}>
                <TankLevel />
            </View>
            <View style={styles.consumptionContainer}>
                <DailyConsumption date="27th Aug" amount={12} />
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    
});
