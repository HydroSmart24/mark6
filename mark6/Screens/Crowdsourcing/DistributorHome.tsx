import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import DistributorCard from "../../components/Modals/DistributorCard";
import DistributorNav from "../../components/Navigator/DistributorNav";
import { getRequestsByStatus } from "../../utils/GetPendingReq";
import { getOptimisedAcceptedRequests } from "../../utils/OptimisedAccepted";
import Accepted from "./Accepted";
import DistributorHeader from "../../components/Navigator/DistributorHeader";

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
      <DistributorHeader
        selectedOption={selectedOption}
        onSelectOption={setSelectedOption}
      />

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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scrollContainer: {
    alignItems: "center",
  },
});
