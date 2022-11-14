import {
	View,
	Text,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import {
	Portal,
	Modal,
	TextInput,
	Button,
	HelperText,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./LoginScreen/styles";

const ResetPassword = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [visible, setVisible] = useState(false);

	const reset = async () => {
		if (email) {
			await sendPasswordResetEmail(auth, email);
			showModal();
		}
	};

	const hasEmailError = () => {
		return !email.includes("@") && email !== "";
	};

	const showModal = () => setVisible(true);
	const hideModal = () => {
		setVisible(false);
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
							color: "#256D85",
						}}
					>
						A password reset link has been sent to your email: {email}. {"\n"}
						If you do not receive an email, please check your spam folder.
					</Text>
					<Button
						mode="contained"
						onPress={() => {
							hideModal();
							setEmail("");
							navigation.replace("Login");
						}}
						style={{
							marginTop: 24,
							backgroundColor: "#00C851",
						}}
					>
						CLOSE
					</Button>
				</Modal>
			</Portal>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : null}
				style={styles.mainFrame}
			>
				<Text style={styles.welcomeMessage}>Reset Password</Text>
				<Text style={styles.welcomeRemindMessage}>
					Please Enter The Email Associated With Your Account
				</Text>

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

				<TouchableOpacity
					activeOpacity={0.6}
					style={{
						width: "100%",
						marginTop: 40,
					}}
					onPress={() => reset()}
				>
					<LinearGradient
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						colors={["#F8C4B4", "#FF8787"]}
						style={styles.buttonContainer}
					>
						<Text style={styles.button}>Reset Password</Text>
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
			</KeyboardAvoidingView>
		</LinearGradient>
	);
};

export default ResetPassword;
