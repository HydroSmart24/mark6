import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface HomeFilterHealthProps {
  size?: number;
  value?: number; // The dynamic value to be passed, optional
}

const HomeFilterHealth: React.FC<HomeFilterHealthProps> = ({ size = 80, value = 0 }) => {
  const adjustedSize = size / 2; // Adjust to scale the SVG correctly
  const strokeWidth = 2; // Fixed stroke width since we're working within a fixed viewBox
  const circleRadius = 16; // Radius is fixed according to the viewBox
  const progressStrokeWidth = 2; // Define the progress stroke width
  const circumference = 2 * Math.PI * circleRadius; // Calculate the circumference of the circle

  // Initialize animated value with 0 to ensure animation starts from 0
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Interpolating the animated value to get the strokeDashoffset
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference,circumference/2],
  });

  // Animation effect
  useEffect(() => {
    animatedValue.setValue(0); // Reset the animation to start from 0
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 2000,
      easing: Easing.ease,
      useNativeDriver: false, // `false` because `strokeDashoffset` is not supported by native driver
    }).start();
  }, [value]);

  return (
    <View style={{ ...styles.container, width: size, height: size }}>
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
          stroke="#E0E7FF" // equivalent to blue-100
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
          stroke="#2563EB" // equivalent to blue-600
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
            { translateX: -(adjustedSize * 0.35) },
            { translateY: -(adjustedSize * 0.35) },
          ],
        }}
      >
        <Text style={{ ...styles.valueText, fontSize: adjustedSize * 0.4 }}>{value}%</Text>
        
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
  },
  valueText: {
    fontWeight: 'bold',
    color: '#2563EB', // equivalent to text-blue-600
  },
  labelText: {
    color: '#2563EB', // equivalent to text-blue-600
  },
});

export default HomeFilterHealth;
