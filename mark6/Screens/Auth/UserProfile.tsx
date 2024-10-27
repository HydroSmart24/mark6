import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { auth } from '../../firebase/firebaseConfig'; // Adjust the path according to your project structure
import Loading from '../../components/Loading/BasicLoading';

interface UserProfileProps {
    userName: string;
    userEmail: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userName, userEmail }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
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

    console.log(userName)
    console.log(userEmail)
    const handleRedirectToHTML = () => {
        const url = `https://hydrosmart24.github.io/Account-Delete-Page-/?username=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}`;
        Linking.openURL(url); // Open the URL in the device's web browser
    };

    const firstLetter = userName.charAt(0).toUpperCase();

    if (loading) {
        return <Loading visible={true} />;
    }

    return (
        <View style={styles.container}>
            <>
                <View style={styles.circle}>
                    <Text style={styles.circleText}>{firstLetter}</Text>
                </View>

                <View style={styles.rectangle}>
                    <Text style={styles.fieldHeading}>Username</Text>
                    <Text style={styles.rectangleText}>{userName}</Text>
                </View>

                <View style={styles.rectangle}>
                    <Text style={styles.fieldHeading}>Email</Text>
                    <Text style={styles.rectangleText}>{userEmail}</Text>
                </View>

                <TouchableOpacity style={styles.redirectButton} onPress={handleRedirectToHTML}>
                    <Text style={styles.redirectButtonText}>Delete Account</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </>
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
        marginTop: -180,
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
        marginBottom: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
        elevation: 3,
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
    redirectButton: {
        width: '60%',
        padding: 15,
        backgroundColor: '#FF0000',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 5,
    },
    redirectButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    logoutButton: {
        width: '60%',
        padding: 15,
        backgroundColor: '#007BA7',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    logoutButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default UserProfile;
