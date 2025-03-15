import React, { useContext } from "react";
import { TextInput, TouchableOpacity, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, View } from "react-native";
import { StateContext } from "../../context/StateContext"; // Use StateContext
import Styles from "../../CommonStyles";

const Register2 = ({ route, navigation }) => {
    const { signupDetails, handleSignupChange, handleSignupSubmit, setLoading } = useContext(StateContext);

    const onSubmit = () => {
        handleSignupSubmit(signupDetails);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <SafeAreaView style={{ width: "100%", maxWidth: 500 }}>
                <Text style={[Styles.bold, styles.title]}>Tell us more about you :)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    keyboardType="numeric"
                    onChangeText={(text) => handleSignupChange({ target: { name: "mobileNumber", value: text } })}
                    value={signupDetails.mobileNumber}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Income"
                    keyboardType="numeric"
                    onChangeText={(text) => handleSignupChange({ target: { name: "income", value: text } })}
                    value={signupDetails.income}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Age"
                    keyboardType="numeric"
                    onChangeText={(text) => handleSignupChange({ target: { name: "age", value: text } })}
                    value={signupDetails.age}
                />
                <TouchableOpacity onPress={onSubmit} style={{ ...Styles.button, marginTop: 10 }}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.navigate("home")}>
                    <Text style={{ textAlign: "center", fontFamily: Styles.medium.fontFamily }}>
                        Back
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 40,
        backgroundColor: "#fff",
        flex: 1,
        justifyContent: "center",
        paddingTop: 100,
    },
    title: {
        fontSize: 30,
        textAlign: "center",
        marginBottom: 50,
    },
    input: {
        height: 50,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontFamily: Styles.bold.fontFamily,
        fontSize: 18,
    },
});

export default Register2;