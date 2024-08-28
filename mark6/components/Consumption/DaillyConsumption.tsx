import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DailyConsumptionProps {
    date: string;
    amount: number;
}

export default function DailyConsumption({ date, amount }: DailyConsumptionProps) {
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Text style={styles.titleText}>Water Consumption</Text>
                <Text style={styles.dateText}>{date}</Text>
            </View>
            <View style={styles.rightContainer}>
                <Text style={styles.amountText}>{amount}</Text>
                <Text style={styles.unitText}>Liters</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 30,
        paddingVertical: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        width: '90%', 
    },
    leftContainer: {
        justifyContent: 'center',
    },
    rightContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 16,
        color: '#7E7E7E',
        fontWeight: '400',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 24,
        color: '#7E7E7E',
        fontWeight: 'bold',
    },
    amountText: {
        fontSize: 42,
        color: '#007BA7',
        fontWeight: 'bold',
    },
    unitText: {
        fontSize: 14,
        color: '#007BA7',
    },
});
