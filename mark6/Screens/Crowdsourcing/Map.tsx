import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Linking } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { getOptimisedDeliveringRequests } from "../../utils/GetDeliveringReq";
import { getDistance } from 'geolib'; // Assuming you're using geolib for distance calculation
import Button3D from "../../components/Buttons/Button3D";
import Start from "../../components/Buttons/Start";

const Map: React.FC = () => {
  const initialLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
  };

  const [myLocation, setMyLocation] = useState(initialLocation);
  const [pin, setPin] = useState(initialLocation);
  const [deliveringRequests, setDeliveringRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null); // Store the selected marker
  const [selectedEta, setSelectedEta] = useState<string>(''); // Store the calculated ETA
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
      console.log("Fetched Requests: ", requests); // Log the fetched requests to check data
      setDeliveringRequests(requests);
    } catch (error) {
      console.error("Error fetching delivering requests:", error);
    }
  };

  // Function to open location in Google Maps app
  const openInGoogleMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url)
      .then(() => console.log("Opening Google Maps"))
      .catch((err) => console.error("Error opening Google Maps:", err));
  };

  // Function to start navigation in Google Maps app
  const startNavigation = (latitude: number, longitude: number) => {
    const url = `google.navigation:q=${latitude},${longitude}`;
    Linking.openURL(url)
      .then(() => console.log("Starting navigation in Google Maps"))
      .catch((err) => console.error("Error starting navigation:", err));
  };

  // Calculate ETA based on distance (assuming speed of 40 km/h for more accurate urban estimate)
  const calculateETA = (latitude: number, longitude: number) => {
    const distanceInMeters = getDistance(
      { latitude: myLocation.latitude, longitude: myLocation.longitude },
      { latitude, longitude }
    );
    const speedInMetersPerSecond = (12 * 1000) / 3600; // 40 km/h to meters per second
    const timeInSeconds = distanceInMeters / speedInMetersPerSecond;
    const timeInMinutes = Math.round(timeInSeconds / 60);
    return `${timeInMinutes} mins`;
  };

  const handleMarkerPress = (request: any) => {
    const eta = calculateETA(request.latitude, request.longitude); // Calculate ETA when marker is pressed
    setSelectedRequest(request); // Store the selected request
    setSelectedEta(eta); // Store the calculated ETA
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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
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
        {deliveringRequests.length > 0 &&
          deliveringRequests.map((request, index) => (
            <Marker
              key={request.id}
              coordinate={{
                latitude: request.latitude,
                longitude: request.longitude,
              }}
              title={`Request ${index + 1}`} // Sequential request titles
              description={`Quantity: ${request.quantity} Liters, ETA: ${calculateETA(
                request.latitude,
                request.longitude
              )}`}
              onPress={() => handleMarkerPress(request)} // Set selected marker and calculate ETA on press
              pinColor={selectedRequest?.id === request.id ? "blue" : "red"} // Highlight selected marker
            />
          ))}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button3D title="Get Location" onPress={focusOnLocation} />
        <Button3D
          title="Google Maps"
          onPress={() => openInGoogleMaps(pin.latitude, pin.longitude)}
        />
        <Start
          title="Start"
          onPress={() => {
            if (selectedRequest) {
              // Start navigation to the selected marker's location
              startNavigation(
                selectedRequest.latitude,
                selectedRequest.longitude
              );
            } else {
              console.warn("No marker selected");
            }
          }}
          uid={selectedRequest?.uid} // Pass the user id (uid) from selected request
          eta={selectedEta} // Pass the calculated ETA as a prop
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row", // Arrange buttons in a row
    justifyContent: "space-between", // Add space between buttons
    paddingHorizontal: 20, // Add padding to the left and right
  },
  buttonStyle: {
    flex: 1, // Make buttons take equal space
    marginHorizontal: 5, // Add space between buttons
  },
});

export default Map;
