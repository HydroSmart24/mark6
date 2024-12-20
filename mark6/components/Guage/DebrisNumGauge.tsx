import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import i18n from '../../i18n';

interface TextOnlyGaugeProps {
  size?: number;
  value?: number; // The dynamic value to be passed, optional
  marginTop?: number; // Optional marginTop prop
  marginBottom?: number; // Optional marginBottom prop
}

const TextOnlyGauge: React.FC<TextOnlyGaugeProps> = ({
  size = 80,
  value = 0,
  marginTop = 0, // Default to 0 if not provided
  marginBottom = 0, // Default to 0 if not provided
}) => {
  const adjustedSize = size / 2; // Adjust to scale the text correctly
  const animatedTextValue = useRef(new Animated.Value(0)).current;

  const [formattedValue, setFormattedValue] = useState('0');

  // Determine colors based on value
  const textColor = value >= 75 ? '#DC2626' : '#2563EB'; // red-600 or blue-600

  useEffect(() => {
    animatedTextValue.setValue(0);

    Animated.timing(animatedTextValue, {
      toValue: value,
      duration: 2000,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();

    // Update formattedValue whenever animatedTextValue changes
    animatedTextValue.addListener(({ value }) => {
      setFormattedValue(`${Math.round(value)}`);
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
          {i18n.t('debris')}
        </Text>
      </View>
    </View>
  );
};

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
    marginTop: 20,
  },
  valueText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  labelText: {
    textAlign: 'center',
  },
});

export default TextOnlyGauge;
