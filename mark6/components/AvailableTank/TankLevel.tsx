import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchAverageDistance } from '../../utils/FetchDistance';

// Define the type for the navigation prop
type RootStackParamList = {
  AvailableScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TankLevelProps {
  size?: number;
  style?: object;
  clickable?: boolean;
}

export default function TankLevel({ size = 200, style = {}, clickable = false }: TankLevelProps) {
  const [printedAverage, setPrintedAverage] = useState<number | null>(null);
  const [tankVolume, setTankVolume] = useState<number | null>(null);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation<NavigationProp>();

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

  const handlePress = () => {
    if (clickable) {
      navigation.navigate('AvailableScreen'); 
    }
  };

  const interpolatedColor = animatedHeight.interpolate({
    inputRange: [0, 50, 100],
    outputRange: ['black', 'black', 'white'], 
    extrapolate: 'clamp', 
  });

  return (
    <TouchableOpacity onPress={handlePress} disabled={!clickable}>
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
          <Animated.Text style={[styles.volume, { fontSize: size / 6, color: interpolatedColor }]}>
            {tankVolume !== null ? tankVolume : 0}
          </Animated.Text>
          <Animated.Text style={[styles.liters, { fontSize: size / 12, color: interpolatedColor }]}>
            liters
          </Animated.Text>
        </View>
      </View>
    </TouchableOpacity>
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
  },
  liters: {},
});
