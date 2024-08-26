import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface HomeFilterHealthProps {
  size?: number;
  value?: number;
}

const HomeFilterHealth: React.FC<HomeFilterHealthProps> = ({ size = 80, value = 0 }) => {
  const adjustedSize = size / 2;
  const strokeWidth = 2;
  const circleRadius = 16;
  const progressStrokeWidth = 2;
  const circumference = 2 * Math.PI * circleRadius;

  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedTextValue = useRef(new Animated.Value(0)).current;

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, circumference / 2],
  });

  const [formattedValue, setFormattedValue] = useState('0%');

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

    animatedTextValue.addListener(({ value }) => {
      setFormattedValue(`${Math.round(value)}%`);
    });

    return () => animatedTextValue.removeAllListeners();
  }, [value]);

  return (
    <View style={{ ...styles.container, width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        style={{ transform: [{ rotate: '180deg' }] }}
      >
        <Circle
          cx="18"
          cy="18"
          r={circleRadius}
          fill="none"
          stroke="#E0E7FF"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference / 2}
          strokeLinecap="round"
        />
        <AnimatedCircle
          cx="18"
          cy="18"
          r={circleRadius}
          fill="none"
          stroke="#2563EB"
          strokeWidth={progressStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>

      <View
        style={{
          ...styles.valueContainer,
          top: adjustedSize * 0.8,
          left: '50%',
          transform: [
            { translateX: -adjustedSize * 0.95 }, // Adjust horizontal centering
            { translateY: -adjustedSize * 1.05 }, // Adjust vertical centering
          ],
        }}
      >
        <Text style={{ ...styles.valueText, fontSize: adjustedSize * 0.4 }}>
          {formattedValue}
        </Text>
      </View>
    </View>
  );
};

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
    color: '#2563EB',
    textAlign: 'center',
  },
});

export default HomeFilterHealth;
