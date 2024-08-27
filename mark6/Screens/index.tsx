import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import TankLevel from '../components/AvailableTank/TankLevel';
import HomeFilterHealth from '../components/Guage/HomeFilterHealth';
import WaterQuality from '../components/Buttons/WaterQuality';
import RequestWaterButton from '../components/Buttons/RequestWaterButton';
import IconButton from '../components/Buttons/IconButton';
import BasicContainer from '../components/Containers/BasicContainer';
import Prediction from '../components/Graph/PredictConsumpGraph';

export default function TabOneScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <BasicContainer style={styles.basicContainer} height={230}>
        <View style={styles.rowContainer}>
          <View style={styles.leftColumn}>
            <View style={styles.homeFilterHealthWrapper}>
              <HomeFilterHealth size={113} value={10} />
            </View>
            <WaterQuality title="Water Quality" style={styles.waterQualityButton} />
          </View>
          <View style={styles.rightColumn}>
            <TankLevel size={150} clickable={true} /> 
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
    paddingVertical: 100,
  },
  basicContainer: {
    width: '85%', 
    height: 200,
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
    marginBottom: 10, // Increase or decrease to adjust the gap
    marginLeft: 8, // Increase or decrease to adjust the gap
  },
  waterQualityButton: {
    marginTop: -20, // Increase or decrease to adjust the gap
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
