import { View, Text, KeyboardAvoidingView } from "react-native";
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
import { TextInput, Button, HelperText } from "react-native-paper";
import { CurrentRenderContext } from "@react-navigation/native";
import { Modal, Portal } from "react-native-paper";

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

	const containerStyle = { backgroundColor: "white", padding: 20 };

	return (
		<KeyboardAvoidingView behavior="padding">
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={containerStyle}
				>
					<Text>{loginErr}</Text>
					<Button mode="contained" onPress={hideModal}>
						OK
					</Button>
				</Modal>
			</Portal>
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
				secureTextEntry={true}
				value={password}
				onChangeText={(text) => setPassword(text)}
			/>
			<Button mode="containButtoned" onPress={() => login()}>
				Login
			</Button>
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;