import { NavigationContainer } from "@react-navigation/native";
import { StatusBar, View, Text } from "react-native";
import { useFonts } from "expo-font";
import React, { useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthScreen from "./screens/auth/AuthScreen"; // Ensure this path is correct
import MainScreen from "./screens/MainScreen"; // Ensure this path is correct
import StateContext, { StateProvider, SocketProvider } from "./context/StateContext";
import Loading from "./screens/pages/Loading"; // Ensure this path is correct
import { LogBox } from "react-native";

export default function App() {
    LogBox.ignoreAllLogs();

    const [fontsLoaded] = useFonts({
        "Poppins-Bold": require("./assets/Fonts/Poppins-Bold.ttf"),
        "Poppins-Thin": require("./assets/Fonts/Poppins-Thin.ttf"),
        "Poppins-Medium": require("./assets/Fonts/Poppins-Medium.ttf"),
    });

    if (!fontsLoaded) return null;

    return (
        <SafeAreaProvider>
            <StateProvider>
                <StatusBar barStyle={"auto"} />
                <NavigationContainer>
                    <AppMain />
                </NavigationContainer>
            </StateProvider>
        </SafeAreaProvider>
    );
}

const AppMain = () => {
    const context = useContext(StateContext);

    if (!context) {
        console.error("StateContext is undefined. Ensure it is wrapped inside StateProvider.");
        return (
            <View>
                <Text>Error: StateContext is not available.</Text>
            </View>
        );
    }

    const { isLogin } = context;
    console.log("Provider isLogin:", isLogin);

    return (
        <>
            {isLogin ? (
                
                    <MainScreen />
               
            ) : (
                <AuthScreen />
            )}
            <Loading />
        </>
    );
};