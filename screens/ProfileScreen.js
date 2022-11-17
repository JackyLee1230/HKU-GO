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
import { Modal, Portal, RadioButton, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ navigation }) => {
	const [points, setPoints] = useState();
	const [events, setEvents] = useState();
	const [notification, setNotification] = React.useState("enabled");
	const [refreshing, setRefreshing] = React.useState(false);
	const [newUserName, setNewUserName] = useState("");
	const [visible, setVisible] = useState(false);
	const [hideUID, setHideUID] = useState(true);
	const [result, setResult] = useState("");

	const showModal = () => {
		setVisible(true);
	};

	const hideModal = () => {
		setVisible(false);
	};

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

	// call getPoints everytime every 30 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			getPoints();
			getRegisteredEvents();
		}, 30000);
		return () => clearInterval(interval);
	}, []);

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

	const updateUserName = async () => {
		if (newUserName.length > 0) {
			// update the user name using updateProfile
			await updateProfile(auth.currentUser, {
				displayName: newUserName,
			})
				.then(() => {
					setRefreshing(true);
					getPoints();
					getRegisteredEvents();
					setRefreshing(false);
					setNewUserName("");
					hideModal();
				})
				.catch((error) => {
					hideModal();
				});
		}
	};

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
				<Portal>
					<Modal
						visible={visible}
						onDismiss={hideModal}
						contentContainerStyle={{
							backgroundColor: "white",
							padding: 20,
							paddingVertical: 40,
							marginHorizontal: 64,
							borderRadius: 8,
							elevation: 10,
							shadowColor: "#171717",
						}}
					>
						<TextInput
							label="New User Name"
							value={newUserName}
							onChangeText={(text) => setNewUserName(text)}
							style={{ width: "100%" }}
						></TextInput>
						<Button title="Update Username" onPress={updateUserName}></Button>
					</Modal>
				</Portal>
				<Image
					style={styles.userImg}
					source={{
						uri: auth?.currentUser
							? auth?.currentUser?.userImg ||
							  "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
							: "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
					}}
				/>
				{!hideUID ? (
					<View style={{ flex: 1, flexDirection: "column" }}>
						<Text style={styles.aboutUser}>
							{auth?.currentUser
								? auth?.currentUser?.uid || "Unknown UID."
								: ""}
						</Text>
						<Button
							title="Hide UID"
							onPress={() => setHideUID((prev) => !prev)}
						></Button>
					</View>
				) : (
					<View style={{ flex: 1, flexDirection: "column" }}>
						<Button
							title="Show UID"
							onPress={() => setHideUID((prev) => !prev)}
						></Button>
					</View>
				)}

				<Text style={styles.userName}>
					{auth?.currentUser
						? auth?.currentUser?.displayName || "Anonymous"
						: "Anonymous"}
				</Text>

				<Button onPress={showModal} title="Change User Name" />

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
						Email: {auth?.currentUser?.email ?? 0}
					</Text>
					<Text style={{ color: "#256D85", fontSize: 16 }}>
						GO Points: {points ?? 0}
					</Text>
					<Text style={{ color: "#256D85", fontSize: 16 }}>
						Registered Events:{" "}
						{events && events.length !== 0 ? events.length : 0}
					</Text>
					<Text style={{ color: "#256D85", fontSize: 10 }}>
						* GO Points and Register Events Count are updated every 30 seconds,
					</Text>
				</View>

				{events && events.length !== 0 ? (
					<Button
						title="REGISTERED EVENTS"
						onPress={() => {
							navigation.navigate("EventsStack", {
								screen: "Events",
								params: {
									type: "Registered",
								},
							});
						}}
					/>
				) : null}

				<Button
					title="CHAT ROOM"
					onPress={() => {
						navigation.navigate("SocStack", {
							screen: "ChatRoom",
						});
					}}
				/>

				{auth && auth?.currentUser ? (
					<View
						style={{
							backgroundColor: "lightblue",
						}}
					>
						<RadioButton.Group
							onValueChange={async (newValue) => {
								setNotification(newValue);
								try {
									await AsyncStorage.setItem("notification", newValue);
								} catch (err) {
									console.log(err);
								}
							}}
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
		marginBottom: "3%",
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
