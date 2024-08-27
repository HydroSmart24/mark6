import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface HalfPremiumProps {
  size?: number;
  value?: number; // The dynamic value to be passed, optional
  marginTop?: number; // Optional marginTop prop
  marginBottom?: number; // Optional marginBottom prop
}

const HalfPremium: React.FC<HalfPremiumProps> = ({
  size = 80,
  value = 0,
  marginTop = 0, // Default to 0 if not provided
  marginBottom = 0, // Default to 0 if not provided
}) => {
  const adjustedSize = size / 2; // Adjust to scale the SVG correctly
  const strokeWidth = 3; // Fixed stroke width since we're working within a fixed viewBox
  const circleRadius = 16; // Radius is fixed according to the viewBox
  const progressStrokeWidth = 1; // Define the progress stroke width
  const circumference = 2 * Math.PI * circleRadius; // Calculate the circumference of the circle

  // Initialize animated values
  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedTextValue = useRef(new Animated.Value(0)).current;

  // Interpolating the animated value to get the strokeDashoffset
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, circumference / 2],
  });

  const [formattedValue, setFormattedValue] = useState('0%');

  // Determine colors based on value
  const circleStrokeColor = value <= 20 ? '#FEE2E2' : '#E0E7FF'; // red-100 or blue-100
  const progressStrokeColor = value <= 20 ? '#DC2626' : '#2563EB'; // red-600 or blue-600
  const textColor = value <= 20 ? '#DC2626' : '#2563EB'; // red-600 or blue-600

  useEffect(() => {
    animatedValue.setValue(0);
    animatedTextValue.setValue(0);

    Animated.timing(animatedValue, {
      toValue: value,
      duration: 2000,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedTextValue, {
      toValue: value,
      duration: 2000,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();

    // Update formattedValue whenever animatedTextValue changes
    animatedTextValue.addListener(({ value }) => {
      setFormattedValue(`${Math.round(value)}%`);
    });

    // Cleanup listener on unmount
    return () => animatedTextValue.removeAllListeners();
  }, [value]);

  return (
    <View
      style={{
        ...styles.container,
        width: size,
        height: size,
        marginTop, // Apply marginTop
        marginBottom, // Apply marginBottom
      }}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        style={{ transform: [{ rotate: '180deg' }] }} // Rotate the SVG
      >
        {/* Background Circle (Gauge) */}
        <Circle
          cx="18"
          cy="18"
          r={circleRadius}
          fill="none"
          stroke={circleStrokeColor} // Conditionally set stroke color
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference / 2} // Half circle
          strokeLinecap="round"
        />
        {/* Gauge Progress */}
        <AnimatedCircle
          cx="18"
          cy="18"
          r={circleRadius}
          fill="none"
          stroke={progressStrokeColor} // Conditionally set stroke color
          strokeWidth={progressStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>

      {/* Value Text */}
      <View
        style={{
          ...styles.valueContainer,
          top: adjustedSize * 0.8, // Adjust based on size
          left: '50%',
          transform: [
            { translateX: -adjustedSize * 1 },
            { translateY: -adjustedSize * 1 },
          ],
        }}
      >
        <Text style={{ ...styles.valueText, fontSize: adjustedSize * 0.4, color: textColor }}>
          {formattedValue}
        </Text>
        <Text style={{ ...styles.labelText, fontSize: adjustedSize * 0.2, color: textColor }}>
          Filter Health
        </Text>
      </View>
    </View>
  );
};

// Creating an Animated version of the Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  valueContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  valueText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  labelText: {
    textAlign: 'center',
  },
});

export default HalfPremium;
