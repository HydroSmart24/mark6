import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { calculateFutureTankVolumes } from '../../utils/FutureTankVolumes'; // Adjust the import path as necessary

const { width } = Dimensions.get('window');

// Define types for the fetched data
interface VolumeData {
  date: string;
  volume: number;
}

export default function Prediction({ style = {} }) {
  const [data, setData] = useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] });
  const [days, setDays] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFutureVolumes = async () => {
      try {
        const futureVolumes: VolumeData[] | null = await calculateFutureTankVolumes();
        
        if (futureVolumes) {
          const labels = futureVolumes.map(item => item.date);
          const values = futureVolumes.map(item => item.volume);
          setData({ labels, values });
          setDays(futureVolumes.length);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      }
    };

    loadFutureVolumes();
  }, []);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.text}>Water remaining for:</Text>
        <View style={styles.box}>
          <Text style={styles.boxText}>{days} days</Text>
        </View>
      </View>
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {data.labels.length > 0 && data.values.length > 0 ? (
        <ScrollView horizontal={true} style={styles.scrollView}>
          <LineChart
            data={{
              labels: data.labels,
              datasets: [
                {
                  data: data.values,
                },
              ],
            }}
            width={data.labels.length * 60} // Dynamic width based on number of labels
            height={180} // Height of the chart
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 10,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 10,
            }}
          />
        </ScrollView>
      ) : (
        <Text style={styles.loading}>Loading predictions...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 40, // Full screen width minus 20px margin on each side
    height: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  box: {
    marginLeft: 50,
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 18,
    color: 'black',
  },
  scrollView: {
    flex: 1,
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
  loading: {
    marginTop: 20,
    fontSize: 18,
    color: 'black',
  },
});
