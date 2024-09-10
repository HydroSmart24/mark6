import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface TurbidityGaugeProps {
  size?: number;
  value?: number; // The dynamic value to be passed, optional
}

const TurbidityGauge: React.FC<TurbidityGaugeProps> = ({ size = 80, value = 0 }) => {
  const adjustedSize = size / 2; // Adjust to scale the SVG correctly
  const strokeWidth = 2; // Fixed stroke width since we're working within a fixed viewBox
  const circleRadius = 16; // Radius is fixed according to the viewBox
  const progressStrokeWidth = 2; // Define the progress stroke width
  const circumference = 2 * Math.PI * circleRadius; // Calculate the circumference of the circle

  // Ensure the value is positive using Math.abs
  const positiveValue = Math.abs(value || 0);

  // Limit the value to a maximum of 10
  const limitedValue = Math.min(positiveValue, 10);

  // Initialize animated value with 0 to ensure animation starts from 0
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Interpolating the animated value to get the strokeDashoffset
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 10],
    outputRange: [circumference * 1, circumference * 0.25], // Adjusted for 3/4 circle
  });

  // Determine the color based on the limited value
  let strokeColor = '#10B981'; // default to green
  let innerStrokeColor = '#D1FAE5'; // default to green - 100
  let centerText = 'Good'; // default to good

  if (limitedValue > 2.5 && limitedValue <= 5) {
    strokeColor = '#FBBF24'; // yellow
    innerStrokeColor = '#FEF3C7';
    centerText = 'Mid';
  } else if (limitedValue > 5 && limitedValue <= 7.5) {
    strokeColor = '#F97316'; // orange
    innerStrokeColor = '#FFEDD5';
    centerText = 'Mid';
  } else if (limitedValue > 7.5) {
    strokeColor = '#DC2626'; // red
    innerStrokeColor = '#FEE2E2';
    centerText = 'Bad';
  }

  // Animation effect
  useEffect(() => {
    animatedValue.setValue(0); // Reset the animation to start from 0
    Animated.timing(animatedValue, {
      toValue: limitedValue,
      duration: 2000,
      easing: Easing.ease,
      useNativeDriver: false, // `false` because `strokeDashoffset` is not supported by native driver
    }).start();
  }, [limitedValue]);

  return (
    <View style={{ ...styles.container, width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        style={{ transform: [{ rotate: '-225deg' }] }} // Rotate to start from the bottom
      >
        {/* Background Circle (Gauge) */}
        <Circle
          cx="18"
          cy="18"
          r={circleRadius}
          fill="none"
          stroke={innerStrokeColor} // Set inner stroke color based on value
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25} // Adjusted to show 3/4 of the circle
          strokeLinecap="round"
        />
        {/* Gauge Progress */}
        <AnimatedCircle
          cx="18"
          cy="18"
          r={circleRadius}
          fill="none"
          stroke={strokeColor} // Color changes based on value
          strokeWidth={progressStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>

      {/* Value Text */}
      <View style={styles.valueContainer}>
        <Text style={{ ...styles.valueText, fontSize: adjustedSize * 0.4 }}>{centerText}</Text>
        <Text style={{ ...styles.labelText, fontSize: adjustedSize * 0.2 }}>Turbidity</Text>
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
    top: '50%',
    left: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    transform: [
      { translateX: -60 }, // Adjust these values based on your circle size
      { translateY: -60 },
    ],
  },
  valueText: {
    fontWeight: 'bold',
    color: '#2563EB', // equivalent to text-blue-600
  },
  labelText: {
    color: '#2563EB', // equivalent to text-blue-600
  },
});

export default TurbidityGauge;
