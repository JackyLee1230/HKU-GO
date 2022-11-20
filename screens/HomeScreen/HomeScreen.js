import {
	View,
	Text,
	Button,
	ScrollView,
	TouchableOpacity,
	ImageBackground,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth, db } from "../../firebase";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";
import { FAB, Portal } from 'react-native-paper'
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

const HomeScreen = ({ navigation }) => {
	const [points, setPoints] = useState();
	const [result, setResult] = useState("");
	const isFocused = useIsFocused();

	useLayoutEffect(() => {
		navigation.setOptions({
			userName: auth?.currentUser?.displayName ?? "Anonymous",
			userPoint: points,
			userAvatar: auth?.currentUser
			? auth?.currentUser?.userImg ||
			  "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
			: "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
		});
	});

	let getPoints = async () => {
		await AsyncStorage.getItem("notification").then((value) => {
			if (value === "enabled") {
				setResult("enabled");
			} else {
				setResult("disabled");
			}
		});
		const q = query(
			collection(db, "points"),
			where("uid", "==", auth?.currentUser?.uid)
		);
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			let temp = doc.data();
			setPoints(temp.points);
		});
	};

	useEffect(() => {
		const interval = setInterval(() => {
			getPoints();
		}, 120000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (auth && auth?.currentUser) {
			getPoints();
		}
	}, [navigation]);

	return (
		<LinearGradient
			colors={["#C3E8FD", "#EFF8FD"]}
			style={styles.linearGradient}
		>
			<Portal>
				<FAB
					icon="chat"
					visible={isFocused}
					label="Chat Room"
					color="#fff"
					style={{
						position: "absolute",
						alignSelf: 'center',
						marginBottom: 102,
						bottom: 0,
						backgroundColor: "#FF8787",
						fabText: {
							textAlign: "center",
						},
						container: {
							flexDirection: 'row',
						},
						action: {
							flex: 1,
						},
					}}
					onPress={() => {
						navigation.navigate("ChatRoomStack", {
							screen: "ChatRoom",
						});
					}}
				/>
			</Portal>

			<ScrollView contentContainerStyle={styles.mainFrame}>
				<Text style={styles.welcomeMessageTitle}>Welcome Back!</Text>
				<Text style={styles.welcomeMessage}>What are you looking for now?</Text>

				<TouchableOpacity
					style={styles.campusHuntContainer}
					onPress={() => {
						navigation.navigate("MapStack");
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
