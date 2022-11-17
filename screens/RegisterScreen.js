import { auth, db } from "../firebase";
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	updateProfile,
} from "firebase/auth";
import {
	collection,
	addDoc,
	query,
	where,
	getDocs,
	deleteDoc,
	doc,
	setDoc,
} from "firebase/firestore";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { KeyboardAvoidingView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Modal, Portal } from "react-native-paper";

const RegisterScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [imageURL, setImageURL] = useState("");
	const [registerErr, setRegisterErr] = useState();
	const [visible, setVisible] = useState(false);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerBackTitle: "Back To Login",
		});
	}, [navigation]);

	onAuthStateChanged(auth, (user) => {
		if (user && user.uid) {
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
	const containerStyle = { backgroundColor: "white", padding: 20 };

	const register = async () => {
		const user = await createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredentials) => {
				const user = userCredentials.user;
				await updateProfile(user, {
					displayName: name,
					photoURL: imageURL || `https://ui-avatars.com/api/?name=${name}`,
				});
				await addDoc(collection(db, "points"), { uid: user.uid, points: 0 });
				console.log("New Points Doc written with ID : " + docRef.id);
				console.log(user.user);
			})
			.catch((err) => {
				console.log(err);
				setRegisterErr(err.message);
				showModal();
			});
	};

	return (
		<KeyboardAvoidingView behavior="padding">
			<StatusBar style="light" />
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={containerStyle}
				>
					<Text>{registerErr}</Text>
					<Button mode="contained" onPress={hideModal}>
						OK
					</Button>
				</Modal>
			</Portal>
			<Text h3 style={{ marginBottom: 50 }}>
				Create a HKU GO account
			</Text>
			<View>
				<TextInput
					placeholder="User Name"
					autoFocus
					type="text"
					value={name}
					onChangeText={(text) => setName(text)}
				/>
				<TextInput
					placeholder="Image URL (optional)"
					autoFocus
					type="text"
					value={imageURL}
					onChangeText={(text) => setImageURL(text)}
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
				<Button mode="contained" onPress={async () => await register()}>
					Register
				</Button>
			</View>
		</KeyboardAvoidingView>
	);
};

export default RegisterScreen;