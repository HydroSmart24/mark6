import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function ContactInfoCard() {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Contact for support</Text>
      </View>

      {/* Content goes here */}
      <View style={styles.contentContainer}>
        {/* Bullet point 1 */}
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletIcon}>•</Text>
          <Text style={styles.bulletText}>Find the Contact-Us Screen on the top left drawer</Text>
        </View>
        {/* Image 1 */}
        <Image source={require('../../assets/Info/header.png')} style={styles.image} />

        {/* Bullet point 2 */}
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletIcon}>•</Text>
          <Text style={styles.bulletText}>Click on 'Contact-Us' screen</Text>
        </View>
        {/* Image 2 */}
        <Image source={require('../../assets/Info/contact2.png')} style={styles.image} />

        {/* Bullet point 3 */}
        <View style={styles.bulletPoint}>
          <Text style={styles.bulletIcon}>•</Text>
          <Text style={styles.bulletText}>
            Enter the details and send us your concern. Our support team will reach you through the email.
          </Text>
        </View>
        {/* Image 3 */}
        <Image source={require('../../assets/Info/contact3.png')} style={styles.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 20,
    width: width - 40, // Adjusting for padding
  },
  header: {
    backgroundColor: '#1089B8',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 15,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  bulletIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 16,
    flexShrink: 1,
  },
  image: {
    width: width - 60,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});
