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
import { FAB, Searchbar, Button, Portal } from "react-native-paper";
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
import moment from "moment";

const EventsScreen = ({ navigation, route }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [events, setEvents] = useState([]);
	const [registered, setRegistered] = useState([]);
	// debounce the search to prevent constant rerendering
	const [search, setSearch] = useState("");
	const [debouncedSearch] = useDebounce(search, 500);
	const [disabledButtons, setDisabledButtons] = useState([]);
	const [open, setOpen] = useState(false);
	const [filter, setFilter] = useState("All");

	const { type } = route.params;
	useEffect(() => {
		if (type === "Registered") {
			setFilter("Registered");
		}
	}, []);

	const onStateChange = ({ open }) => setOpen((open) => !open);

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

			const q3 = query(
				collection(db, "points"),
				where("uid", "==", auth?.currentUser?.uid)
			);
			const querySnapshot3 = await getDocs(q3);
			let result3 = [];
			querySnapshot3.forEach((doc) => {
				let temp = doc.data();
				temp.id = doc.id;
				result3.push(temp);
			});
			if (result3.length > 0) {
				if (!result3[0].events.includes(eventID)) {
					const docRef3 = doc(db, "points", result3[0].id);
					await updateDoc(docRef3, {
						events: [...result3[0].events, eventID],
						points: result3[0].points + 10,
					});
				}
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
			// if points table with uid == auth.currentUser.uid exists,and eventID in events array, remove from events array and remove 1 point to user
			const q3 = query(
				collection(db, "points"),
				where("uid", "==", auth?.currentUser?.uid)
			);
			const querySnapshot3 = await getDocs(q3);
			let result3 = [];
			querySnapshot3.forEach((doc) => {
				let temp = doc.data();
				temp.id = doc.id;
				result3.push(temp);
			});
			if (result3.length > 0) {
				if (result3[0].events.includes(eventID)) {
					const docRef3 = doc(db, "points", result3[0].id);
					await updateDoc(docRef3, {
						events: result3[0].events.filter((item) => item !== eventID),
						points: result3[0].points - 10,
					});
				}
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
				<Portal>
					<FAB.Group
						open={open}
						visible
						backdropColor="rgba(70, 132, 180, 0.46)"
						icon={open ? "filter" : "filter-variant"}
						actions={[
							{
								icon: "account-check",
								label: "Registered",
								onPress: () => setFilter("Registered"),
							},
							{
								icon: "account-cancel",
								label: "Not Registered",
								onPress: () => setFilter("NotRegistered"),
							},
							{
								icon: "file-table",
								label: "All",
								onPress: () => setFilter("All"),
								labelStyle: {
									fontSize: 24,
									color: "red",
									backgroundColor: "#fff",
								},
							},
						]}
						onStateChange={onStateChange}
						onPress={() => {
							if (open) {
								// do something if the speed dial is open
							}
						}}
					/>
				</Portal>

				<FlatList
					data={events}
					style={{ height: "100%" }}
					numColumns={1}
					keyExtractor={(item, index) => item.id.toString()}
					renderItem={({ item, index }) => (
						<>
							{filter === "All" ? (
								<View>
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
															{item.name}
														</Text>
													</View>

													<View>
														<Text
															style={{
																fontSize: 14,
																fontWeight: "bold",
															}}
														>
															{moment(item.date, "DD-MM-YYYY").format(
																"DD/MM/YYYY"
															)}{" "}
															{item.time}
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
														{auth &&
														auth?.currentUser &&
														auth.currentUser?.uid ? (
															<>
																{registered.includes(item.eventID) ? (
																	<Button
																		mode="contained-tonal"
																		style={{
																			backgroundColor: "green",
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
																			Already Registered! Unregister?
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
								</View>
							) : (
								<>
									{filter === "Registered" ? (
										<>
											{registered.includes(item.eventID) ? (
												<View>
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
																			{item.name}
																		</Text>
																	</View>

																	<View>
																		<Text
																			style={{
																				fontSize: 14,
																				fontWeight: "bold",
																			}}
																		>
																			{item.date} {item.time}
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
																				? item.description.substring(0, 150) +
																				  "..."
																				: item.description}
																		</Text>
																	</View>

																	<View>
																		{auth &&
																		auth?.currentUser &&
																		auth.currentUser?.uid ? (
																			<>
																				{registered.includes(item.eventID) ? (
																					<Button
																						mode="contained-tonal"
																						style={{
																							backgroundColor: "green",
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
																							Already Registered! Unregister?
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
												</View>
											) : (
												<></>
											)}
										</>
									) : (
										<>
											{!registered.includes(item.eventID) ? (
												<View>
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
																			{item.name}
																		</Text>
																	</View>

																	<View>
																		<Text
																			style={{
																				fontSize: 14,
																				fontWeight: "bold",
																			}}
																		>
																			{item.date} {item.time}
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
																				? item.description.substring(0, 150) +
																				  "..."
																				: item.description}
																		</Text>
																	</View>

																	<View>
																		{auth &&
																		auth?.currentUser &&
																		auth.currentUser?.uid ? (
																			<>
																				{registered.includes(item.eventID) ? (
																					<Button
																						mode="contained-tonal"
																						style={{
																							backgroundColor: "green",
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
												</View>
											) : (
												<></>
											)}
										</>
									)}
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
	fab: {
		position: "absolute",
		margin: 16,
		right: 5,
		bottom: "3%",
	},
});
