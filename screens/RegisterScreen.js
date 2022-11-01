import { auth } from "../firebase";
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
} from "firebase/auth";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { KeyboardAvoidingView } from "react-native";
import { StatusBar } from "expo-status-bar";

const RegisterScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");

	useLayoutEffect(() => {
		navigation.setOptions({
			headerBackTitle: "Back To Login",
		});
	}, [navigation]);

	onAuthStateChanged(auth, (user) => {
		if (user) {
			navigation.replace("Home");
		}
	});

	const register = async () => {
		const user = await createUserWithEmailAndPassword(auth, email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;
				console.log(user);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<KeyboardAvoidingView behavior="padding">
			<StatusBar style="light" />
			<Text h3 style={{ marginBottom: 50 }}>
				Create a HKU GO account
			</Text>
			<View>
				<TextInput
					placeholder="Full Name"
					autoFocus
					type="text"
					value={name}
					onChangeText={(text) => setName(text)}
				/>
				<TextInput
					placeholder="Email"
					autoFocus
					type="email"
					value={email}
					onChangeText={(text) => setEmail(text)}
				/>
				<TextInput
					placeholder="Password"
					autoFocus
					type="password"
					value={password}
					onChangeText={(text) => setPassword(text)}
				/>
				<Button mode="contained" onPress={() => register()}>
					Register
				</Button>
			</View>
		</KeyboardAvoidingView>
	);
};

export default RegisterScreen;
