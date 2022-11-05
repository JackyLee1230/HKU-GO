import React from "react";
import {
	ScrollView,
	View,
	Text,
	Image,
	ImageBackground,
	TouchableOpacity,
	Linking,
	Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";
import { Modal } from "react-native-paper";

const InitialScreen = ({ navigation }) => {
	const handleClick = () => {
		Linking.canOpenURL("https://www.infoday.hku.hk/").then((supported) => {
			if (supported) {
				Linking.openURL("https://www.infoday.hku.hk/");
			} else {
				console.log("Can not open URI: " + "https://www.infoday.hku.hk/");
			}
		});
	};

	const showModal = () => {
		this.setState({ visible: true });
	};

	const hideModal = () => {
		this.setState({ visible: false });
	};

	return (
		<LinearGradient
			colors={["#0098FF", "#DFF6FF"]}
			style={styles.linearGradient}
		>
			<ScrollView contentContainerStyle={styles.mainFrame}>
				<TouchableOpacity style={styles.promoteContainer} onPress={handleClick}>
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
			</ScrollView>
		</LinearGradient>
	);
};

export default InitialScreen;
