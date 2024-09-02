import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../../firebase/firebaseConfig';  // Adjust the path according to your project structure
import Loading from '../../components/Loading/BasicLoading';

interface UserProfileProps {
    userName: string;
    userEmail: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userName, userEmail }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetching or any async operation
        const fetchData = async () => {
            try {
                // Simulate a delay
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    // Extract the first letter of the user's name
    const firstLetter = userName.charAt(0).toUpperCase();

    if (loading) {
        return <Loading visible={true} />;
    }

    return (
        <View style={styles.container}>
            {/* Circle with the first letter */}
            <View style={styles.circle}>
                <Text style={styles.circleText}>{firstLetter}</Text>
            </View>

            {/* Username Field */}
            <View style={styles.rectangle}>
                <Text style={styles.fieldHeading}>Username</Text>
                <Text style={styles.rectangleText}>{userName}</Text>
            </View>

            {/* Email Field */}
            <View style={styles.rectangle}>
                <Text style={styles.fieldHeading}>Email</Text>
                <Text style={styles.rectangleText}>{userEmail}</Text>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: -250,
    },
    circleText: {
        fontSize: 36,
        color: '#000',
        fontWeight: 'bold',
    },
    rectangle: {
        width: '100%',
        padding: 20,
        backgroundColor: '#F5F5F5',
        marginBottom: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        elevation: 3, // Adds subtle shadow for depth
    },
    fieldHeading: {
        fontSize: 16,
        color: '#555',
        fontWeight: '600',
        marginBottom: 5,
    },
    rectangleText: {
        fontSize: 18,
        color: '#000',
        fontWeight: '500',
    },
    logoutButton: {
        width: '60%',
        padding: 15,
        backgroundColor: '#007BA7',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 200,
        elevation: 5, // Adds shadow to make the button stand out
    },
    logoutButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default UserProfile;
