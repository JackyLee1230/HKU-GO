import {
	View,
	Text,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	ScrollView,
} from "react-native";
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
import {
	TextInput,
	Button,
	HelperText,
	ActivityIndicator,
	MD2Colors,
} from "react-native-paper";
import { CurrentRenderContext } from "@react-navigation/native";
import { Modal, Portal } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";
import { CommonActions } from "@react-navigation/native";

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginErr, setLoginErr] = useState();
	const [visible, setVisible] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [loadingIndication, setLoadingIndication] = useState(false);

	onAuthStateChanged(auth, (currentUser) => {
		if (currentUser && currentUser.uid) {
			setLoadingIndication(true);
			// navigation.navigate("WithTab", { screen: "Home", screen: "TabBar" });
			navigation.reset({
				index: 0,
				routes: [
					{
						name: "WithTab",
						state: {
							routes: [{ name: "TabBar" }, { name: "Home" }],
						},
					},
				],
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
					setLoginErr(
						"Error! Reason: " +
							err.code
								.replace("auth/", "")
								.split("-")
								.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
								.join(" ")
					);
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
		paddingVertical: 40,
		marginHorizontal: 64,
		borderRadius: 8,
		elevation: 10,
		shadowColor: "#171717",
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : null}
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
							color: "#256D85",
						}}
					>
						{loginErr}
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
					<Text style={styles.welcomeMessage}>Welcome Back!</Text>
					<Text style={styles.welcomeRemindMessage}>
						Please Sign in to continue.
					</Text>

					<ActivityIndicator
						animating={loadingIndication}
						color={MD2Colors.red800}
						size={"large"}
					/>

					<TextInput
						placeholder="Email"
						autoFocus
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
						}}
					/>
					<HelperText type="error" visible={hasEmailError()}>
						Email address is invalid!
					</HelperText>
					<TextInput
						placeholder="Password"
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
						disabled={!email || !password}
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
							Forgot Password?
						</Text>
						<Text
							onPress={() => navigation.replace("ResetPassword")}
							style={{
								fontSize: 16,
								fontWeight: "700",
								textAlign: "center",
								textDecorationLine: "underline",
								color: "#F7A76C",
							}}
						>
							Reset Now!
						</Text>
					</View>
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
							Need An Account?
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
				</LinearGradient>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;
