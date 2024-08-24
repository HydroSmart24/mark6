import { StyleSheet } from 'react-native';
import HalfPremium from '../../components/Guage/HalfPremium';
import { Text, View } from '../../components/Themed';

export default function DetectScreen() {
  return (
    <View style={styles.container}>
      <Text>This is the page where you can see the debris</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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