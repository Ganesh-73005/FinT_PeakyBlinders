import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
} from "react-native";
import CommonStyles from "../CommonStyles";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyCSJWkgLJxmlVyPRxzinCueAXugCxXjM9Q");

const Chatbot = ({ navigation }) => {
    const [inputMessage, setInputMessage] = useState("");
    const [chat, setChat] = useState([
        {
            message: "Hello! How can I assist you today?",
            sender: "bot",
        },
    ]);
    const [anonymous_alert, setAnonymous_alert] = useState({
        type: "",
        description: "",
    });

    const onSubmit = async () => {
        if (inputMessage.trim() === "") return;

        // Add user message to chat
        setChat((prevChat) => [...prevChat, { message: inputMessage, sender: "user" }]);

        try {
            const contextMessage = `
            This app provides various features for literacy and protecting elder, teen financial managing:
            - GST scan to check validity, auto categorize, and manage expenses
            - Manage map interface for elder people to return proper route
            - Fraud scheme detection using blacklist API and dataset (PDF, text, audio upload)
            `;

            // Call Gemini API with context
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(contextMessage + inputMessage);
            const response = await result.response;
            const botMessage = response.text();

            // Add bot response to chat
            setChat((prevChat) => [...prevChat, { message: botMessage, sender: "bot" }]);

            setInputMessage("");
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setChat((prevChat) => [
                ...prevChat,
                { message: "Sorry, I encountered an error. Please try again.", sender: "bot" },
            ]);
        }
    };

    const keyboardVerticalOffset = Platform.OS === "ios" ? 90 : 0;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Image
                        source={require("../assets/icons/close.png")}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={[CommonStyles.bold, styles.title]}>Chatbot</Text>
                <View style={styles.placeholder} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={keyboardVerticalOffset}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={() => this.scrollView.scrollToEnd({ animated: true })}
                >
                    {chat.map((e, index) => (
                        <View
                            key={index}
                            style={[
                                styles.chatTextBox,
                                e.sender === "bot" ? styles.chatTextBoxLeft : styles.chatTextBoxRight,
                            ]}
                        >
                            <Text style={styles.chatText}>{e.message}</Text>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Type a message here"
                        onChangeText={setInputMessage}
                        value={inputMessage}
                        style={[CommonStyles.input, styles.textInput]}
                    />
                    <TouchableOpacity onPress={onSubmit} style={styles.sendButton}>
                        <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#EFEFEF",
    },
    backButton: {
        padding: 10,
    },
    backIcon: {
        width: 20,
        height: 20,
    },
    placeholder: {
        width: 40, // To balance the header
    },
    title: {
        fontSize: 20,
        textAlign: "center",
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 15,
    },
    chatTextBox: {
        marginBottom: 10,
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 12,
        maxWidth: "80%",
    },
    chatTextBoxLeft: {
        backgroundColor: "#ACACAC",
        alignSelf: "flex-start",
    },
    chatTextBoxRight: {
        backgroundColor: "#000",
        alignSelf: "flex-end",
    },
    chatText: {
        color: "#FFF",
        fontWeight: "bold",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#EFEFEF",
        backgroundColor: "white",
    },
    textInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 15,
        marginRight: 10,
    },
    sendButton: {
        padding: 10,
    },
    sendText: {
        color: "#007AFF",
        fontWeight: "bold",
    },
});

export default Chatbot;