import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { updateRequestStatus } from "../../utils/UpdateStatus";

interface DistributorCardProps {
  quantity: string;
  date: Date;
  urgency: "High" | "Medium" | "Low";
  selectedOption: string;
  requestId: string;
  onStatusUpdate: () => void;
}

const DistributorCard: React.FC<DistributorCardProps> = ({
  quantity,
  date,
  urgency,
  selectedOption,
  requestId,
  onStatusUpdate,
}) => {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const customMonths: { [key: string]: string } = {
    Jan: "Jan",
    Feb: "Feb",
    Mar: "March",
    Apr: "April",
    May: "May",
    Jun: "June",
    Jul: "July",
    Aug: "Aug",
    Sep: "Sep",
    Oct: "Oct",
    Nov: "Nov",
    Dec: "Dec",
  };

  const formattedMonth = customMonths[month] || month;

  const urgencyColors: { [key: string]: string } = {
    High: "#FDE3E0",
    Medium: "#FAFACC",
    Low: "#DBFACC",
  };

  const handleButtonPress = async (buttonType: string) => {
    let newStatus = "";

    if (buttonType === "Accept") {
      newStatus = "Accepted";
    } else if (buttonType === "Decline") {
      newStatus = "Cancelled";
    } else if (buttonType === "Add") {
      newStatus = "Delivering";
    } else if (buttonType === "Deliver") {
      newStatus = "Delivered";
    }

    try {
      await updateRequestStatus(requestId, newStatus);
      onStatusUpdate();
    } catch (error) {
      console.error(`Error updating request to ${newStatus}:`, error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateTextLarge}>{day}</Text>
        <Text style={styles.dateTextMedium}>{formattedMonth}</Text>
        <Text style={styles.dateTextSmall}>{year}</Text>
      </View>
      <View style={styles.line}></View>
      <View style={styles.content}>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityText}>{quantity}</Text>
          <Text style={styles.unitText}> Liters</Text>
        </View>
        {selectedOption === "Pending" && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => handleButtonPress("Accept")}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={() => handleButtonPress("Decline")}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
        {selectedOption === "Accepted" && (
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={() => handleButtonPress("Add")}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        )}
        {selectedOption === "Delivering" && (
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={() => handleButtonPress("Deliver")}
          >
            <Text style={styles.buttonText}>Deliver</Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={[
          styles.urgencyContainer,
          { backgroundColor: urgencyColors[urgency] },
        ]}
      >
        <Text style={styles.urgencyText}>{urgency}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 350,
    height: 150,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    borderLeftWidth: 8,
    borderLeftColor: "#4299E1",
  },
  dateContainer: {
    alignItems: "center",
    marginRight: 20,
  },
  dateTextLarge: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  dateTextMedium: {
    fontSize: 18,
    color: "#333",
  },
  dateTextSmall: {
    fontSize: 14,
    color: "#333",
  },
  line: {
    width: 2,
    height: "100%",
    backgroundColor: "#4299E1",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-between",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 40,
  },
  quantityText: {
    fontSize: 40,
    color: "#333",
    fontWeight: "bold",
  },
  unitText: {
    fontSize: 25,
    color: "#333",
    marginLeft: 5,
  },
  urgencyContainer: {
    padding: 4,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 30,
    marginTop: -100,
    marginRight: -15,
  },
  urgencyText: {
    fontSize: 14,
    color: "#000",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    width: 115,
  },
  acceptButton: {
    backgroundColor: "#4299E1",
    borderColor: "#4299E1",
    marginRight: 10,
  },
  declineButton: {
    backgroundColor: "#E5E5E5",
    borderColor: "transparent",
  },
  addButton: {
    backgroundColor: "#4299E1",
    borderColor: "#fff",
    marginTop: 10,
    marginLeft: 120,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  acceptButtonText: {
    color: "#FFF",
    fontSize: 17,
  },
});

export default DistributorCard;
