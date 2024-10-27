import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RequestWaterFromtankbtn from '../Buttons/RequestWaterFromTankBtn';
import TankRequestWaterModal from '../Modals/TankRequestWaterModal';
import i18n from '../../i18n';

interface CardProps {
  title: string;
  onRequestPress: () => void;
  availableLiters: number;
  ownerId: string;  // The userId of the tank owner
  reqUserId: string;  // The userId of the current user
  currentUserName: string;
}

const CardView: React.FC<CardProps> = ({ title, availableLiters, ownerId, currentUserName, reqUserId }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Handle Request button press and show the modal
  const handleRequestPress = () => {
    setModalVisible(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.availableLiters}>{availableLiters} liters {i18n.t('available')}</Text>
          </View>
          {/* Pass userId to RequestWaterFromtankbtn if necessary */}
          <RequestWaterFromtankbtn title={i18n.t('request')} onPress={handleRequestPress} availableLiters={availableLiters} />
        </View>
      </View>

      {/* Pass the userId as a prop to the modal */}
      <TankRequestWaterModal
        visible={modalVisible}
        onClose={handleCloseModal}
        ownerName={title}
        availableLiters={availableLiters}
        ownerId={ownerId}
        currentUserName={currentUserName}
        reqUserId={reqUserId}
      />
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
