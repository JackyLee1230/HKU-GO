import {
	View,
	Text,
	Button,
	ScrollView,
	TouchableOpacity,
	ImageBackground,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";

const HomeScreen = ({ navigation }) => {
	var user = auth?.currentUser;

	return (
		<LinearGradient
			colors={["#C3E8FD", "#EFF8FD"]}
			style={styles.linearGradient}
		>
			<ScrollView contentContainerStyle={styles.mainFrame}>
				<Text style={styles.welcomeMessageTitle}>Welcome Back!</Text>
				<Text style={styles.welcomeMessage}>What are you looking for now?</Text>

				<TouchableOpacity
					style={styles.campusHuntContainer}
					onPress={() => {
						navigation.navigate("Map");
					}}
				>
					<ImageBackground
						source={require("../../assets/HKUBackground.jpg")}
						resizeMode="cover"
						style={styles.campusHuntButtonContainer}
						imageStyle={styles.campusHuntButtonImage}
					>
						<Text style={styles.campusHunt}>Campus Hunt</Text>
						<Icon name={"menu-right-outline"} color={"#FFFFFF"} size={32} />
					</ImageBackground>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.socContainer}
					onPress={() => {
						navigation.navigate("SocStack", { screen: "Soc"});
					}}
				>
					<ImageBackground
						source={require("../../assets/socIcon.jpg")}
						resizeMode="cover"
						style={styles.socButtonContainer}
						imageStyle={styles.socButtonImage}
					>
						<Text style={styles.soc}>HKU Societies</Text>
						<Icon name={"menu-right-outline"} color={"#FFFFFF"} size={32} />
					</ImageBackground>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.eventContainer}
					onPress={() => {
						navigation.navigate(
							"EventsStack", 
							{ screen: "Events",     
								params: {
									type: "All" ,
								}
							}
						);
					}}
				>
					<ImageBackground
						source={require("../../assets/eventRegister.jpg")}
						resizeMode="cover"
						style={styles.eventButtonContainer}
						imageStyle={styles.eventButtonImage}
					>
						<Text style={styles.event}>Event Registrations</Text>
						<Icon name={"menu-right-outline"} color={"#FFFFFF"} size={32} />
					</ImageBackground>
				</TouchableOpacity>
			</ScrollView>
		</LinearGradient>
	);
};

export default HomeScreen;
