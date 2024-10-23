import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import i18n from '../../i18n'; // Import i18n configuration

const CustomDrawerContent = (props: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [language, setLanguage] = useState('En'); // Track selected language

  // Load the saved language from AsyncStorage on component mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        if (savedLanguage) {
          setLanguage(savedLanguage === 'en' ? 'En' : 'Si');
          i18n.locale = savedLanguage; // Apply the saved language
        }
      } catch (error) {
        console.error('Failed to load language:', error);
      }
    };

    loadLanguage();
  }, []);

  // Change language and save it to AsyncStorage
  const changeLanguage = async (lang: string) => {
    const locale = lang === 'En' ? 'en' : 'si';
    setLanguage(lang);
    i18n.locale = locale; // Change i18n locale dynamically

    try {
      await AsyncStorage.setItem('appLanguage', locale); // Save the language
    } catch (error) {
      console.error('Failed to save language:', error);
    }

    setModalVisible(false); // Close the modal after selection
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Render Drawer Items */}
      <DrawerItemList {...props} />

      {/* Horizontal Separator */}
      <View style={styles.separator} />

      {/* Language Change Option */}
      <TouchableOpacity
        style={styles.languageContainer}
        onPress={() => setModalVisible(true)} // Open the modal
      >
        <MaterialIcons name="language" size={22} color="#000" />
        <Text style={styles.languageText}>Language - {language}</Text>
      </TouchableOpacity>

      {/* Modal for Language Selection */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)} // Handle back button press on Android
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Language</Text>

            {/* Language Selection Buttons */}
            <Pressable
              style={styles.modalButton}
              onPress={() => changeLanguage('En')}
            >
              <Text style={styles.modalButtonText}>English</Text>
            </Pressable>

            <Pressable
              style={styles.modalButton}
              onPress={() => changeLanguage('Si')}
            >
              <Text style={styles.modalButtonText}>සිංහල</Text>
            </Pressable>

            {/* Cancel Button */}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 10,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginLeft: 5,
  },
  languageText: {
    marginLeft: 32,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  modalButton: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#1E8FBB',
    marginVertical: 5,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: '#1E8FBB',
    fontSize: 16,
  },
});

export default CustomDrawerContent;
