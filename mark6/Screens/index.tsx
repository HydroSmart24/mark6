import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import TankLevel from '../components/AvailableTank/TankLevel';
import HomeFilterHealth from '../components/Guage/HomeFilterHealth';
import WaterQuality from '../components/Buttons/WaterQuality';
import RequestWaterButton from '../components/Buttons/RequestWaterButton';
import IconButton from '../components/Buttons/IconButton';
import BasicContainer from '../components/Containers/BasicContainer';
import Prediction from '../components/PredictConumption/PredictConsumpGraph';


export default function TabOneScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <BasicContainer style={styles.basicContainer} height={300}> 
        <View style={styles.rowContainer}>
          <View style={styles.leftColumn}>
            <HomeFilterHealth size={90} value={30} />
          </View>
          <View style={styles.rightColumn}>
            <TankLevel size={160} />
          </View>
        </View>
        <WaterQuality title="Water Quality" style={styles.waterQualityButton} />
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
    width: '80%', 
    marginBottom: 20, 
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 45, 
    marginTop: 20, 
  },
  buttonSpacing: {
    marginLeft: 25, 
  },
  waterQualityButton: {
    width: '90%',
  },
  touchable: {
    width: '100%', // Ensure the TouchableOpacity takes the full width of its container
  },
  prediction: {
    marginTop: 50, 
    width: '90%', 
  },
});
