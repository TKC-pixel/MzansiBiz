import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { db, storage } from '../firebaseConfig';

const API_KEY = '6d750e197dc044df88da1d16f3458066';

const BusinessReg = ({ navigation }) => {
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [logoUri, setLogoUri] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        Alert.alert("Permission Denied", "Allow location access to autofill your address.");
        return;
      }
      const { status: cameraRollStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraRollStatus !== 'granted') {
        Alert.alert("Permission Denied", "Allow access to your media library.");
        return;
      }
      setLoadingAddress(true);
      const location = await Location.getCurrentPositionAsync({});
      fetchAddressFromCoords(location.coords.latitude, location.coords.longitude);
    };

    requestPermissions();
  }, []);

  const fetchAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        setAddress(data.results[0].formatted);
      } else {
        Alert.alert("Error", "Could not fetch address. Please enter it manually.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch address.");
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleChooseLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const handleRegisterBusiness = async () => {
    if (!businessName || !address || !category || !contactNumber || !logoUri) {
      Alert.alert("Error", "Please fill in all fields and upload a logo.");
      return;
    }

    try {
      const logoRef = ref(storage, `businessLogos/${Date.now()}_${businessName}.jpg`);
      const response = await fetch(logoUri);
      const blob = await response.blob();

      await uploadBytes(logoRef, blob);
      const logoUrl = await getDownloadURL(logoRef);

      const businessData = {
        businessName,
        address,
        category,
        contactNumber,
        logoUrl,
      };

      await addDoc(collection(db, 'businesses'), businessData);
      Alert.alert("Success", "Business registered successfully!");
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} 
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Register Business</Text>

        <TextInput
          style={styles.input}
          placeholder="Business Name"
          value={businessName}
          onChangeText={setBusinessName}
        />

        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          editable={!loadingAddress}
        />

        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />

        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.imagePicker} onPress={handleChooseLogo}>
          {logoUri ? (
            <Image source={{ uri: logoUri }} style={styles.logo} />
          ) : (
            <Text style={styles.imagePickerText}>Upload Business Logo</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegisterBusiness}>
          <Text style={styles.registerButtonText}>Register Business</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    height: 150,
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#aaa',
    fontSize: 16,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  registerButton: {
    backgroundColor: 'blue', 
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff', 
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BusinessReg;
