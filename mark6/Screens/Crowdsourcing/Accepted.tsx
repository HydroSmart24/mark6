import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DistributorCard from "../../components/Modals/DistributorCard";
import { getOptimisedAcceptedRequests } from "../../utils/OptimisedAccepted";
import StartJourney from "../../components/Buttons/StartJourney";

export default function Accepted() {
  const [requests, setRequests] = React.useState<any[]>([]);

  const fetchAcceptedRequests = async () => {
    try {
      const fetchedRequests = await getOptimisedAcceptedRequests();
      setRequests(fetchedRequests);
    } catch (error) {
      console.error("Error fetching accepted requests:", error);
    }
  };

  React.useEffect(() => {
    fetchAcceptedRequests();
  }, []);

  return (
    <View style={styles.container}>
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
            selectedOption="Accepted"
            onStatusUpdate={fetchAcceptedRequests}
          />
        ))}
      </ScrollView>
      <View style={styles.buttonRow}>
        <StartJourney title="Start Journey" style={styles.buttonSpacing} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 80,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 40,
    marginTop: 20,
  },
  buttonSpacing: {
    marginLeft: -175,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 190,
    width: 160,
    height: 50,
    backgroundColor: "#4299E1",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  floatingButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
