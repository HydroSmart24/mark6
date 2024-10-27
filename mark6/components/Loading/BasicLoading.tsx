import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import i18n from '../../i18n';

interface LoadingProps {
  visible: boolean;
}

const Loading: React.FC<LoadingProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4299E1" />
        <Text style={styles.text}>{i18n.t('loading')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
  },
});

export default Loading;
