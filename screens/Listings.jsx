import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Linking } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons'; 

const Listings = () => {
  const [businessData, setBusinessData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'businesses'));
        const businesses = [];
        querySnapshot.forEach((doc) => {
          businesses.push({ id: doc.id, ...doc.data() });
        });
        setBusinessData(businesses);
        setFilteredData(businesses);
      } catch (error) {
        console.error("Error fetching business data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  const handleSearch = (query) => {
    setSearch(query);
    if (query) {
      const filtered = businessData.filter((business) =>
        business.businessName.toLowerCase().includes(query.toLowerCase()) ||
        business.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(businessData);
    }
  };

  const openMap = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const callBusiness = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Business Name or Category"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.logoUrl }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.businessName}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <View style={styles.addressContainer}>
                <MaterialIcons name="location-on" size={18} color="gray" />
                <TouchableOpacity onPress={() => openMap(item.address)}>
                  <Text style={styles.address}>{item.address}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.phoneContainer}>
                <MaterialIcons name="phone" size={18} color="gray" />
                <TouchableOpacity onPress={() => callBusiness(item.contactNumber)}>
                  <Text style={styles.phoneNumber}>{item.contactNumber}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  card: {
    marginTop: 50,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#fff',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderWidth: 1, 
    borderColor: '#ccc', 
    overflow: 'hidden',
  },
  cardContent: {
    padding: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  category: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  address: {
    marginLeft: 5,
    color: 'blue',
  },
  phoneNumber: {
    marginLeft: 5,
    color: 'blue',
  },
});

export default Listings;
