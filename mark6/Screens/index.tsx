import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions } from 'react-native';
import TankLevel from '../components/AvailableTank/TankLevel';
import HomeFilterHealth from '../components/Guage/HomeFilterHealth';
import WaterQuality from '../components/Buttons/WaterQuality';
import RequestWaterButton from '../components/Buttons/RequestWaterButton';
import IconButton from '../components/Buttons/IconButton';
import BasicContainer from '../components/Containers/BasicContainer';
import Prediction from '../components/Graph/PredictConsumpGraph';
import CustomHeader from '../components/CustomerHeader/IndexHeader';
import { calculateFilterHealth, fetchSensorData } from '../utils/FilterHealthCalc';
import i18n from '../i18n';

interface TabOneScreenProps {
  userName: string | null; // Make sure to pass userName as a prop
}

export default function TabOneScreen({ userName }: TabOneScreenProps) {
  const [percentage, setPercentage] = useState<number | null>(null);

  useEffect(() => {
    const fetchDataAndCalculate = async () => {
      const { ph, turbidity, expirationDate } = await fetchSensorData();
      const currentDate = new Date();
      const filterHealth = calculateFilterHealth(ph, turbidity, currentDate, expirationDate);
      setPercentage(filterHealth);
    };

    fetchDataAndCalculate();
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      {/* Ensure the CustomHeader takes up the full width of the screen */}
      <View style={styles.headerContainer}>
        <CustomHeader userName={userName || ''} />
      </View>
      
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi {userName}</Text>
        <Text style={styles.subtitle}>{i18n.t('check_status')}</Text>
      </View>
      
      <BasicContainer style={styles.basicContainer} height={230}> 
        <View style={styles.rowContainer}>
          <View style={styles.leftColumn}>
            <View style={styles.homeFilterHealthWrapper}>
              <HomeFilterHealth size={113} value={percentage ?? undefined} />
            </View>
            <WaterQuality title={i18n.t('water_quality')} style={styles.waterQualityButton} />
          </View>
          <View style={styles.rightColumn}>
            <TankLevel size={130} clickable={true} /> 
          </View>
        </View>
      </BasicContainer>
      
      <View style={styles.buttonRow}>
        <RequestWaterButton title={i18n.t('request_water')} />
        <IconButton title={i18n.t('purchase_water')} style={styles.buttonSpacing} />
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
    width: '80%', 
    marginTop: -20,
    marginBottom: 15, 
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
    height: 185,
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
    marginTop: -35,
    width: '100%', 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40, 
    marginTop: 10, 
  },
  buttonSpacing: {
    marginLeft: 25, 
  },
  prediction: {
    marginTop: 35, 
    width: '85%', 
  },
});
