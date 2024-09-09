import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { auth } from "../../firebase/firebaseConfig";

interface DistributorNavNavProps {
  selectedOption: string;
  onSelectOption: (option: string) => void;
}

const DistributorHeader: React.FC<DistributorNavNavProps> = ({
  selectedOption,
  onSelectOption,
}) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const options = ["Hi Distributor"];

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selectedOption === option && styles.selectedOption,
            ]}
            onPress={() => onSelectOption(option)}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={togglePopup}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>D</Text>
          </View>
        </TouchableOpacity>
        {isPopupVisible && (
          <View style={styles.popup}>
            <Pressable style={styles.popupOption} onPress={handleLogout}>
              <Text style={styles.popupOptionText}>Log Out</Text>
            </Pressable>
            <Pressable style={styles.popupOption} onPress={togglePopup}>
              <Text style={styles.popupOptionText}>Close</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    marginBottom: 10,
    marginTop: 30,
    width: "100%",
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectedOption: {
    borderBottomWidth: 2,
    borderBottomColor: "#4299E1",
  },
  optionText: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
  },
  selectedOptionText: {
    color: "#4299E1",
    fontWeight: "bold",
  },
  avatarContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#C4C4C4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4299E1",
  },
  avatarText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  popup: {
    position: "absolute",
    top: 50, // Adjust based on the height of the avatar
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    width: 150, // Increased width of the popup
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000,
  },
  popupOption: {
    paddingVertical: 8,
  },
  popupOptionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default DistributorHeader;
