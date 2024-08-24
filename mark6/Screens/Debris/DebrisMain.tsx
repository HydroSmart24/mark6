import { StyleSheet, ScrollView } from 'react-native';
import HalfPremium from '../../components/Guage/HalfPremium';
import { View } from '../../components/Themed';
import PhGauge from '../../components/Guage/PhGauge';
import ReusableText from '../../components/Text/ReusableText';
import TurbidityGauge from '../../components/Guage/TurbidityGauge';
import DetectDebris from '../../components/Buttons/DetectDebris';


export default function DebrisMainScreen() {

  const estimatedExpiryDate = '2024-12-31'; // Sample date

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.innerContainer}>
        <HalfPremium size={200} value={2} marginTop={50} marginBottom={-50} />
        <ReusableText text={`Estimated Filter Expiry Date: ${estimatedExpiryDate}`} color="#9B9A9A" size={15} opacity={20} />
        
        <View style={styles.gaugeContainer}>
          <PhGauge size={120} value={50} />
          <TurbidityGauge size={120} value={4} />
        </View>
        
        <View style={styles.detectContainer}>
          <ReusableText text={"Click to detect debris in the tank*"} color="#DCDCDC" size={15} opacity={20} />
          <DetectDebris title="Detect Debris" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    width: '100%', // Ensures the ScrollView takes up the full width of the screen
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20, // Optional: adds padding to the sides to prevent content from touching screen edges
  },
  gaugeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%', // Adjust width as needed
    marginTop: 80, // Adjust margin as needed
  },
  detectContainer: {
    marginTop: 100, // Adjust the top margin as needed
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 150, // Adjust the bottom margin as needed
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
