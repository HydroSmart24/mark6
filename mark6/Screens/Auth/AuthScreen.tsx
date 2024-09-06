import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/firebaseConfig'; // Ensure this path is correct
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions

// Define your navigation types
type RootStackParamList = {
  'AuthScreen': undefined;
  'index': undefined;
};

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AuthScreen'>;

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const navigation = useNavigation<AuthScreenNavigationProp>();

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save the user's name in Firestore under the 'users' collection
        await setDoc(doc(db, 'users', user.uid), {
          name: name,
          uid: user.uid,
          email: email,
        });

        Alert.alert('Success', 'Account created successfully!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'index' }], // Navigate to the main screen after signup
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('Success', 'Logged in successfully!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'index' }], // Navigate to the main screen after login
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/hydroLogo.png')} style={styles.logo} />
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>

        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            autoCapitalize="words"
            autoCorrect={false}
            value={name}
            onChangeText={setName}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleAuth}>
          <Text style={styles.loginButtonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.signupText}>{isSignUp ? 'Login' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#007BA7',
  },
  logoContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 70,
  },
  logo: {
    width: 65,
    height: 65,
  },
  formContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 15,
    paddingTop: 80,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 50,
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  loginButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#007BA7',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: '#007BA7',
    fontWeight: 'bold',
  },
});
