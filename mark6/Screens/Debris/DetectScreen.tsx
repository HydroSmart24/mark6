import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View } from '../../components/Themed';
import SeverityGauge from '../../components/Guage/SeverityGauge'; // Import the SeverityGauge component
import DebrisNumGauge from '../../components/Guage/DebrisNumGauge'; // Import the DebrisNumGauge component
import DetectInfo from '../../components/Buttons/DetectInfo'; // Import the DetectInfo component

export default function DetectScreen() {
  return (
    <View style={styles.container}>
      {/* Container for the image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/Images/TestDetect.png')} // Adjust the path accordingly
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Container for the items below the image */}
      <View style={styles.itemsContainer}>
        
        {/* Placeholder for the two items you'll define later */}
        <View style={styles.item}>
          <SeverityGauge value={20} size={200}/>
        </View>
        <View style={styles.item}>
          <DebrisNumGauge value={3} size={200}/>
        </View>
      </View>
      <DetectInfo title="More Info" colorType={1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '90%',
    height: '40%',
    marginVertical: 10,
    marginTop: -110, // Apply marginTop
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  itemsContainer: {
    width: '90%', // Ensure width is set
    height: 150, // Use a fixed height to test
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 30, // Apply marginTop
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    height: '70%',
  }
});


