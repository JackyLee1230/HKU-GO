import React, { useState } from "react";
import {
	ScrollView,
	View,
	Text,
	Image,
	ImageBackground,
	TouchableOpacity,
	Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";
import { Modal, Portal } from "react-native-paper";
import { Button } from "react-native-paper";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import * as Device from "expo-device";

const InitialScreen = ({ navigation }) => {
	const [visible, setVisible] = React.useState(false);

	onAuthStateChanged(auth, (currentUser) => {
		if (currentUser) {
			navigation.navigate("WithTab", { screen: "Home", screen: "TabBar" });
		}
	});

	const showModal = () => {
		setVisible(true);
	};

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
			colors={["#0098FF", "#DFF6FF"]}
			style={styles.linearGradient}
		>
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={containerStyle}
				>
					<View
						style={{
							flexDirection: "column",
							alignSelf: "center",
						}}
					>
						<Text
							style={{
								fontSize: 16,
								justifyContent: "center",
								textAlign: "center",
								color: "#256D85",
							}}
						>
							You are about to leave HKU GO {"\n"}
						</Text>
						<Text
							style={{
								fontSize: 18,
								justifyContent: "center",
								textAlign: "center",
								color: "#256D85",
							}}
						>
							Do you want to redirct to the HKU Info Day Website?
						</Text>
					</View>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							marginTop: 40,
						}}
					>
						<Button
							mode="contained"
							onPress={() => {
								Linking.openURL("https://www.infoday.hku.hk/");
								hideModal();
							}}
							style={{
								backgroundColor: "#00C851",
							}}
						>
							CONFIRM
						</Button>
						<Button
							mode="contained"
							onPress={hideModal}
							style={{
								backgroundColor: "#FF4444",
							}}
						>
							CANCEL
						</Button>
					</View>
				</Modal>
			</Portal>
			<ScrollView contentContainerStyle={styles.mainFrame}>
				<TouchableOpacity style={styles.promoteContainer} onPress={showModal}>
					<Image
						source={require("../../assets/promotion.jpg")}
						style={styles.promotionImage}
						resizeMode="cover"
					/>
				</TouchableOpacity>

				<ImageBackground
					source={require("../../assets/HKUBackground.jpg")}
					style={styles.infoContainer}
					imageStyle={styles.infoImage}
					resizeMode="cover"
				>
					<View style={styles.infoInsideContainer}>
						<View style={styles.logoContainter}>
							<Image
								source={require("../../assets/appLogo.png")}
								style={styles.appLogo}
								resizeMode="contain"
							/>
						</View>
						<View style={styles.appTextContainter}>
							<Text style={styles.infoText}>
								An Interactive Guide To Exploring the HKU Campus
							</Text>
						</View>
					</View>
				</ImageBackground>

				<TouchableOpacity
					activeOpacity={0.6}
					style={{
						width: "100%",
						marginTop: 20,
					}}
					onPress={() => {
						navigation.navigate("Login");
					}}
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

				<TouchableOpacity
					activeOpacity={0.6}
					style={{
						width: "100%",
						marginTop: 20,
					}}
					onPress={() => {
						navigation.navigate("Register");
					}}
				>
					<LinearGradient
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						colors={["#B6E388", "#7FB77E"]}
						style={styles.buttonContainer}
					>
						<Text style={styles.button}>REGISTER</Text>
					</LinearGradient>
				</TouchableOpacity>
				<Text
					style={{
						color: "grey",
						fontSize: 12,
						alignSelf: "center",
					}}
				>
					HKU GO Running on {Device.osName} {Device.osVersion}
				</Text>
			</ScrollView>
		</LinearGradient>
	);
};

export default InitialScreen;
