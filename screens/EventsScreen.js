import {
	View,
	Text,
	FlatList,
	StyleSheet,
	Pressable,
	Image,
	TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { FAB, Searchbar, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { useDebounce } from "use-debounce";
import {
	collection,
	addDoc,
	query,
	where,
	getDocs,
	deleteDoc,
	updateDoc,
	doc,
	setDoc,
} from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

const EventsScreen = ({ navigation }) => {
	const [isLoading, setIsLoading] = useState(true);
	let [isRefreshing, setIsRefreshing] = React.useState(false);
	const [events, setEvents] = useState([]);
	const [registered, setRegistered] = useState([]);
	const [search, setSearch] = useState("");
	const [debouncedSearch] = useDebounce(search, 500);
	const [disabledButtons, setDisabledButtons] = useState([]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerBackTitle: "Back To Home Page",
		});
	}, [navigation]);

	let loadEvents = async () => {
		const q = query(collection(db, "infodayevents"));
		const querySnapshot = await getDocs(q);

		if (auth && auth?.currentUser && auth?.currentUser?.uid) {
			const q2 = query(
				collection(db, "registered"),
				where("uid", "==", auth?.currentUser?.uid)
			);
			const querySnapshot2 = await getDocs(q2);
			let result2 = [];
			querySnapshot2.forEach((doc) => {
				let temp = doc.data();
				temp.id = doc.id;
				result2.push(temp);
				setDisabledButtons((disabledButtons) => [...disabledButtons, false]);
			});
			setRegistered(result2[0].registered);
		}

		let result = [];
		querySnapshot.forEach((doc) => {
			let temp = doc.data();
			temp.id = doc.id;
			result.push(temp);
		});

		setEvents(result);
		setIsLoading(false);
		setIsRefreshing(false);
	};

	if (isLoading) {
		loadEvents();
	}

	const registerEvent = async (id, eventID, index, registered) => {
		if (!id) {
			return;
		}

		setDisabledButtons((disabledButtons) => {
			disabledButtons[index] = true;
			return disabledButtons;
		});

		if (!registered) {
			const q = query(
				collection(db, "infodayevents"),
				where("eventID", "==", eventID)
			);
			const querySnapshot = await getDocs(q);
			let result = [];
			querySnapshot.forEach((doc) => {
				let temp = doc.data();
				temp.id = doc.id;
				result.push(temp);
			});
			// get the document with attribute eventID == id
			const docRef = doc(db, "infodayevents", id);
			if (result[0].vacancy > 0) {
				await updateDoc(docRef, {
					vacancy: result[0].vacancy - 1,
				});
			}
		} else {
			const q = query(
				collection(db, "infodayevents"),
				where("eventID", "==", eventID)
			);
			const querySnapshot = await getDocs(q);
			let result = [];
			querySnapshot.forEach((doc) => {
				let temp = doc.data();
				temp.id = doc.id;
				result.push(temp);
			});
			// get the document with attribute eventID == id
			const docRef = doc(db, "infodayevents", id);
			if (result[0].vacancy > 0) {
				await updateDoc(docRef, {
					vacancy: result[0].vacancy + 1,
				});
			}
		}

		// then get document from registered where uid == auth.currentUser.uid
		// if user already registered, remove the registration
		// else add the registration
		const q2 = query(
			collection(db, "registered"),
			where("uid", "==", auth?.currentUser?.uid)
		);
		const querySnapshot2 = await getDocs(q2);
		let result2 = [];
		querySnapshot2.forEach((doc) => {
			let temp = doc.data();
			temp.id = doc.id;
			result2.push(temp);
		});
		if (result2[0].registered.includes(eventID)) {
			// remove the registration
			const docRef2 = doc(db, "registered", result2[0].id);
			await updateDoc(docRef2, {
				registered: result2[0].registered.filter((item) => item !== eventID),
			});
		} else {
			// add the registration
			const docRef2 = doc(db, "registered", result2[0].id);
			await updateDoc(docRef2, {
				registered: [...result2[0].registered, eventID],
			});
		}

		setDisabledButtons((disabledButtons) => {
			disabledButtons[index] = false;
			return disabledButtons;
		});
		loadEvents();
	};

	const onChangeSearch = (query) => setSearch(query);

	return (
		<LinearGradient colors={["#0098FF", "#DFF6FF"]} style={{ flex: 1 }}>
			<View style={{ flex: 1 }}>
				<Searchbar
					value={search}
					onChangeText={onChangeSearch}
					placeholder={"Search..."}
					style={{
						marginVertical: 24,
						borderRadius: 24,
						marginHorizontal: 32,
						borderColor: "#47B5FF",
						borderWidth: 2,
						backgroundColor: "#fff",
					}}
				/>

				<FlatList
					data={events}
					style={{ height: "100%" }}
					numColumns={1}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={({ item, index }) => (
						<>
							{item.name
								.toLowerCase()
								.includes(debouncedSearch.toLowerCase()) && (
								<>
									<View style={styles.container}>
										<View
											style={{
												borderTopLeftRadius: 8,
												borderBottomRightRadius: 8,
												borderTopRightRadius: 32,
												borderBottomLeftRadius: 32,
											}}
										>
											<View style={{ marginHorizontal: 12 }}>
												<Text
													style={{
														margin: 16,
														fontSize: 24,
														textAlign: "center",
													}}
												>
													{item.name} {String(disabledButtons[index])}
												</Text>
											</View>

											<View style={{ marginHorizontal: 12 }}>
												<Text
													style={{
														margin: 16,
														fontSize: 24,
														textAlign: "center",
													}}
												>
													Vacancy:{" "}
													{item.vacancy
														? item.vacancy
														: "Unlimited/Unspecified"}
												</Text>
											</View>

											<View style={styles.innerBox}>
												<Text
													style={{
														marginHorizontal: 12,
														marginVertical: 8,
														fontSize: 16,
													}}
												>
													{item.description.length > 150
														? item.description.substring(0, 150) + "..."
														: item.description}
												</Text>
											</View>

											<View>
												{auth && auth?.currentUser && auth.currentUser?.uid ? (
													<>
														{registered.includes(item.eventID) ? (
															<Button
																mode="contained-tonal"
																style={{
																	backgroundColor: "red",
																	justifyContent: "center",
																}}
																disabled={disabledButtons[index]}
																onPress={() => {
																	registerEvent(
																		item.id,
																		item.eventID,
																		index,
																		true
																	);
																}}
															>
																<Text
																	style={{
																		color: "white",
																	}}
																>
																	Already Registered
																</Text>
															</Button>
														) : (
															<Button
																mode="contained-tonal"
																style={{
																	backgroundColor: "red",
																	justifyContent: "center",
																}}
																disabled={disabledButtons[index]}
																onPress={() => {
																	registerEvent(
																		item.id,
																		item.eventID,
																		index,
																		false
																	);
																}}
															>
																<Text
																	style={{
																		color: "white",
																	}}
																>
																	Register
																</Text>
															</Button>
														)}
													</>
												) : (
													<Text>Login To Register For Events</Text>
												)}
											</View>
										</View>
									</View>
								</>
							)}
						</>
					)}
				/>
			</View>
		</LinearGradient>
	);
};

export default EventsScreen;

const styles = StyleSheet.create({
	container: {
		margin: 5,
		marginHorizontal: 32,
		padding: 15,
		backgroundColor: "#fff",
		borderTopLeftRadius: 16,
		borderBottomRightRadius: 16,
		borderTopRightRadius: 4,
		borderBottomLeftRadius: 4,
	},
	innerBox: {
		borderTopLeftRadius: 16,
		borderBottomRightRadius: 16,
		borderTopRightRadius: 4,
		borderBottomLeftRadius: 4,
		// backgroundColor: "red",
		marginHorizontal: 12,
		marginBottom: 16,
		borderColor: "#256D85",
		borderWidth: 1,
	},
});
