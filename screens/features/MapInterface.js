import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

const MapInterface = ({ user_id }) => {
    const [expenses, setExpenses] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleMarkerPress = (location) => {
        setSelectedLocation(location);
    };

    const getDirections = (location) => {
        alert(`Getting directions to ${location.shopName}`);
    };


    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 12.9716,
                    longitude: 77.5946,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {expenses.map((expense, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: expense.latitude, longitude: expense.longitude }}
                        title={expense.shopName}
                        description={`₹${expense.amount}`}
                        onPress={() => handleMarkerPress(expense)}
                    >
                        <View style={styles.marker}>
                            <MaterialCommunityIcons name="shopping" size={24} color="#6200ee" />
                        </View>
                    </Marker>
                ))}
            </MapView>

            {selectedLocation && (
                <View style={styles.locationDetails}>
                    <Text style={styles.locationName}>{selectedLocation.shopName}</Text>
                    <Text style={styles.locationAddress}>{selectedLocation.address}</Text>
                    <Text style={styles.locationAmount}>₹{selectedLocation.amount}</Text>
                    <TouchableOpacity style={styles.directionsButton} onPress={() => getDirections(selectedLocation)}>
                        <Text style={styles.directionsText}>Get Directions</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    marker: {
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#6200ee",
    },
    locationDetails: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        elevation: 8,
    },
    locationName: {
        fontSize: 18,
        fontFamily: "Poppins-Bold",
        marginBottom: 8,
    },
    locationAddress: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#666",
        marginBottom: 8,
    },
    locationAmount: {
        fontSize: 16,
        fontFamily: "Poppins-Bold",
        color: "#6200ee",
        marginBottom: 16,
    },
    directionsButton: {
        backgroundColor: "#6200ee",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    directionsText: {
        color: "#fff",
        fontFamily: "Poppins-Bold",
    },
});

export default MapInterface;