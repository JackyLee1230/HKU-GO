import { auth, db } from "../../firebase";
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
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Modal, Portal } from "react-native-paper";
import styles from "./styles";
import { LinearGradient } from "expo-linear-gradient";
import { useHeaderHeight } from "@react-navigation/elements";

const RegisterScreen = ({ navigation }) => {
	const height = useHeaderHeight();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [imageURL, setImageURL] = useState("");
	const [registerErr, setRegisterErr] = useState();
	const [visible, setVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [showPassword, setShowPassword] = useState(false);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerBackTitle: "Back To Login",
		});
	}, [navigation]);

	onAuthStateChanged(auth, (user) => {
		if (user && user.uid && isLoading === false) {
			navigation.reset({
				index: 0,
				routes: [{ name: "Home" }],
			});
		}
	});

	const showModal = () => setVisible(true);
	const hideModal = () => {
		setVisible(false);
		setRegisterErr();
	};
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		paddingVertical: 40,
		marginHorizontal: 64,
		borderRadius: 8,
		elevation: 10,
		shadowColor: "#171717",
	};

	const register = async () => {
		const user = await createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredentials) => {
				const user = userCredentials.user;
				await updateProfile(user, {
					displayName: name,
					photoURL: imageURL || `https://ui-avatars.com/api/?name=${name}`,
				});
				await addDoc(collection(db, "points"), { uid: user.uid, points: 0 });
				await addDoc(collection(db, "registered"), {
					uid: user.uid,
					registered: [],
				});
				setIsLoading(false);
				console.log(user);
			})
			.catch((err) => {
				console.log(err);
				setRegisterErr(
					"Error! Reason: " +
						err.code
							.replace("auth/", "")
							.split("-")
							.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
							.join(" ")
				);
				showModal();
			});
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : null}
			style={styles.linearGradient}
			enabled
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
							color: "#256D85",
						}}
					>
						{registerErr}
					</Text>
					<Button
						mode="contained"
						onPress={hideModal}
						style={{
							marginTop: 24,
							backgroundColor: "#00C851",
						}}
					>
						CLOSE
					</Button>
				</Modal>
			</Portal>
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<LinearGradient
					colors={["#9FDDFF", "#E1F5FF"]}
					style={styles.mainFrame}
				>
					<Text style={styles.welcomeMessage}>Create a HKU GO account</Text>
					<TextInput
						placeholder="User Name"
						autoFocus
						type="text"
						value={name}
						onChangeText={(text) => setName(text)}
						underlineColor="#F7A76C"
						activeUnderlineColor="#FF8787"
						label={
							<Text>
								Name
								<Text style={{ color: "red" }}> *</Text>
							</Text>
						}
						style={{
							backgroundColor: "#FFFFFF",
							marginTop: 40,
						}}
					/>
					<TextInput
						placeholder="Image URL"
						type="text"
						label={<Text>Image URL (optional)</Text>}
						value={imageURL}
						onChangeText={(text) => setImageURL(text)}
						underlineColor="#F7A76C"
						activeUnderlineColor="#FF8787"
						style={{
							backgroundColor: "#FFFFFF",
							marginTop: 24,
						}}
					/>
					<TextInput
						placeholder="Email"
						type="email"
						value={email}
						label={
							<Text>
								Email
								<Text style={{ color: "red" }}> *</Text>
							</Text>
						}
						onChangeText={(text) => setEmail(text)}
						underlineColor="#F7A76C"
						activeUnderlineColor="#FF8787"
						style={{
							backgroundColor: "#FFFFFF",
							marginTop: 24,
						}}
					/>
					<TextInput
						placeholder="Password"
						type="password"
						secureTextEntry={!showPassword}
						value={password}
						label={
							<Text>
								Password
								<Text style={{ color: "red" }}> *</Text>
							</Text>
						}
						onChangeText={(text) => setPassword(text)}
						underlineColor="#F7A76C"
						activeUnderlineColor="#FF8787"
						style={{
							backgroundColor: "#FFFFFF",
							marginTop: 24,
						}}
						right={
							<TextInput.Icon
								icon={showPassword ? "eye" : "eye-off"}
								iconColor={"#222222"}
								size={24}
								onPress={() => {
									setShowPassword((prev) => !prev);
								}}
							/>
						}
					/>

					<TouchableOpacity
						activeOpacity={0.6}
						style={{
							width: "100%",
							marginTop: 40,
						}}
						disabled={email && password && name ? false : true} 
						onPress={async () => await register()}
					>
						<LinearGradient
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							colors={["#B6E388", "#7FB77E"]}
							style={{
								width: "100%",
								paddingVertical: 12,
								borderRadius: 8,
								elevation: 1,
								shadowColor: '#171717',
								opacity: (email && password && name) ? 1 : 0.35,
							}}
						>
							<Text style={styles.button}>REGISTER</Text>
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
							Already Have An Account?
						</Text>
						<Text
							onPress={() => navigation.replace("Login")}
							style={{
								fontSize: 16,
								fontWeight: "700",
								textAlign: "center",
								textDecorationLine: "underline",
								color: "#F7A76C",
							}}
						>
							Sign In Now
						</Text>
					</View>
				</LinearGradient>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default RegisterScreen;
