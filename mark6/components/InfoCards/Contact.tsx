import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import i18n from '../../i18n';

const { width } = Dimensions.get('window');

export default function ContactInfoCard() {
  return (
    <View style={styles.cardContainer}>
      {/* Header that pops out of the card */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{i18n.t('contact_for_support')}</Text>
      </View>

      {/* Content goes here */}
      <View style={styles.contentContainer}>
        {/* Line connecting bullet points */}
        <View style={styles.timelineLine} />

        {/* Bullet point 1 */}
        <View style={styles.bulletPoint}>
          <View style={styles.bulletIconWrapper}>
            <View style={styles.bulletIconContainer}>
              <Text style={styles.bulletIcon}>•</Text>
            </View>
          </View>
          <Text style={styles.bulletText}>Find the Contact-Us Screen on the top left drawer <Feather name="menu" size={14} color="black" /></Text>
        </View>
        {/* Image 1 */}
        <Image source={require('../../assets/Info/header.png')} style={styles.image1} />

        {/* Bullet point 2 */}
        <View style={styles.bulletPoint}>
          <View style={styles.bulletIconWrapper}>
            <View style={styles.bulletIconContainer}>
              <Text style={styles.bulletIcon}>•</Text>
            </View>
          </View>
          <Text style={styles.bulletText}>Click on 'Contact-Us' screen</Text>
        </View>
        {/* Image 2 */}
        <Image source={require('../../assets/Info/contact2.png')} style={styles.image2} />

        {/* Bullet point 3 */}
        <View style={styles.bulletPoint}>
          <View style={styles.bulletIconWrapper}>
            <View style={styles.bulletIconContainer}>
              <Text style={styles.bulletIcon}>•</Text>
            </View>
          </View>
          <Text style={styles.bulletText}>
            Enter the details and send us your concern. Our support team will reach you through the email.
          </Text>
        </View>
        {/* Image 3 */}
        <Image source={require('../../assets/Info/contact3.png')} style={styles.image3} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginVertical: 20,
    width: width - 40, // Adjusting for padding
    overflow: 'visible', // Allow the header to overflow the card container
  },
  header: {
    backgroundColor: '#1089B8',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    position: 'absolute', // Make the header positioned relatively to the card container
    top: -15, // Move the header 15px upwards to pop it out
    left: 0, // Move it slightly left for the "popping out" effect
    zIndex: 1, // Ensure it stays above the card content
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 15,
    position: 'relative',
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
    marginTop: 25,
  },
  bulletIconWrapper: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletIconContainer: {
    backgroundColor: '#B8B8B8',
    width: 15,
    height: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulletIcon: {
    fontSize: 0,
    color: '#fff',
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 16,
    flexShrink: 1,
    paddingLeft: 10,
  },
  // Individual styles for each image
  image1: {
    width: 180,
    height: 50, // Adjusted height for image 1
    resizeMode: 'cover',
    marginBottom: 20,
    left: 60,
    borderWidth: 0.5,
    borderColor: '#000',
  },
  image2: {
    width: 120,
    height: 220, // Adjusted height for image 2
    left: 100,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#000',
  },
  image3: {
    width: 120,
    height: 250, // Adjusted height for image 3
    left: 100,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#000',
  },
  timelineLine: {
    position: 'absolute',
    left: 29, // Position the line so it aligns with the bullet points
    top: 40,
    bottom: 360,
    width: 2,
    backgroundColor: '#D4ECF5',
  },
});
