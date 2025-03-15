"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Audio } from "expo-av"

const LearningMaterials = () => {
    const [selectedLanguage, setSelectedLanguage] = useState("english")
    const [playingAudio, setPlayingAudio] = useState(null)
    const [sound, setSound] = useState(null)

    // Mock data for learning materials
    const learningMaterials = {
        english: [
            {
                id: "1",
                title: "How to Identify Phishing Attempts",
                description: "Learn how to protect yourself from email and SMS phishing scams.",
                type: "audio",
                duration: "3:45",
                thumbnail: "/placeholder.svg",
            },
            {
                id: "2",
                title: "Secure Online Banking Practices",
                description: "Essential tips to keep your online banking secure and prevent fraud.",
                type: "audio",
                duration: "5:20",
                thumbnail: "/placeholder.svg",
            },
            {
                id: "3",
                title: "Protecting Your Personal Information",
                description: "Learn how to safeguard your personal and financial information from identity theft.",
                type: "audio",
                duration: "4:10",
                thumbnail: "/placeholder.svg",
            },
        ],
        hindi: [
            {
                id: "1",
                title: "फिशिंग प्रयासों की पहचान कैसे करें",
                description: "ईमेल और एसएमएस फिशिंग घोटालों से खुद को कैसे बचाएं, यह जानें।",
                type: "audio",
                duration: "3:45",
                thumbnail: "/placeholder.svg",
            },
            {
                id: "2",
                title: "सुरक्षित ऑनलाइन बैंकिंग प्रथाएं",
                description: "अपनी ऑनलाइन बैंकिंग को सुरक्षित रखने और धोखाधड़ी को रोकने के लिए आवश्यक टिप्स।",
                type: "audio",
                duration: "5:20",
                thumbnail: "/placeholder.svg",
            },
        ],
        tamil: [
            {
                id: "1",
                title: "ஃபிஷிங் முயற்சிகளை எவ்வாறு அடையாளம் காண்பது",
                description: "மின்னஞ்சல் மற்றும் எஸ்எம்எஸ் ஃபிஷிங் மோசடிகளில் இருந்து உங்களை எவ்வாறு பாதுகாத்துக் கொள்வது என்பதை அறிந்து கொள்ளுங்கள்.",
                type: "audio",
                duration: "3:45",
                thumbnail: "/placeholder.svg",
            },
        ],
    }

    const languages = [
        { id: "english", name: "English" },
        { id: "hindi", name: "हिंदी" },
        { id: "tamil", name: "தமிழ்" },
    ]

    const playAudio = async (materialId) => {
        // In a real app, this would play the actual audio file
        // For this demo, we'll just simulate playing audio

        // Stop any currently playing audio
        if (sound) {
            await sound.unloadAsync()
        }

        // Create a new sound object and play it
        try {
            const { sound: newSound } = await Audio.Sound.createAsync(
                require("../../assets/dummy-audio.mp3"), // This is a placeholder, would be a real audio file in a real app
                { shouldPlay: true },
            )

            setSound(newSound)
            setPlayingAudio(materialId)

            // When audio finishes playing
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setPlayingAudio(null)
                }
            })
        } catch (error) {
            console.error("Error playing audio:", error)
            // In a real app, you would handle this error appropriately
            alert("Could not play audio. Please try again later.")
        }
    }

    const stopAudio = async () => {
        if (sound) {
            await sound.stopAsync()
            setPlayingAudio(null)
        }
    }

    const renderMaterialItem = (material) => (
        <TouchableOpacity
            key={material.id}
            style={styles.materialItem}
            onPress={() =>
                material.type === "audio" ? (playingAudio === material.id ? stopAudio() : playAudio(material.id)) : null
            }
        >
            <View style={styles.materialThumbnail}>
                <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.thumbnailImage} />
                {material.type === "audio" && (
                    <View style={styles.audioIcon}>
                        <MaterialCommunityIcons name={playingAudio === material.id ? "pause" : "play"} size={24} color="#fff" />
                    </View>
                )}
            </View>
            <View style={styles.materialDetails}>
                <Text style={styles.materialTitle}>{material.title}</Text>
                <Text style={styles.materialDescription}>{material.description}</Text>
                {material.type === "audio" && <Text style={styles.materialDuration}>{material.duration}</Text>}
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Learning Materials</Text>
            </View>

            <View style={styles.languageSelector}>
                <Text style={styles.languageLabel}>Select Language:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageOptions}>
                    {languages.map((language) => (
                        <TouchableOpacity
                            key={language.id}
                            style={[styles.languageOption, selectedLanguage === language.id && styles.selectedLanguage]}
                            onPress={() => setSelectedLanguage(language.id)}
                        >
                            <Text style={[styles.languageText, selectedLanguage === language.id && styles.selectedLanguageText]}>
                                {language.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView style={styles.materialsContainer}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fraud Prevention Guidelines</Text>
                    {learningMaterials[selectedLanguage]?.map(renderMaterialItem) || (
                        <Text style={styles.noMaterialsText}>No materials available in this language yet.</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Latest Financial News</Text>
                    <TouchableOpacity style={styles.newsItem}>
                        <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.newsThumbnail} />
                        <View style={styles.newsDetails}>
                            <Text style={styles.newsTitle}>RBI Introduces New Guidelines for UPI Transactions</Text>
                            <Text style={styles.newsDate}>May 15, 2023</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.newsItem}>
                        <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.newsThumbnail} />
                        <View style={styles.newsDetails}>
                            <Text style={styles.newsTitle}>New Tax Regulations for Digital Payments</Text>
                            <Text style={styles.newsDate}>May 10, 2023</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        padding: 16,
        backgroundColor: "#fff",
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Poppins-Bold",
        color: "#333",
    },
    languageSelector: {
        padding: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    languageLabel: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        marginBottom: 8,
    },
    languageOptions: {
        flexDirection: "row",
    },
    languageOption: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: "#f0f0f0",
    },
    selectedLanguage: {
        backgroundColor: "#6200ee",
    },
    languageText: {
        fontFamily: "Poppins-Medium",
        color: "#666",
    },
    selectedLanguageText: {
        color: "#fff",
    },
    materialsContainer: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Poppins-Bold",
        marginBottom: 16,
    },
    materialItem: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 16,
        elevation: 2,
    },
    materialThumbnail: {
        width: 100,
        height: 100,
        position: "relative",
    },
    thumbnailImage: {
        width: "100%",
        height: "100%",
    },
    audioIcon: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    materialDetails: {
        flex: 1,
        padding: 12,
    },
    materialTitle: {
        fontSize: 14,
        fontFamily: "Poppins-Bold",
        marginBottom: 4,
    },
    materialDescription: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#666",
        marginBottom: 8,
    },
    materialDuration: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#6200ee",
    },
    noMaterialsText: {
        fontFamily: "Poppins-Medium",
        color: "#666",
        textAlign: "center",
        padding: 16,
    },
    newsItem: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 16,
        elevation: 2,
    },
    newsThumbnail: {
        width: 100,
        height: 100,
    },
    newsDetails: {
        flex: 1,
        padding: 12,
        justifyContent: "center",
    },
    newsTitle: {
        fontSize: 14,
        fontFamily: "Poppins-Bold",
        marginBottom: 4,
    },
    newsDate: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#666",
    },
})

export default LearningMaterials

