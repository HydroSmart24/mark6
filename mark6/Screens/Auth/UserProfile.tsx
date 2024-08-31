import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { auth } from '../../firebase/firebaseConfig';  // Adjust the path according to your project structure

interface UserProfileProps {
    userName: string;
    userEmail: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userName, userEmail }) => {
    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    // Extract the first letter of the user's name
    const firstLetter = userName.charAt(0).toUpperCase();

    return (
        <View style={styles.container}>
            
            <View style={styles.circle}>
                <Text style={styles.circleText}>{firstLetter}</Text>
            </View>

           
            <View style={styles.rectangle}>
                <Text style={styles.rectangleText}>{userName}</Text>
            </View>

           
            <View style={styles.rectangle}>
                <Text style={styles.rectangleText}>{userEmail}</Text>
            </View>

           
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
    },
    circleText: {
        fontSize: 36,
        color: '#000',
        fontWeight: 'bold',
    },
    rectangle: {
        width: '100%',
        padding: 15,
        backgroundColor: '#F5F5F5',
        marginBottom: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rectangleText: {
        fontSize: 18,
        color: '#000',
    },
    logoutButton: {
        width: '100%',
        padding: 15,
        backgroundColor: '#007BA7',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 30,
    },
    logoutButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default UserProfile;
