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
import { LinearGradient } from "expo-linear-gradient";

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

	// call getPoints everytime every 2 minutes
	useEffect(() => {
		const interval = setInterval(() => {
			getPoints();
			getRegisteredEvents();
		}, 120000);
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
		<LinearGradient
			colors={["#C3E8FD", "#EFF8FD"]}
			style={{flex: 1}}
		>
			<ScrollView
				contentContainerStyle={{
					flexDirection: "column",
					padding: 32,
					marginTop: "5%",
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
							padding: 32,
							paddingVertical: 24,
							marginHorizontal: 32,
							borderRadius: 8,
							elevation: 10,
							shadowColor: "#171717",
						}}
					>
						<TextInput
							label="New User Name"
							autoFocus
							value={newUserName}
							onChangeText={(text) => setNewUserName(text)}
							underlineColor="#F7A76C"
							activeUnderlineColor="#FF8787"
							style={{
								backgroundColor: "#FFFFFF",
								marginBottom: 24,
							}}
						/>
						
						<TouchableOpacity
							activeOpacity={0.6}
							style={{
								width: "100%",
							}}
							onPress={updateUserName}
						>
							<LinearGradient
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								colors={["#F8C4B4", "#FF8787"]}
								style={{
									alignItems: "center",
								}}
							>
								<Text 
									style={{
										fontSize: 20,
										fontWeight: "700",
										textAlign: "center",
										paddingVertical: 8,
										paddingHorizontal: 16,
										color: "#FFFFFF",
										textTransform: "uppercase",
									}}
								>
									Update Username
								</Text>
							</LinearGradient>
						</TouchableOpacity>
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
						<TouchableOpacity
							onPress={() => setHideUID((prev) => !prev)}
							style={{
								alignSelf: 'center', 
								borderRadius: 24,
								shadowOffset: { width: 0, height: 1 },
								shadowOpacity: 0.5,
								shadowRadius: 1,
								elevation: 1,
								shadowColor: "#171717",
								marginBottom: 16,
							}}
						>
							<View
								style={{
									backgroundColor: "#47B5FF",
									borderRadius: 24,
									paddingHorizontal: 12,
									paddingVertical: 8,
								}}
							>
								<Text
									style={{
										fontSize: 14,
										fontWeight: "500",
										color: "#fff",
									}}
								>
									Hide UID
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				) : (
					<View style={{ flex: 1, flexDirection: "column" }}>
						<TouchableOpacity
							onPress={() => setHideUID((prev) => !prev)}
							style={{
								alignSelf: 'center', 
								borderRadius: 24,
								shadowOffset: { width: 0, height: 1 },
								shadowOpacity: 0.5,
								shadowRadius: 1,
								elevation: 1,
								shadowColor: "#171717",
								marginBottom: 16,
							}}
						>
							<View
								style={{
									backgroundColor: "#47B5FF",
									borderRadius: 24,
									paddingHorizontal: 12,
									paddingVertical: 8,
								}}
							>
								<Text
									style={{
										fontSize: 14,
										fontWeight: "500",
										color: "#fff",
									}}
								>
									Show UID
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				)}

				<Text style={styles.userName}>
					{auth?.currentUser
						? auth?.currentUser?.displayName || "Anonymous"
						: "Anonymous"}
				</Text>

				<View
					style={{
						marginBottom: 24,
					}}
				>
					<Button color= '#FF8787' onPress={showModal} title="Change User Name" />
				</View>

				<View
					style={{
						paddingHorizontal: 12,
						alignSelf: "center",
						flex: 1,
						alignItems: "center",
						marginBottom: 24,
					}}
				>
					<Text style={{ color: "#256D85", fontSize: 16, marginBottom: 4}}>
						Email: {auth?.currentUser?.email ?? 0}
					</Text>
					<Text style={{ color: "#256D85", fontSize: 16, marginBottom: 4 }}>
						GO Points: {points ?? 0}
					</Text>
					<Text style={{ color: "#256D85", fontSize: 16, marginBottom: 2 }}>
						Registered Events:{" "}
						{events && events.length !== 0 ? events.length : 0}
					</Text>
					<Text style={{ color: "#66AAC0", fontSize: 12 }}>
						* GO Points and Register Events Count are updated every 2 minutes,
					</Text>
				</View>

				{events && events.length !== 0 ? (
					<View
						style={{
							marginBottom: 24,
						}}
					>
						<Button
							color= '#7FB77E'
							title="VIEW REGISTERED EVENTS"
							onPress={() => {
								navigation.navigate("EventsStack", {
									screen: "Events",
									params: {
										type: "Registered",
									},
								});
							}}
						/>
					</View>
				) : null}

				{auth && auth?.currentUser ? (
					<View
						style={{
							width: "100%",
							marginBottom: 24,
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
							<Text 
								style={{
									fontSize: 22,
									fontWeight: "700",
									lineHeight: 33,
									marginBottom: 8,
								}}
							>
								Device Notifications
							</Text>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									marginBottom: 8,
								}}
							>
								<RadioButton color="#47B5FF" value="enabled" />
								<Text>Enable Notifications</Text>
							</View>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<RadioButton color="#47B5FF" value="disabled" />
								<Text>Disable Notifications</Text>
							</View>
						</RadioButton.Group>
					</View>
				) : null}

				{auth?.currentUser && auth?.currentUser?.uid ? (
					<TouchableOpacity
						activeOpacity={0.6}
						style={{
							width: "100%",
							marginBottom: 24,
						}}
						onPress={() => {
							signOutUser();
						}}
					>
						<LinearGradient
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							colors={["#28A9FF", "#BBDBF3"]}
							style={{
								width: "100%",
								paddingVertical: 12,
								borderRadius: 8,
								elevation: 1,
								shadowColor: '#171717',
							}}
						>
							<Text 
								style={{
									width: "100%",
									fontWeight: "500",
									fontSize: 18,
									textAlign: "center",
									color: '#fff',
								}}
							>
								SIGN OUT
							</Text>
						</LinearGradient>
					</TouchableOpacity>
				) : null}
				{!auth?.currentUser && !auth?.currentUser?.uid ? (
					<TouchableOpacity
						activeOpacity={0.6}
						style={{
							width: "100%",
							marginBottom: 24,
						}}
						onPress={() => {
							navigation.reset({
								index: 0,
								routes: [{ name: "Login" }],
							})
						}}
					>
						<LinearGradient
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
							colors={["#28A9FF", "#BBDBF3"]}
							style={{
								width: "100%",
								paddingVertical: 12,
								borderRadius: 8,
								elevation: 1,
								shadowColor: '#171717',
							}}
						>
							<Text 
								style={{
									width: "100%",
									fontWeight: "500",
									fontSize: 18,
									textAlign: "center",
									color: '#fff',
								}}
							>
								SIGN IN
							</Text>
						</LinearGradient>
					</TouchableOpacity>
				) : null}
			</ScrollView>
		</LinearGradient>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	userImg: {
		height: 180,
		width: 180,
		borderRadius: 90,
		marginBottom: 16,
		overflow: "hidden",
		borderWidth: 2,
		borderColor: "#06283D"
	},
	userName: {
		fontSize: 24,
		fontWeight: "500",
		marginBottom: 16,
		color: "#06283D",
	},
	aboutUser: {
		fontSize: 12,
		fontWeight: "600",
		color: "#666",
		textAlign: "center",
		marginBottom: 8,
	},
});
