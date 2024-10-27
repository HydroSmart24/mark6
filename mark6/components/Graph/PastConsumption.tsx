import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Picker } from '@react-native-picker/picker'; // Import Picker from the correct package
import i18n from '../../i18n';

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
                <Text style={styles.headerText}>{i18n.t('past_consumption')}</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={selectedMonth}
                    onValueChange={(itemValue: string) => setSelectedMonth(itemValue)}
                >
                    <Picker.Item label={i18n.t('jan')} value="January" />
                    <Picker.Item label={i18n.t('feb')} value="February" />
                    <Picker.Item label={i18n.t('mar')} value="March" />
                    <Picker.Item label={i18n.t('apr')} value="April" />
                    <Picker.Item label={i18n.t('may')} value="May" />
                    <Picker.Item label={i18n.t('jun')} value="June" />
                    <Picker.Item label={i18n.t('jul')} value="July" />
                    <Picker.Item label={i18n.t('aug')} value="August" />
                    <Picker.Item label={i18n.t('sep')} value="September" />
                    <Picker.Item label={i18n.t('oct')} value="October" />
                    <Picker.Item label={i18n.t('nov')} value="November" />
                    <Picker.Item label={i18n.t('dec')} value="December" />
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
