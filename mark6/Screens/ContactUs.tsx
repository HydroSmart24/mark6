import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const ContactUs: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = () => {
    if (!email || !subject || !message) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    // Proceed with form submission logic
    Alert.alert('Success', 'Your message has been sent.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Contact Us</Text>
      <Text style={styles.subheading}>
        Got a technical issue? Want to send feedback about a feature? Need details about our Business plan? Let us know.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your email</Text>
        <TextInput
          style={styles.input}
          placeholder="name@example.com"
          placeholderTextColor="#a1a1aa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Subject</Text>
        <TextInput
          style={styles.input}
          placeholder="Let us know how we can help you"
          placeholderTextColor="#a1a1aa"
          value={subject}
          onChangeText={setSubject}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your message</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Leave a comment..."
          placeholderTextColor="#a1a1aa"
          multiline={true}
          numberOfLines={6}
          value={message}
          onChangeText={setMessage}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
        <Text style={styles.buttonText}>Send message</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  heading: {
    marginBottom: 16,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1f2937',
  },
  subheading: {
    marginBottom: 24,
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    color: '#6b7280',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1f2937',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#1d4ed8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default ContactUs;
