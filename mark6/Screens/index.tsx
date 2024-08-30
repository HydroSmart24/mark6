import React from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions } from 'react-native';
import TankLevel from '../components/AvailableTank/TankLevel';
import HomeFilterHealth from '../components/Guage/HomeFilterHealth';
import WaterQuality from '../components/Buttons/WaterQuality';
import RequestWaterButton from '../components/Buttons/RequestWaterButton';
import IconButton from '../components/Buttons/IconButton';
import BasicContainer from '../components/Containers/BasicContainer';
import Prediction from '../components/Graph/PredictConsumpGraph';
import CustomHeader from '../components/CustomerHeader/indexHeader';

interface TabOneScreenProps {
  userName: string | null; // Make sure to pass userName as a prop
}

export default function TabOneScreen({ userName }: TabOneScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      {/* Ensure the CustomHeader takes up the full width of the screen */}
      <View style={styles.headerContainer}>
        <CustomHeader userName={userName || ''} />
      </View>
      
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi {userName}</Text>
        <Text style={styles.subtitle}>Check status of tank</Text>
      </View>
      
      <BasicContainer style={styles.basicContainer} height={230}> 
        <View style={styles.rowContainer}>
          <View style={styles.leftColumn}>
            <View style={styles.homeFilterHealthWrapper}>
              <HomeFilterHealth size={113} value={10} />
            </View>
            <WaterQuality title="Water Quality" style={styles.waterQualityButton} />
          </View>
          <View style={styles.rightColumn}>
            <TankLevel size={130} clickable={true} /> 
          </View>
        </View>
      </BasicContainer>
      
      <View style={styles.buttonRow}>
        <RequestWaterButton title="Request Water" />
        <IconButton title="Purchase Water" style={styles.buttonSpacing} />
      </View>
      
      <Prediction style={styles.prediction} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 25,
    paddingBottom: 35,
  },
  headerContainer: {
    width: Dimensions.get('window').width, 
    marginBottom: 35,
  },
  header: {
    width: '85%', 
    marginBottom: 25, 
    alignItems: 'flex-start', 
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3283C7',
  },
  subtitle: {
    fontSize: 16,
    color: '#7E7E7E',
    marginTop: 5, 
    fontWeight: 'bold',
  },
  basicContainer: {
    width: '85%', 
    height: 230,
    marginBottom: 10, 
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginLeft: 20, 
  },
  homeFilterHealthWrapper: {
    marginBottom: 10,
    marginLeft: 8,
  },
  waterQualityButton: {
    marginTop: -20,
    width: '100%', 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40, 
    marginTop: 20, 
  },
  buttonSpacing: {
    marginLeft: 25, 
  },
  prediction: {
    marginTop: 50, 
    width: '90%', 
  },
});
