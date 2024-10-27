import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Define the urgency type to accept only specific values
type UrgencyLevel = "Low" | "Medium" | "High";

// Define status types
type StatusType =
  | "Pending"
  | "Accepted"
  | "Completed"
  | "Cancelled"
  | "Delivered"
  | "Delivering";

interface CardProps {
  quantity: string;
  status: StatusType; // Changed to StatusType
  date: Date;
}

const Card: React.FC<CardProps> = ({ quantity, status, date }) => {
  // Format the date components
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  // Custom mapping for specific months
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

  // Define status colors
  const statusColors: { [key in StatusType]: string } = {
    Pending: "#C194FA", // Purple
    Accepted: "#4CAF50", // Green
    Completed: "#2196F3", // Blue
    Cancelled: "#EE5656", // Red
    Delivering: "#4CAF50", // Green
    Delivered: "#4CAF50", // Green
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
          <Text style={styles.unitText}>Liters</Text>
        </View>
      </View>
  <View
    style={[
      styles.statusContainer,
      { backgroundColor: statusColors[status] },
    ]}
  >
    <Text style={styles.statusText}>{status}</Text>
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
    justifyContent: "space-between", // Spread elements evenly
    marginBottom: 20,
    borderLeftWidth: 8,
    borderLeftColor: "#4299E1",
  },
  dateContainer: {
    alignItems: "center",
    marginRight: 20, // Space between the date and the vertical line
  },
  dateTextLarge: {
    fontSize: 26, // Large font size for the day number
    fontWeight: "bold",
    color: "#333",
  },
  dateTextMedium: {
    fontSize: 18, // Medium font size for the month
    color: "#333",
  },
  dateTextSmall: {
    fontSize: 14, // Small font size for the year
    color: "#333",
  },
  line: {
    width: 2, // Width of the vertical line
    height: "100%", // Full height of the card
    backgroundColor: "#4299E1", // Color of the vertical line
    marginLeft: 10, // Space between the line and the text
  },
  content: {
    flex: 1,
    marginLeft: 5, // Add margin to move the text slightly to the right
  },
  quantityContainer: {
    alignItems: "center", // Center both text elements horizontally
  },
  quantityText: {
    fontSize: 30, // Increased font size for quantity
    color: "#333",
    marginBottom: 5,
    fontWeight: "bold",
  },
  unitText: {
    fontSize: 18, // Font size for the unit text
    color: "#333",
  },
  statusContainer: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 40,
    marginRight: 10, // Adjust with marginRight instead
  },
  statusText: {
    fontSize: 14,
    color: "#fff", // White text for better contrast
  },
});

export default Card;
