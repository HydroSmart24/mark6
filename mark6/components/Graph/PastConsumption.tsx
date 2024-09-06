import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Picker } from '@react-native-picker/picker'; // Import Picker from the correct package

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
        const [day, month] = item.date.split(' ');
        const formattedDate = `${month} ${day}`;

        return {
            label: formattedDate,
            value: item.consumption,
            frontColor: '#007BA7',
        };
    });

    const [selectedMonth, setSelectedMonth] = React.useState('August'); // State for selected month

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Past Consumption</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={selectedMonth}
                    onValueChange={(itemValue: string) => setSelectedMonth(itemValue)}
                >
                    <Picker.Item label="January" value="January" />
                    <Picker.Item label="February" value="February" />
                    <Picker.Item label="March" value="March" />
                    <Picker.Item label="April" value="April" />
                    <Picker.Item label="May" value="May" />
                    <Picker.Item label="June" value="June" />
                    <Picker.Item label="July" value="July" />
                    <Picker.Item label="August" value="August" />
                    <Picker.Item label="September" value="September" />
                    <Picker.Item label="October" value="October" />
                    <Picker.Item label="November" value="November" />
                    <Picker.Item label="December" value="December" />
                </Picker>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                    data={barData}
                    barWidth={35}
                    barBorderRadius={4}
                    width={barData.length * 60}
                    noOfSections={5}
                    maxValue={50}
                    stepValue={10}
                    yAxisLabelTexts={['0', '10', '20', '30', '40', '50']}
                    initialSpacing={20}
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
        width: width - 40,
        marginVertical: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 16,
        color: '#7E7E7E',
    },
    picker: {
        height: 40,
        width: 120,
        color: 'black',
        backgroundColor: '#EFEFEF',
        borderRadius: 10,
    },
});
