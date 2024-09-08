import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator, StyleSheet, Text, View, Alert } from 'react-native';
import CardView from '../../components/CardView/RequestWaterCardView';
import { getAllUsers } from '../../utils/FetchAllUsers';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { db } from '../../firebase/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const POLLING_INTERVAL = 30000; // Poll every 60 seconds

export default function RequestWater() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [currentUserWaterLevel, setCurrentUserWaterLevel] = useState<number | null>(null); // Store current user's water level
    const [currentUserName, setCurrentUserName] = useState<string | null>(null); // Store current user's name

    // Function to convert ultrasonic reading (cm) to liters
    const convertToLiters = (distance: number): number => {
        if (distance < 10) return 1000; // Maximum liters (full tank at 10 cm)
        if (distance > 30) return 0;    // Minimum liters (empty tank at 30 cm)
        return (30 - distance) * 50;    // Conversion formula for intermediate levels
    };

    // Function to fetch the water level from the ESP32
    const fetchWaterLevel = async (espIp: string) => {
        try {
            const response = await axios.get(`http://${espIp}/get-water-level`);
            const distance = parseInt(response.data, 10);

            if (isNaN(distance)) {
                Alert.alert('Error', 'Invalid water level reading.');
                return null;
            }

            return distance;
        } catch (error) {
            console.error('Error fetching water level:', error);
            return null;
        }
    };

    // Function to update the water level in Firebase
    const updateWaterLevelInFirebase = async (userId: string, level: number) => {
        try {
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, { waterLevel: level });
            console.log(`Data uploaded to Firebase for user ${userId}: ${level} cm`);
        } catch (error) {
            console.error('Error updating water level in Firebase:', error);
            Alert.alert('Error', 'Failed to update water level in Firebase.');
        }
    };

    // Fetch and update the water level from ESP32 to Firebase and then fetch from Firebase for display
    const updateAndFetchWaterLevels = async () => {
        try {
            // Fetch and update water level for current user
            if (currentUserId) {
                const userDocRef = doc(db, 'users', currentUserId);
                const userDoc = await getDoc(userDocRef);
                const espIp = userDoc.exists() ? userDoc.data().ip : null;

                if (espIp) {
                    const distance = await fetchWaterLevel(espIp);
                    if (distance !== null) {
                        setCurrentUserWaterLevel(convertToLiters(distance));
                        console.log(`Data fetched from ESP32 for current user (${currentUserName}): ${distance} cm`);
                        await updateWaterLevelInFirebase(currentUserId, distance); // Update Firebase
                    }
                }
            }

            // Fetch and update water levels for other users from ESP32
            for (const user of users) {
                if (user.id !== currentUserId && user.ip) {
                    const distance = await fetchWaterLevel(user.ip);
                    if (distance !== null) {
                        const liters = convertToLiters(distance);
                        setUsers((prevUsers) =>
                            prevUsers.map((u) =>
                                u.id === user.id ? { ...u, waterLevel: liters } : u
                            )
                        );
                        console.log(`Data fetched from ESP32 for user (${user.name}): ${distance} cm`);
                        await updateWaterLevelInFirebase(user.id, distance); // Update Firebase
                    }
                }
            }

            // Fetch updated water levels from Firebase for all users (including current user)
            const usersData = await getAllUsers();
            setUsers(usersData);

            if (currentUserId) {
                const currentUserDocRef = doc(db, 'users', currentUserId);
                const currentUserDoc = await getDoc(currentUserDocRef);
                if (currentUserDoc.exists()) {
                    const currentUserData = currentUserDoc.data();
                    const currentDistance = currentUserData?.waterLevel || 30;
                    setCurrentUserWaterLevel(convertToLiters(currentDistance));
                    console.log(`Data fetched from Firebase for current user (${currentUserName}): ${currentDistance} cm`);
                }
            }
        } catch (error) {
            console.error('Error polling and fetching water levels:', error);
        }
    };

    // Fetch users and current user's water level and name from Firebase when component mounts
    useEffect(() => {
        const fetchUsersAndCurrentUserData = async () => {
            try {
                const auth = getAuth();
                const currentUser = auth.currentUser;

                if (currentUser) {
                    setCurrentUserId(currentUser.uid); // Set the current user's ID

                    // Fetch current user's water level and name from Firestore
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const distance = userData?.waterLevel || 30; // Default to empty if no data
                        const name = userData?.name || 'Unknown'; // Get the user's name

                        setCurrentUserWaterLevel(convertToLiters(distance)); // Convert to liters and set the water level
                        setCurrentUserName(name); // Set the current user's name
                        console.log(`Data fetched from Firebase for current user: ${name}, Water Level: ${distance} cm`);
                    }
                }

                const usersData = await getAllUsers();
                setUsers(usersData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users and current user data:', error);
                setLoading(false);
            }
        };

        fetchUsersAndCurrentUserData();
    }, [currentUserId]);

    // Use focus effect to only start polling when the screen is in focus
    useFocusEffect(
        useCallback(() => {
            const intervalId = setInterval(() => {
                updateAndFetchWaterLevels();
            }, POLLING_INTERVAL);

            // Clean up the interval when the screen loses focus
            return () => clearInterval(intervalId);
        }, [currentUserId, users])
    );

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    function handleRequestPress(user: any): void {
        throw new Error('Function not implemented.');
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Dashboard container to display current user's water level */}
            <View style={styles.dashboardContainer}>
                <Text style={styles.dashboardHeading}>Your Water Level</Text>
                <Text style={styles.dashboardText}>
                    {currentUserWaterLevel !== null ? `${currentUserWaterLevel} Liters` : 'Loading...'}
                </Text>
            </View>

            <ScrollView>
                {users.length > 0 ? (
                    users
                        .filter((user) => user.id !== currentUserId) // Exclude the current user
                        .map((user) => (
                            <CardView
                                key={user.id} // Each card must have a unique key
                                title={user.name} // Pass the user's name as the title
                                availableLiters={convertToLiters(user.waterLevel)} // Convert the user's water level to liters before passing
                                onRequestPress={() => handleRequestPress(user)} // Handle the water request
                                reqUserId={currentUserId || 'Unknown'} // Pass the current user's ID
                                ownerId={user.id}
                                currentUserName={currentUserName || 'Unknown'}  // Provide a fallback for null values
                            />
                        ))
                ) : (
                    <View style={{ padding: 20 }}>
                        <Text>No users available.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        marginHorizontal: 20,
    },
    dashboardContainer: {
        backgroundColor: '#1E8FBB',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashboardHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    dashboardText: {
        fontSize: 18,
        color: '#fff',
        marginTop: 10,
    },
});
