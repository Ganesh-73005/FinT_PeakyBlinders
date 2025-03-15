import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, TextInput } from "react-native";
import { Camera } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const GSTScanner = ({ user_id }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scannedBill, setScannedBill] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [cameraRef, setCameraRef] = useState(null);
    const [billData, setBillData] = useState(null);
    const [captchaImage, setCaptchaImage] = useState(null);
    const [captchaCookie, setCaptchaCookie] = useState(null);
    const [captchaInput, setCaptchaInput] = useState("");
    const [gstNumber, setGstNumber] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef) {
            setScanning(true);
            try {
                const photo = await cameraRef.takePictureAsync();
                setScannedBill(photo.uri);
                processImage(photo.uri);
            } catch (error) {
                console.error("Error taking picture:", error);
                Alert.alert("Error", "Failed to capture image");
            } finally {
                setScanning(false);
            }
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setScannedBill(result.assets[0].uri);
            processImage(result.assets[0].uri);
        }
    };

    const processImage = async (imageUri) => {
        try {
            // Upload the image to the backend
            const response = await axios.post('http://10.11.146.138:5001/extract-and-categorize', {
                file: imageUri,
            });

            setGstNumber(response.data.gst_number);
            setCaptchaImage(response.data.captcha_image);
            setCaptchaCookie(response.data.captcha_cookie);
        } catch (error) {
            console.error("Error processing bill:", error);
            Alert.alert("Error", "Failed to process the bill. Please try again.");
        }
    };

    const handleCaptchaSubmit = async () => {
        try {
            const response = await axios.post('http://10.11.146.138:5001/fetch-gst-details', {
                gst_number: gstNumber,
                captcha: captchaInput,
                captcha_cookie: captchaCookie,
            });

            setBillData(response.data);
            Alert.alert("Bill Processed Successfully", "Bill details have been extracted and expenses have been updated.");
        } catch (error) {
            console.error("Error fetching GST details:", error);
            Alert.alert("Error", "Failed to fetch GST details. Please try again.");
        }
    };

    const resetScanner = () => {
        setScannedBill(null);
        setBillData(null);
        setCaptchaImage(null);
        setCaptchaInput("");
    };

    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting camera permission...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text>No access to camera. Please enable camera permissions.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {!scannedBill ? (
                <View style={styles.cameraContainer}>
                    <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={(ref) => setCameraRef(ref)}>
                        <View style={styles.overlay}>
                            <View style={styles.scanFrame} />
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={pickImage}>
                                <MaterialCommunityIcons name="image" size={28} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={scanning}>
                                <MaterialCommunityIcons name="camera" size={36} color="white" />
                            </TouchableOpacity>
                            <View style={styles.button} />
                        </View>
                    </Camera>
                </View>
            ) : (
                <ScrollView style={styles.resultContainer}>
                    <View style={styles.imagePreview}>
                        <Image source={{ uri: scannedBill }} style={styles.previewImage} />
                    </View>

                    {captchaImage && !billData ? (
                        <View style={styles.captchaContainer}>
                                <Image source={{ uri: `http://10.11.146.138:5001/uploads/${captchaImage}` }} style={styles.captchaImage} />
                            <TextInput
                                style={styles.captchaInput}
                                placeholder="Enter Captcha"
                                value={captchaInput}
                                onChangeText={setCaptchaInput}
                            />
                            <TouchableOpacity style={styles.captchaButton} onPress={handleCaptchaSubmit}>
                                <Text style={styles.captchaButtonText}>Submit Captcha</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {billData ? (
                        <View style={styles.billDetails}>
                            <Text style={styles.sectionTitle}>Bill Details</Text>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Shop:</Text>
                                <Text style={styles.detailValue}>{billData.shopName}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Total Amount:</Text>
                                <Text style={styles.detailValue}>₹{billData.amount}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Date:</Text>
                                <Text style={styles.detailValue}>{new Date(billData.date).toLocaleDateString()}</Text>
                            </View>

                            <Text style={styles.sectionTitle}>Items</Text>
                            {billData.items.map((item, index) => (
                                <View key={index} style={styles.itemRow}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.processing}>
                            <Text style={styles.processingText}>Processing bill...</Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.resetButton} onPress={resetScanner}>
                        <Text style={styles.resetButtonText}>Scan Another Bill</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    cameraContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    scanFrame: {
        width: 280,
        height: 400,
        borderWidth: 2,
        borderColor: "#fff",
        backgroundColor: "transparent",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: 30,
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "rgba(98, 0, 238, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    resultContainer: {
        flex: 1,
        padding: 16,
    },
    imagePreview: {
        alignItems: "center",
        marginBottom: 20,
    },
    previewImage: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        resizeMode: "cover",
    },
    processing: {
        alignItems: "center",
        padding: 20,
    },
    processingText: {
        fontSize: 18,
        fontFamily: "Poppins-Medium",
    },
    billDetails: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: "Poppins-Bold",
        marginBottom: 10,
        color: "#6200ee",
    },
    detailRow: {
        flexDirection: "row",
        marginBottom: 8,
    },
    detailLabel: {
        width: 100,
        fontFamily: "Poppins-Medium",
        color: "#555",
    },
    detailValue: {
        flex: 1,
        fontFamily: "Poppins-Medium",
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    itemName: {
        flex: 2,
        fontFamily: "Poppins-Medium",
    },
    itemPrice: {
        flex: 1,
        textAlign: "right",
        fontFamily: "Poppins-Medium",
    },
    resetButton: {
        backgroundColor: "#6200ee",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
    },
    resetButtonText: {
        color: "#fff",
        fontFamily: "Poppins-Bold",
        fontSize: 16,
    },
    captchaContainer: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        elevation: 2,
    },
    captchaImage: {
        width: "100%",
        height: 100,
        resizeMode: "contain",
        marginBottom: 16,
    },
    captchaInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
    },
    captchaButton: {
        backgroundColor: "#6200ee",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    captchaButtonText: {
        color: "#fff",
        fontFamily: "Poppins-Bold",
    },
});

export default GSTScanner;