import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import i18n from '../i18n';

const AboutUs: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{i18n.t('about_us')}</Text>
      <Text style={styles.description}>
        We are a leading company in the industry, committed to providing the best services and products to our customers.
      </Text>
      <View style={styles.pointsContainer}>
        <Text style={styles.point}>• We value customer satisfaction above all.</Text>
        <Text style={styles.point}>• Innovation is at the heart of our mission.</Text>
        <Text style={styles.point}>• We strive for excellence in everything we do.</Text>
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
