import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import HalfPremium from '../../components/Guage/HalfPremium';
import { View } from '../../components/Themed';
import { fetchSensorData, calculateFilterHealth, resetExpirationDate } from '../../utils/FilterHealthCalc';
import moment from "moment";
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
  const [percentage, setPercentage] = useState(100);
  const [ph, setPh] = useState(0);
  const [turbidity, setTurbidity] = useState(0);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch pH, turbidity, expirationDate, and docId data
        const { ph, turbidity, expirationDate } = await fetchSensorData();

        // Calculate filter health
        const currentDate = new Date();
        const newPercentage = calculateFilterHealth([ph], [turbidity], currentDate, expirationDate);

        // Set state
        setPercentage(newPercentage);
        setPh(ph);
        setTurbidity(turbidity);
        setExpirationDate(expirationDate);
      } catch (error) {
        console.error("Error loading data", error);
      }
    }

    loadData();
  }, []);

  // Handle resetting the expiration date
  const handleReset = async () => {
    const newExpirationDate = await resetExpirationDate(); // Update expiration date
    setExpirationDate(newExpirationDate);
    setModalVisible(false); // Close modal after resetting
  };

  useEffect(() => {
    if (percentage < 20) {
      setWarningVisible(true);
    }
  }, [percentage]);

  useEffect(() => {
    if (ph <= 6.5 && turbidity >= 5) {
      setOnscreenAlertVisible(true);
    } else {
      setOnscreenAlertVisible(false);
    }
  }, [ph, turbidity]);

  const handleCloseWarning = () => {
    setWarningVisible(false);
  };

  const handleCloseOnscreenAlert = () => {
    setOnscreenAlertVisible(false);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.innerContainer}>
        <HalfPremium size={200} value={percentage} marginTop={50} marginBottom={-50} />
        {expirationDate && (
          <ReusableText text={`Estimated Filter Expiry Date: ${moment(expirationDate).format('YYYY-MM-DD')}`} color="#9B9A9A" size={13} opacity={20} />
        )}
        <ResetFilter title="Reset Filter" onReset={handleReset} />
        <View style={styles.gaugeContainer}>
          <PhGauge size={120} value={ph} />
          <TurbidityGauge size={120} value={turbidity} />
        </View>
        {isOnscreenAlertVisible && <OnscreenAlert isVisible={isOnscreenAlertVisible} onClose={handleCloseOnscreenAlert} message={'The Water quality is bad! Please replace the filter or check for debris!'} />}
        <View style={styles.detectContainer}>
          <ReusableText text={"Click to detect debris in the tank*"} color="#DCDCDC" size={15} opacity={20} />
          <DetectDebris title="Detect Debris" />
        </View>
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
