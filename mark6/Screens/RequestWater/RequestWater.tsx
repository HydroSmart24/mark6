import React from 'react'
import { SafeAreaView, ScrollView } from 'react-native';
import CardView from '../../components/CardView/RequestWaterCardView';

export default function RequestWater() {

    const handleRequestPress = () => {
        console.log('Request button pressed');//Modal should be pooped up.
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <CardView 
                    title="Tank 01"
                    availableLiters={300}
                    onRequestPress={handleRequestPress}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
