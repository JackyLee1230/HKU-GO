import { View, Text } from "react-native";
import React, { useState } from "react";
import { auth } from "../firebase";
import {
	// signInWithEmailAndPassword,
	onAuthStateChanged,
	GoogleAuthProvider,
	signOut,
	signInWithEmailAndPassword,
	signInWithPopup,
} from "firebase/auth";
import { KeyboardAvoidingView } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import { CurrentRenderContext } from "@react-navigation/native";

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const googleAuthProvider = new GoogleAuthProvider();

	onAuthStateChanged(auth, (currentUser) => {
		// navigation.replace("Home");
		console.log(currentUser);
	});

	const login = async () => {
		try {
			const user = signInWithEmailAndPassword(auth, email, password)
				.then((userCredentials) => {
					const user = userCredentials.user;
					console.log(user);
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (error) {
			console.log(error.message);
		}
	};

	const hasEmailError = () => {
		return !email.includes("@") && email !== "";
	};

	return (
		<View>
			<TextInput
				placeholder="Email"
				autoFocus
				type="email"
				value={email}
				onChangeText={(text) => setEmail(text)}
			/>
			<HelperText type="error" visible={hasEmailError()}>
				Email address is invalid!
			</HelperText>
			<TextInput
				placeholder="Password"
				autoFocus
				type="password"
				value={password}
				onChangeText={(text) => setPassword(text)}
			/>
			<Button mode="contained" onPress={() => login()}>
				Login
			</Button>
		</View>
	);
};

export default LoginScreen;
