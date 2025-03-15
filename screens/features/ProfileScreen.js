import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Switch } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

const ProfileScreen = ({ user_id }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState("English");
    const [user, setUser] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+91 9876543210",
        profileImage: "https://via.placeholder.com/150",
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://10.11.146.138:5000/api/user/${user_id}`);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [user_id]);

    const toggleDarkMode = () => setDarkMode((previousState) => !previousState);
    const toggleNotifications = () => setNotifications((previousState) => !previousState);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileImageContainer}>
                    <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
                    <TouchableOpacity style={styles.editImageButton}>
                        <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Information</Text>
                <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="email-outline" size={24} color="#6200ee" style={styles.infoIcon} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{user.email}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <MaterialCommunityIcons name="pencil" size={20} color="#6200ee" />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="phone-outline" size={24} color="#6200ee" style={styles.infoIcon} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Phone</Text>
                        <Text style={styles.infoValue}>{user.phone}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <MaterialCommunityIcons name="pencil" size={20} color="#6200ee" />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoItem}>
                    <MaterialCommunityIcons name="translate" size={24} color="#6200ee" style={styles.infoIcon} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Language</Text>
                        <Text style={styles.infoValue}>{language}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#6200ee" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>App Settings</Text>
                <View style={styles.settingItem}>
                    <MaterialCommunityIcons name="bell-outline" size={24} color="#6200ee" style={styles.settingIcon} />
                    <View style={styles.settingContent}>
                        <Text style={styles.settingLabel}>Notifications</Text>
                        <Text style={styles.settingDescription}>Receive alerts for expenses and security</Text>
                    </View>
                    <Switch
                        value={notifications}
                        onValueChange={toggleNotifications}
                        trackColor={{ false: "#ccc", true: "#b794f6" }}
                        thumbColor={notifications ? "#6200ee" : "#f4f3f4"}
                    />
                </View>

                <View style={styles.settingItem}>
                    <MaterialCommunityIcons name="theme-light-dark" size={24} color="#6200ee" style={styles.settingIcon} />
                    <View style={styles.settingContent}>
                        <Text style={styles.settingLabel}>Dark Mode</Text>
                        <Text style={styles.settingDescription}>Switch between light and dark themes</Text>
                    </View>
                    <Switch
                        value={darkMode}
                        onValueChange={toggleDarkMode}
                        trackColor={{ false: "#ccc", true: "#b794f6" }}
                        thumbColor={darkMode ? "#6200ee" : "#f4f3f4"}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Security</Text>
                <TouchableOpacity style={styles.menuItem}>
                    <MaterialCommunityIcons name="lock-outline" size={24} color="#6200ee" style={styles.menuIcon} />
                    <View style={styles.menuContent}>
                        <Text style={styles.menuLabel}>Change Password</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#6200ee" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <MaterialCommunityIcons name="fingerprint" size={24} color="#6200ee" style={styles.menuIcon} />
                    <View style={styles.menuContent}>
                        <Text style={styles.menuLabel}>Biometric Authentication</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#6200ee" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <TouchableOpacity style={styles.menuItem}>
                    <MaterialCommunityIcons name="help-circle-outline" size={24} color="#6200ee" style={styles.menuIcon} />
                    <View style={styles.menuContent}>
                        <Text style={styles.menuLabel}>Help & Support</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#6200ee" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <MaterialCommunityIcons name="information-outline" size={24} color="#6200ee" style={styles.menuIcon} />
                    <View style={styles.menuContent}>
                        <Text style={styles.menuLabel}>About</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#6200ee" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton}>
                <MaterialCommunityIcons name="logout" size={20} color="#fff" style={styles.logoutIcon} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <View style={styles.versionInfo}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        backgroundColor: "#fff",
        padding: 24,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    profileImageContainer: {
        position: "relative",
        marginBottom: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editImageButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#6200ee",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#fff",
    },
    userName: {
        fontSize: 20,
        fontFamily: "Poppins-Bold",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#666",
    },
    section: {
        backgroundColor: "#fff",
        padding: 16,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Poppins-Bold",
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    infoIcon: {
        marginRight: 16,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: "#666",
    },
    infoValue: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
    },
    editButton: {
        padding: 8,
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    settingIcon: {
        marginRight: 16,
    },
    settingContent: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
    },
    settingDescription: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#666",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    menuIcon: {
        marginRight: 16,
    },
    menuContent: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
    },
    logoutButton: {
        backgroundColor: "#6200ee",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        margin: 16,
        borderRadius: 8,
    },
    logoutIcon: {
        marginRight: 8,
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Poppins-Bold",
    },
    versionInfo: {
        alignItems: "center",
        padding: 16,
    },
    versionText: {
        fontSize: 12,
        fontFamily: "Poppins-Medium",
        color: "#888",
    },
})

export default ProfileScreen

