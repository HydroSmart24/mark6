import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

interface DistributorNavNavProps {
  selectedOption: string;
  onSelectOption: (option: string) => void;
}

const DistributorNav: React.FC<DistributorNavNavProps> = ({
  selectedOption,
  onSelectOption,
}) => {
  const options = ["Pending", "Accepted", "Delivered", "Cancelled"];

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
    marginBottom: 10,
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
    fontSize: 16,
    color: "#333",
  },
  selectedOptionText: {
    color: "#4299E1",
    fontWeight: "bold",
  },
});

export default DistributorNav;
