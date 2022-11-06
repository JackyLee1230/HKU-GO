import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity} from "react-native";
import React, { useState } from "react";
import { auth } from "../../firebase";
import {
	// signInWithEmailAndPassword,
	onAuthStateChanged,
	GoogleAuthProvider,
	signOut,
	signInWithEmailAndPassword,
	signInWithPopup,
} from "firebase/auth";
import { TextInput, Button, HelperText } from "react-native-paper";
import { CurrentRenderContext } from "@react-navigation/native";
import { Modal, Portal } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginErr, setLoginErr] = useState();
	const [visible, setVisible] = useState(false);
	const googleAuthProvider = new GoogleAuthProvider();

	onAuthStateChanged(auth, (currentUser) => {
		if (currentUser) {
			navigation.reset({
				index: 0,
				routes: [{ name: "Home" }],
			});
		}
	});

	const showModal = () => setVisible(true);
	const hideModal = () => {
		setVisible(false);
		setLoginErr();
	};

	const login = async () => {
		try {
			const user = signInWithEmailAndPassword(auth, email, password)
				.then((userCredentials) => {
					const user = userCredentials.user;
					// console.log(user);
				})
				.catch((err) => {
					console.log(err);
					setLoginErr(err.message);
					showModal();
				});
		} catch (error) {
			console.log(error.message);
		}
	};

	const hasEmailError = () => {
		return !email.includes("@") && email !== "";
	};

	const containerStyle = { 
		backgroundColor: "white",
		padding: 20,
		paddingVertical : 40,
		marginHorizontal: 64,
		borderRadius: 8,
		elevation: 10,
        shadowColor: '#171717',
	};

	return (
		<LinearGradient
			colors={["#9FDDFF", "#E1F5FF"]}
			style={styles.linearGradient}
		>
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={containerStyle}
				>
					<Text
						style={{ 
							fontSize: 18, 
							justifyContent: "center", 
							textAlign: "center", 
							color: "#256D85" 
						}}
					>
						{loginErr}
					</Text>
					<Button 
						mode="contained" 
						onPress={hideModal}
						style={{
							marginTop: 24,
							backgroundColor: "#00C851"
						}}
					>
						CONFIRM
					</Button>
				</Modal>
			</Portal>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.mainFrame}
			>
				<Text
					style={styles.welcomeMessage}
				>
					Welcome Back!
				</Text>
				<Text
					style={styles.welcomeRemindMessage}
				>
					Please Sign in to continue.
				</Text>

				<TextInput
					placeholder="Email"
					autoFocus
					type="email"
					value={email}
					onChangeText={(text) => setEmail(text)}
					underlineColor="#F7A76C"
					activeUnderlineColor="#FF8787"
					style={{
						backgroundColor: "#FFFFFF"
					}}
				/>
				<HelperText type="error" visible={hasEmailError()}>
					Email address is invalid!
				</HelperText>
				<TextInput
					placeholder="Password"
					autoFocus
					secureTextEntry={true}
					value={password}
					onChangeText={(text) => setPassword(text)}
					underlineColor="#F7A76C"
					activeUnderlineColor="#FF8787"
					style={{
						backgroundColor: "#FFFFFF"
					}}
				/>
				<TouchableOpacity
					activeOpacity={0.6}
					style={{
						width: "100%",
						marginTop: 48,
					}}
					onPress={() => login()}
				>
					<LinearGradient
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						colors={["#F8C4B4", "#FF8787"]}
						style={styles.buttonContainer}
					>
						<Text style={styles.button}>SIGN IN</Text>
					</LinearGradient>
				</TouchableOpacity>

				<View 
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						marginTop: 12,
					}}
				>
					<Text
						style={{
							fontSize: 14,
							fontWeight: "500",
							textAlign: "center",
							color: "#F7A76C",
							marginRight: 8,
						}}
					>
						Need an account? 
					</Text>
					<Text
						onPress={() => navigation.replace("Register")}
						style={{
							fontSize: 16,
							fontWeight: "700",
							textAlign: "center",
							textDecorationLine: "underline",
							color: "#F7A76C",
						}}
					>
						Register Now
					</Text>
				</View>
			</KeyboardAvoidingView>
		</LinearGradient>
	);
};

export default LoginScreen;
