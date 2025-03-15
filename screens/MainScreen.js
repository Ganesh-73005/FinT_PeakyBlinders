import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { BottomNavigation } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import GSTScanner from "./features/GSTScanner";
import ExpenseTracker from "./features/ExpenseTracker";
import MapInterface from "./features/MapInterface";
import LearningMaterials from "./features/LearningMaterials";
import ProfileScreen from "./features/ProfileScreen";
import Chatbot from "../components/Chatbot"; 
const MainScreen = () => {
    const [index, setIndex] = useState(0);
    const user_id = "12345"; // Hardcoded user_id

    const TABS = [
        { key: "scanner", title: "Scanner", icon: "camera", component: () => <GSTScanner user_id={user_id} /> },
        { key: "expenses", title: "Expenses", icon: "cash-multiple", component: () => <ExpenseTracker user_id={user_id} /> },
        { key: "map", title: "Map", icon: "map-marker", component: () => <MapInterface user_id={user_id} /> },
        { key: "learn", title: "Learn", icon: "book-open-variant", component: LearningMaterials },
        { key: "profile", title: "Profile", icon: "account", component: () => <ProfileScreen user_id={user_id} /> },
        { key: "chatbot", title: "chatbot", icon: "bot", component: () => <Chatbot  /> }
    ];

    const renderScene = ({ route }) => {
        const Component = TABS.find((tab) => tab.key === route.key)?.component;
        return Component ? <Component /> : <View />;
    };

    return (
        
            <BottomNavigation
                navigationState={{ index, routes: TABS }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                renderIcon={({ route, color }) => (
                    <MaterialCommunityIcons name={route.icon} size={24} color={color} />
                )}
                barStyle={{ backgroundColor: "#ffffff" }}
                activeColor="#6200ee"
                inactiveColor="#757575"
        />

        
        
    );
};

export default MainScreen;