import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import CardView from '../../components/CardView/RequestWaterCardView';
import { getAllUsers } from '../../utils/FetchAllUsers';

export default function RequestWater() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch users from Firebase when component mounts
        const fetchUsers = async () => {
            try {
                const usersData = await getAllUsers(); // Fetch users using the function
                setUsers(usersData); // Set the users data to state
                setLoading(false);   // Turn off loading spinner
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleRequestPress = () => {
        console.log('Request button pressed'); // Modal should be popped up.
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text style={styles.heading}>Tanks in your area</Text>
            <ScrollView>
                {users.length > 0 ? (
                    users.map((user) => (
                        <CardView
                            key={user.id} // Each card must have a unique key
                            title={user.name} // Pass the user's name as the title
                            availableLiters={user.waterLevel} // Pass the user's water level
                            onRequestPress={handleRequestPress}
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
});