import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { fetchAverageDistance } from '../../utils/FetchDistance';

export default function TankLevel({ size = 200, style = {} }) {
    const [printedAverage, setPrintedAverage] = useState<number | null>(null);
    const [tankVolume, setTankVolume] = useState<number | null>(null);

    const animatedHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const updateData = async () => {
            const data = await fetchAverageDistance(printedAverage);
            if (data) {
                setPrintedAverage(data.average);
                setTankVolume(data.volume);
            }
        };

        updateData();
        const interval = setInterval(updateData, 180000); // 180000 ms = 3 minutes

        return () => clearInterval(interval); // Cleanup on unmount
    }, [printedAverage]);

    useEffect(() => {
        if (tankVolume !== null) {
            const fillHeight = (tankVolume / 5000) * 100;
            Animated.timing(animatedHeight, {
                toValue: fillHeight,
                duration: 2000, // 2 seconds duration for the animation
                useNativeDriver: false,
            }).start();
        }
    }, [tankVolume]);

    return (
        <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }, style]}>
            <Animated.View
                style={[
                    styles.fill,
                    {
                        height: animatedHeight.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%'],
                        }),
                    },
                ]}
            />
            <View style={styles.textContainer}>
                <Text style={[styles.volume, { fontSize: size / 6 }]}>
                    {tankVolume !== null ? tankVolume : 0}
                </Text>
                <Text style={[styles.liters, { fontSize: size / 12 }]}>liters</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    circle: {
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EFEFEF',
        overflow: 'hidden', // Ensure the fill doesn't overflow the circle
        position: 'relative',
    },
    fill: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#4299E1',
    },
    textContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    volume: {
        fontWeight: 'bold',
        color: 'black',
    },
    liters: {
        color: 'black',
    },
});
