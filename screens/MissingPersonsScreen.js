import React, { useState } from 'react';
import { 
  View, Text, Button, StyleSheet, FlatList, Image, Modal, TextInput, ScrollView 
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const MissingPersonsScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [photo, setPhoto] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [reports, setReports] = useState([
    { id: '1', name: 'John Doe', age: '25', lastSeen: 'New York', description: 'Wearing blue jacket', contact: '9876543210', status: 'Missing', imageUrl: 'https://via.placeholder.com/100', latitude: '40.7128', longitude: '-74.0060' },
    { id: '2', name: 'Jane Smith', age: '30', lastSeen: 'Los Angeles', description: 'Wearing red hoodie', contact: '9876543222', status: 'Found', imageUrl: 'https://via.placeholder.com/100', latitude: '34.0522', longitude: '-118.2437' },
  ]);
  const [filteredReports, setFilteredReports] = useState(reports);

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'All') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter(report => report.status === newStatus));
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (!response.didCancel && !response.error) {
        setPhoto(response.assets[0].uri);
      }
    });
  };

  const fetchCoordinates = async (location) => {
    const apiKey = 'AIzaSyCyZYuKJc4YREy3ppZxlnODX_HL7sJlAbk'; // Replace with your actual Google Maps API Key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
      } else {
        console.log('Location not found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const handleLocationChange = (text) => {
    setLastSeen(text);
    if (text.trim().length > 3) { 
      fetchCoordinates(text);
    }
  };

  const handleReportSubmit = () => {
    const newReport = { 
      id: (reports.length + 1).toString(), 
      name, 
      age, 
      lastSeen, 
      description, 
      contact, 
      status: 'Missing', 
      imageUrl: photo || 'https://via.placeholder.com/100', 
      latitude, 
      longitude 
    };
    setReports([...reports, newReport]);
    setFilteredReports([...reports, newReport]);
    setShowModal(false);
  };

  const openReportModal = () => {
    setName('');
    setAge('');
    setLastSeen('');
    setDescription('');
    setContact('');
    setPhoto(null);
    setLatitude('');
    setLongitude('');
    setShowModal(true);
  };

  const renderReportItem = ({ item }) => (
    <View style={styles.reportCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.reportImage} />
      <View style={styles.reportInfo}>
        <Text style={styles.reportName}>{item.name}</Text>
        <Text style={styles.reportDetails}>Age: {item.age}</Text>
        <Text style={styles.reportDetails}>Last Seen: {item.lastSeen}</Text>
        <Text style={styles.reportDetails}>Description: {item.description}</Text>
        <Text style={styles.reportDetails}>Contact: {item.contact}</Text>
        <Text style={styles.reportDetails}>Latitude:{item.latitude}</Text>
        <Text style={styles.reportDetails}>Longitude:{item.longitude}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Missing Persons</Text>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Button title="All" onPress={() => handleStatusChange('All')} color="#007BFF" />
        <Button title="Missing" onPress={() => handleStatusChange('Missing')} color="#FF6347" />
        <Button title="Found" onPress={() => handleStatusChange('Found')} color="#32CD32" />
      </View>

      {/* List of Missing Persons */}
      <FlatList
        data={filteredReports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id}
        style={styles.reportsList}
      />

      {/* Add Report Button */}
      <View style={styles.addReportButtonContainer}>
        <Button title="Report Missing Person" onPress={openReportModal} color="#4CAF50" />
      </View>

      {/* Modal for Adding Report */}
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Report Missing Person</Text>

          <TextInput style={styles.inputField} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.inputField} placeholder="Age" keyboardType="numeric" value={age} onChangeText={setAge} />
          <TextInput 
            style={styles.inputField} 
            placeholder="Last Seen Location" 
            value={lastSeen} 
            onChangeText={handleLocationChange} 
          />
          <TextInput style={styles.inputField} placeholder="Description" value={description} onChangeText={setDescription} />
          <TextInput style={styles.inputField} placeholder="Contact Info" keyboardType="phone-pad" value={contact} onChangeText={setContact} />
          <TextInput style={styles.inputField} placeholder="Latitude" keyboardType="numeric" value={latitude} editable={false} />
          <TextInput style={styles.inputField} placeholder="Longitude" keyboardType="numeric" value={longitude} editable={false} />

          <Button title="Pick Photo" onPress={handleImagePick} color="#007BFF" />
          {photo && <Image source={{ uri: photo }} style={styles.previewImage} />}

          <View style={styles.modalButtons}>
            <Button title="Submit Report" onPress={handleReportSubmit} color="#4CAF50" />
            <Button title="Close" onPress={() => setShowModal(false)} color="#FF6347" />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default MissingPersonsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  title: { fontSize: 28, fontWeight: '700', color: '#333', marginBottom: 20, textAlign: 'center' },
  filtersContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  reportsList: { marginBottom: 20 },
  reportCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 8, elevation: 2 },
  reportImage: { width: 80, height: 80, borderRadius: 40, marginRight: 15 },
  reportInfo: { flex: 1, justifyContent: 'center' },
  reportName: { fontSize: 18, fontWeight: '600', color: '#333' },
  reportDetails: { fontSize: 14, color: '#666', marginTop: 5 },
  addReportButtonContainer: { marginTop: 10, alignItems: 'center' },
  modalContainer: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 24, fontWeight: '600', color: '#333', marginBottom: 30, textAlign: 'center' },
  inputField: { height: 45, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 10, fontSize: 16, color: '#333' },
  previewImage: { width: 100, height: 100, borderRadius: 10, alignSelf: 'center', marginVertical: 10 },
  modalButtons: { marginTop: 20 ,marginBottom:20, flexDirection: 'column', justifyContent: 'space-between',gap:20 },
});
