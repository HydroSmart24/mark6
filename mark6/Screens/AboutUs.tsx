import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import i18n from '../i18n';

const AboutUs: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{i18n.t('about_us')}</Text>
      <Text style={styles.description}>{i18n.t('leading_company')}
      </Text>
      <View style={styles.pointsContainer}>
        <Text style={styles.point}>• {i18n.t('value')}</Text>
        <Text style={styles.point}>• {i18n.t('innovate')}</Text>
        <Text style={styles.point}>• {i18n.t('strive')}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  heading: {
    marginBottom: 16,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1f2937',
  },
  description: {
    marginBottom: 24,
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    color: '#6b7280',
  },
  pointsContainer: {
    marginTop: 16,
  },
  point: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
});

export default AboutUs;
