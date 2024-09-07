import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import RequestWaterFromtankbtn from '../Buttons/RequestWaterFromTankBtn';
import TankRequestWaterModal from '../Modals/TankRequestWaterModal';

interface CardProps {
  title: string;
  onRequestPress: () => void;
  availableLiters: number;
}

const CardView: React.FC<CardProps> = ({ title, availableLiters }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleRequestPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.availableLiters}>{availableLiters} liters Available</Text>
          </View>
          <RequestWaterFromtankbtn title="Request" onPress={handleRequestPress} availableLiters={availableLiters} />
        </View>
      </View>
      <TankRequestWaterModal visible={modalVisible} onClose={handleCloseModal} ownerName={title} availableLiters={availableLiters} />
    </View>
  );
};

export default CardView;

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    marginHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  availableLiters: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Background blur effect
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#4299E1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});