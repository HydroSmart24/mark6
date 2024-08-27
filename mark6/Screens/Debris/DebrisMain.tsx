import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import HalfPremium from '../../components/Guage/HalfPremium';
import { View } from '../../components/Themed';
import PhGauge from '../../components/Guage/PhGauge';
import ReusableText from '../../components/Text/ReusableText';
import TurbidityGauge from '../../components/Guage/TurbidityGauge';
import DetectDebris from '../../components/Buttons/DetectDebris';
import ResetFilter from '../../components/Buttons/ResetFilter';
import FilterHealthWarning from '../../components/AlertModal/FilterHealthWarning';
import OnscreenAlert from '../../components/AlertModal/OnscreenAlert';

export default function DebrisMainScreen() {
  const [isWarningVisible, setWarningVisible] = useState(false);
  const [isOnscreenAlertVisible, setOnscreenAlertVisible] = useState(false);

  const halfPremiumValue = 90; // Change this value to test
  const phValue = 3; // Example pH value
  const turbidityValue = 8; // Example turbidity value

  const estimatedExpiryDate = '2024-12-31'; // Sample date

  useEffect(() => {
    if (halfPremiumValue < 20) {
      setWarningVisible(true);
    }
  }, [halfPremiumValue]);

  useEffect(() => {
    if (phValue <= 6.5 && turbidityValue >= 5) {
      setOnscreenAlertVisible(true);
    } else {
      setOnscreenAlertVisible(false);
    }
  }, [phValue, turbidityValue]);

  const handleCloseWarning = () => {
    setWarningVisible(false);
  };

  const handleCloseOnscreenAlert = () => {
    setOnscreenAlertVisible(false);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.innerContainer}>
        <HalfPremium size={200} value={halfPremiumValue} marginTop={50} marginBottom={-50} />
        <ReusableText text={`Estimated Filter Expiry Date: ${estimatedExpiryDate}`} color="#9B9A9A" size={15} opacity={20} />
        <ResetFilter title="Reset Filter" />
        <View style={styles.gaugeContainer}>
          <PhGauge size={120} value={phValue} />
          <TurbidityGauge size={120} value={turbidityValue} />
        </View>
        {/* Conditionally render the OnscreenAlert modal */}
        {isOnscreenAlertVisible && <OnscreenAlert isVisible={isOnscreenAlertVisible} onClose={handleCloseOnscreenAlert} message={'The Water quality is bad! Please replace the filter or check for debris!'} />}

        <View style={styles.detectContainer}>
          <ReusableText text={"Click to detect debris in the tank*"} color="#DCDCDC" size={15} opacity={20} />
          <DetectDebris title="Detect Debris" />
        </View>

        {/* Conditionally render the FilterHealthWarning modal */}
        {isWarningVisible && <FilterHealthWarning isVisible={isWarningVisible} onClose={handleCloseWarning} message={'The filter health is low!'} />}

        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gaugeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 50,
    marginBottom: 20,
  },
  detectContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 150,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
