import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import NewWaterRequest from "../../components/Buttons/NewWaterRequest";
import RequestWaterModal from "../../components/Modals/RequestWaterModal";
import Card from "../../components/Modals/Card";
import { getRequests } from "../../utils/GetRequests";
import OrderHistoryNav from "../../components/Navigator/OrderHistoryNav";
import Loading from "../../components/Loading/BasicLoading"; // Import the Loading component
import * as Location from "expo-location";

export default function OrderHistory() {
  const [modalVisible, setModalVisible] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState("All");

  useEffect(() => {
    navigation.setOptions({ title: "Your Orders" });
  }, [navigation]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true); // Set loading to true when fetching starts
        const fetchedRequests = await getRequests();
        setRequests(fetchedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false); // Set loading to false when fetching is done
      }
    };

    fetchRequests(); // Initial fetch
    const intervalId = setInterval(fetchRequests, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLatitude(location.coords.latitude);
        setCurrentLongitude(location.coords.longitude);
      } else {
        console.error("Location permission not granted");
      }
    };

    getLocation();
  }, []);

  const filteredRequests = requests.filter((request) => {
    switch (selectedOption) {
      case "All":
        return true;
      case "Pending":
        return request.status === "Pending";
      case "Accepted":
        return request.status === "Accepted";
      case "Delivering":
        return request.status === "Delivering";
      case "Delivered":
        return request.status === "Delivered";
      case "Cancelled":
        return request.status === "Cancelled";
      default:
        return true;
    }
  });

  const handleNewWaterRequestPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <OrderHistoryNav
        selectedOption={selectedOption}
        onSelectOption={setSelectedOption}
      />
      {isLoading ? ( // Show loading spinner if data is still being fetched
        <Loading visible={true} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.spacing}></View>
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              quantity={request.quantity}
              status={request.status}
              date={new Date(request.date.toDate())}
            />
          ))}
        </ScrollView>
      )}
      <NewWaterRequest
        style={styles.floatingButton}
        onPress={handleNewWaterRequestPress}
      />
      <RequestWaterModal
        visible={modalVisible}
        onClose={handleCloseModal}
        latitude={currentLatitude ?? 0}
        longitude={currentLongitude ?? 0}
      />
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
    backgroundColor: "#4299E1", // Add color to the button for visibility
    borderRadius: 50, // Make the button circular
    padding: 15, // Increase padding for better touch target
    elevation: 5, // Add shadow for depth
  },
});
