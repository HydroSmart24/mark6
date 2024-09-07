import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import DistributorCard from "../../components/Modals/DistributorCard";
import DistributorNav from "../../components/Navigator/DistributorNav";
import { getRequestsByStatus } from "../../utils/GetPendingReq";
import { getOptimisedAcceptedRequests } from "../../utils/OptimisedAccepted";
import Accepted from "./Accepted"; // Import the Accepted component

export default function DistributorHome() {
  const [selectedOption, setSelectedOption] = useState("Pending");
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {
      let fetchedRequests;

      if (selectedOption === "Accepted") {
        // Fetch and optimize accepted requests
        fetchedRequests = await getOptimisedAcceptedRequests();
      } else {
        // Fetch other requests by status
        fetchedRequests = await getRequestsByStatus(selectedOption);
      }

      setRequests(fetchedRequests);
    } catch (error) {
      console.error(
        `Error fetching ${selectedOption.toLowerCase()} requests:`,
        error
      );
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedOption]);

  return (
    <View style={styles.container}>
      <DistributorNav
        selectedOption={selectedOption}
        onSelectOption={setSelectedOption}
      />
      {selectedOption === "Accepted" ? (
        <Accepted /> // Render the Accepted component
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {requests.map((request) => (
            <DistributorCard
              key={request.id}
              requestId={request.id}
              quantity={request.quantity}
              urgency={request.urgency}
              date={new Date(request.date.toDate())}
              selectedOption={selectedOption}
              onStatusUpdate={fetchRequests} // Pass fetchRequests as a prop
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%', // Ensure the container takes full width
    paddingHorizontal: 15, // Add some horizontal padding
    paddingTop: 10, // Add padding at the top to separate from the status bar
    backgroundColor: '#f9f9f9', // Set a subtle background color
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%', // Ensure scroll view takes full width
    paddingBottom: 20, // Add padding at the bottom
    justifyContent: 'flex-start',
  },
  spacing: {
    height: 20,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#4CAF50", // Add color to the button for visibility
    borderRadius: 50, // Make the button circular
    padding: 15, // Increase padding for better touch target
    elevation: 5, // Add shadow for depth
  },
});

