import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

// Define types for the fetched data
interface PastConsumptionProps {
    data: { date: string; consumption: number }[];
}

// Dummy Data for testing
const testData = [
    { date: '20 Aug', consumption: 10 },
    { date: '21 Aug', consumption: 15 },
    { date: '22 Aug', consumption: 7 },
    { date: '23 Aug', consumption: 20 },
    { date: '24 Aug', consumption: 13 },
    { date: '25 Aug', consumption: 18 },
    { date: '26 Aug', consumption: 12 },
];

export default function PastConsumption({ data = testData }: PastConsumptionProps) {
    const barData = data.map(item => {
        // Convert the date format to "Aug 20", "Aug 21"
        const [day, month] = item.date.split(' ');
        const formattedDate = `${month} ${day}`;

        return {
            label: formattedDate,
            value: item.consumption,
            frontColor: '#007BA7', // Customize the bar color here
        };
    });

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                    data={barData}
                    barWidth={35}
                    barBorderRadius={4}
                    width={barData.length * 60} // Adjust width based on the number of bars
                    noOfSections={5}
                    maxValue={50} // Adjust this to your maximum expected value
                    stepValue={10} // Interval steps for Y-axis
                    yAxisLabelTexts={['0', '10', '20', '30', '40', '50']}
                    initialSpacing={20} // Adds some initial spacing on the left
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        width: width - 40, // Full screen width minus 20px margin on each side
        marginVertical: 20, // Added margin for spacing from other components
    },
});
