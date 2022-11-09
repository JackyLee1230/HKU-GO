import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Button,
	StyleSheet,
	ScrollView,
	RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
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

const ProfileScreen = ({ navigation }) => {
	const [points, setPoints] = useState();
	const [events, setEvents] = useState();
	const [notification, setNotification] = React.useState("enabled");
	const [refreshing, setRefreshing] = React.useState(false);

	let getPoints = async () => {
		console.log("UID is " + auth?.currentUser?.uid);
		const q = query(
			collection(db, "points"),
			where("uid", "==", auth?.currentUser?.uid)
		);
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			let temp = doc.data();
			console.log(temp);
			setPoints(temp.points);
		});
	};

	let getRegisteredEvents = async () => {
		const q = query(
			collection(db, "registered"),
			where("uid", "==", auth?.currentUser?.uid)
		);
		const querySnapshot2 = await getDocs(q);
		let result2 = [];
		querySnapshot2.forEach((doc) => {
			let temp = doc.data();
			temp.id = doc.id;
			result2.push(temp);
		});
		setEvents(result2[0].registered);
	};

	const wait = (timeout) => {
		return new Promise((resolve) => setTimeout(resolve, timeout));
	};

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		getPoints();
		getRegisteredEvents();
		wait(2000).then(() => setRefreshing(false));
	}, []);

	useEffect(() => {
		if (auth && auth?.currentUser) {
			getPoints();
			getRegisteredEvents();
		}
	}, [navigation]);

	const signOutUser = async () => {
		await signOut(auth);
		navigation.navigate("WithoutTab", { screen: "Initial" });
	};

	// console.log(auth?.currentUser);
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<ScrollView
				style={styles.container}
				contentContainerStyle={{
					justifyContent: "center",
					alignItems: "center",
				}}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				showsVerticalScrollIndicator={false}
			>
				<Image
					style={styles.userImg}
					source={{
						uri: auth?.currentUser
							? auth?.currentUser?.userImg ||
							  "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
							: "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
					}}
				/>

				<Text style={styles.aboutUser}>
					{auth?.currentUser ? auth?.currentUser?.uid || "Unknown UID." : ""}
				</Text>
				<Text style={styles.userName}>
					{auth?.currentUser
						? auth?.currentUser?.displayName || "Anonymous"
						: "Anonymous"}
				</Text>
				<View
					style={{
						padding: 12,
						gap: 12,
						alignItems: "flex-start",
						flex: 1,
						alignItems: "center",
					}}
				>
					<Text style={{ color: "#256D85", fontSize: 16 }}>
						GO Points: {points ?? 0}
					</Text>
					<Text style={{ color: "#256D85", fontSize: 16 }}>
						Email: {auth?.currentUser?.email ?? 0}
					</Text>
					<Text style={{ color: "#256D85", fontSize: 16 }}>
						Registered Events:{" "}
						{events && events.length !== 0 ? events.length : 0}
					</Text>
				</View>

				{auth && auth?.currentUser ? (
					<View
						style={{
							backgroundColor: "lightblue",
						}}
					>
						<RadioButton.Group
							onValueChange={(newValue) => setNotification(newValue)}
							value={notification}
						>
							<Text style={{ marginLeft: "5%" }}>Device Notifications</Text>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<RadioButton value="enabled" />
								<Text>Enable Notifications</Text>
							</View>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<RadioButton value="disabled" />
								<Text>Disable Notifications</Text>
							</View>
						</RadioButton.Group>
					</View>
				) : null}

				{auth?.currentUser && auth?.currentUser?.uid ? (
					<Button title="signout" onPress={() => signOutUser()}></Button>
				) : null}
				{!auth?.currentUser && !auth?.currentUser?.uid ? (
					<Button
						title="Sign In"
						onPress={() =>
							navigation.reset({
								index: 0,
								routes: [{ name: "Login" }],
							})
						}
					></Button>
				) : null}
			</ScrollView>
		</SafeAreaView>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 20,
	},
	userImg: {
		height: 150,
		width: 150,
		borderRadius: 75,
	},
	userName: {
		fontSize: 26,
		marginTop: 10,
		marginBottom: 10,
	},
	aboutUser: {
		fontSize: 12,
		fontWeight: "600",
		color: "#666",
		textAlign: "center",
		marginBottom: 10,
	},
});
