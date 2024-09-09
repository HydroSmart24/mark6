import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Button } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import RequestWaterModal from "../../components/Modals/RequestWaterModal";
import { getOptimisedDeliveringRequests } from "../../utils/GetDeliveringReq";
import { getDistance } from "geolib";

const Map: React.FC = () => {
  const initialLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
  };

  const [myLocation, setMyLocation] = useState(initialLocation);
  const [pin, setPin] = useState(initialLocation);
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveringRequests, setDeliveringRequests] = useState<any[]>([]);
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    _getLocation();
    fetchDeliveringRequests();
  }, []);

  const _getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setMyLocation(location.coords);
      setPin(location.coords);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchDeliveringRequests = async () => {
    try {
      const requests = await getOptimisedDeliveringRequests(); // Use optimized function
      setDeliveringRequests(requests);
      console.log("Sorted Delivering Requests Locations with User IDs:");

      requests.forEach(
        (
          request: { id: any; latitude: any; longitude: any; uid: any },
          index: any
        ) => {
          console.log(
            `ID: ${request.id}, UID: ${request.uid}, Latitude: ${request.latitude}, Longitude: ${request.longitude}`
          );
        }
      );
    } catch (error) {
      console.error("Error fetching delivering requests:", error);
    }
  };

  const calculateEstimatedTime = (latitude: number, longitude: number) => {
    const distance = getDistance(
      { latitude: myLocation.latitude, longitude: myLocation.longitude },
      { latitude, longitude }
    );
    const timePerKm = 13 / 3.3;
    const distanceInKm = distance / 1000;
    const estimatedTime = Math.round(distanceInKm * timePerKm);
    return estimatedTime;
  };

  const focusOnLocation = () => {
    if (pin.latitude && pin.longitude) {
      const newRegion = {
        latitude: pin.latitude,
        longitude: pin.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        ref={mapRef}
        provider={PROVIDER_GOOGLE} // Use Google provider
      >
        {pin.latitude && pin.longitude && (
          <Marker
            coordinate={{
              latitude: pin.latitude,
              longitude: pin.longitude,
            }}
            title="Pinned Location"
            description="Pinned here"
          />
        )}
        {myLocation.latitude && myLocation.longitude && (
          <Marker
            coordinate={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
            }}
            title="My Current Location"
            description="I am here"
          />
        )}
        {deliveringRequests.map((request, index) => {
          const estimatedTime = calculateEstimatedTime(
            request.latitude,
            request.longitude
          );

          // Calculate cumulative time
          const cumulativeTime = deliveringRequests
            .slice(0, index + 1)
            .reduce(
              (total, currentRequest) =>
                total +
                calculateEstimatedTime(
                  currentRequest.latitude,
                  currentRequest.longitude
                ),
              0
            );

          console.log(
            `Request ID: ${request.id}, Cumulative Time: ${cumulativeTime} mins`
          );

          return (
            <Marker
              key={request.id}
              coordinate={{
                latitude: request.latitude,
                longitude: request.longitude,
              }}
              title={`Request - ${index + 1}`}
              description={`${request.quantity} Liters, ${cumulativeTime} mins`}
            />
          );
        })}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Get Location" onPress={focusOnLocation} />
      </View>

      <RequestWaterModal
        visible={modalVisible}
        onClose={closeModal}
        latitude={myLocation.latitude}
        longitude={myLocation.longitude}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end", // Adjust to ensure the map takes up most of the space
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height, // Adjust for button container
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%", // Use full width to position buttons correctly
    alignItems: "center",
  },
});

export default Map;
