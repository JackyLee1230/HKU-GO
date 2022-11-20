import {
	View,
	Text,
	FlatList,
	StyleSheet,
	Pressable,
	Image,
	TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
	FAB,
	Searchbar,
	Button,
	Portal,
	ActivityIndicator,
} from "react-native-paper";
import { useIsFocused, useNavigation } from "@react-navigation/native";
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
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const EventsScreen = ({ navigation, route }) => {
	const scrollRef = useRef();
	const [isLoading, setIsLoading] = useState(true);
	const [events, setEvents] = useState([]);
	const [registered, setRegistered] = useState([]);
	// debounce the search to prevent constant rerendering
	const [search, setSearch] = useState("");
	const [debouncedSearch] = useDebounce(search, 500);
	const [disabledButtons, setDisabledButtons] = useState([]);
	const [open, setOpen] = useState(false);
	const [filter, setFilter] = useState("All");
	const isFocused = useIsFocused();
	const [loadingIndication, setLoadingIndication] = useState(false);
	const [onTop, setOnTop] = useState(true);

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

	useEffect(() => {
		setOpen(false);
	}, [isFocused]);

	const registerEvent = async (id, eventID, index, registered) => {
		setLoadingIndication(true);

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

		setLoadingIndication(false);
	};

	const handleScroll = (event) => {
		if (event.nativeEvent.contentOffset.y != 0) {
			setOnTop(false);
		} else {
			setOnTop(true);
		}
	};

	const onChangeSearch = (query) => setSearch(query);

	return (
		<LinearGradient colors={["#C3E8FD", "#EFF8FD"]} style={{ flex: 1 }}>
			<Portal>
				{!onTop ? (
					<FAB
						visible={isFocused}
						icon={"arrow-up-drop-circle-outline"}
						style={{
							position: "absolute",
							margin: 16,
							right: 0,
							bottom: "18%",
						}}
						onPress={() => {
							scrollRef.current?.scrollToOffset({
								y: 0,
								animated: true,
							});
						}}
					/>
				) : null}

				<FAB.Group
					visible={isFocused}
					open={open}
					backdropColor="rgba(70, 132, 180, 0.65)"
					color="#fff"
					icon={open ? "filter" : "filter-variant"}
					actions={[
						{
							icon: "account-check",
							label: "Registered",
							onPress: () => setFilter("Registered"),
							labelStyle: {
								fontSize: 20,
								fontWeight: "500",
								color: "#fff",
							},
							style: {
								backgroundColor: "#FF8787",
							},
							color: "#fff",
						},
						{
							icon: "account-cancel",
							label: "Not Registered",
							onPress: () => setFilter("NotRegistered"),
							labelStyle: {
								fontSize: 20,
								fontWeight: "500",
								color: "#fff",
							},
							style: {
								backgroundColor: "#FF8787",
							},
							color: "#fff",
						},
						{
							icon: "file-table",
							label: "All",
							onPress: () => setFilter("All"),
							labelStyle: {
								fontSize: 20,
								fontWeight: "500",
								color: "#fff",
							},
							style: {
								backgroundColor: "#FF8787",
							},
							color: "#fff",
						},
					]}
					onStateChange={onStateChange}
					onPress={() => {
						if (open) {
							// do something if the speed dial is open
						}
					}}
					style={{
						marginBottom: 82,
						fabText: {
							textAlign: "center",
						},
						container: {
							flexDirection: "row",
						},
						action: {
							flex: 1,
						},
					}}
					fabStyle={{
						backgroundColor: "#FF8787",
					}}
				/>
			</Portal>

			{loadingIndication && (
				<View
					style={{
						position: "absolute",
						zIndex: 1,
						left: 0,
						right: 0,
						top: 0,
						bottom: 0,
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#F5FCFF88",
					}}
				>
					<ActivityIndicator color={"#47B5FF"} size={"large"} />
				</View>
			)}

			<View style={{ flex: 1 }}>
				<Searchbar
					value={search}
					onChangeText={onChangeSearch}
					iconColor="#256D85"
					placeholder={"Search..."}
					style={{
						marginVertical: 24,
						borderRadius: 48,
						marginHorizontal: 32,
						borderColor: "#47B5FF",
						borderWidth: 2,
						backgroundColor: "#EFF5FF",
					}}
					placeholderTextColor={"#g5g5g5"}
					inputStyle={{
						color: "#06283D",
					}}
				/>

				<FlatList
					ref={scrollRef}
					data={events}
					style={{ height: "100%" }}
					onScroll={handleScroll}
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
																fontSize: 24,
																textAlign: "center",
																fontWeight: "600",
																color: "#111111",
																marginBottom: 8,
															}}
														>
															{item.name}
														</Text>
													</View>

													<View>
														<Text
															style={{
																textAlign: "left",
																fontSize: 14,
																fontWeight: "500",
																color: "#47B5FF",
																marginBottom: 8,
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
																fontSize: 22,
																textAlign: "center",
																fontWeight: "500",
																color: "#47B5FF",
																marginBottom: 8,
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
																fontWeight: "400",
																color: "#256D85",
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
																			alignSelf: "center",
																			backgroundColor: "#00C851",
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
																				fontSize: 14,
																				textTransform: "uppercase",
																			}}
																		>
																			Unregister
																		</Text>
																	</Button>
																) : (
																	<Button
																		mode="contained-tonal"
																		style={{
																			alignSelf: "center",
																			backgroundColor: "#FF4444",
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
																				fontSize: 14,
																				color: "white",
																				textTransform: "uppercase",
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
																				fontSize: 24,
																				textAlign: "center",
																				fontWeight: "600",
																				color: "#111111",
																				marginBottom: 8,
																			}}
																		>
																			{item.name}
																		</Text>
																	</View>

																	<View>
																		<Text
																			style={{
																				textAlign: "left",
																				fontSize: 14,
																				fontWeight: "500",
																				color: "#47B5FF",
																				marginBottom: 8,
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
																				fontSize: 22,
																				textAlign: "center",
																				fontWeight: "500",
																				color: "#47B5FF",
																				marginBottom: 8,
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
																				fontWeight: "400",
																				color: "#256D85",
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
																							alignSelf: "center",
																							backgroundColor: "#00C851",
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
																								fontSize: 14,
																								textTransform: "uppercase",
																							}}
																						>
																							Unregister
																						</Text>
																					</Button>
																				) : (
																					<Button
																						mode="contained-tonal"
																						style={{
																							alignSelf: "center",
																							backgroundColor: "#FF4444",
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
																								fontSize: 14,
																								color: "white",
																								textTransform: "uppercase",
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
																				fontSize: 24,
																				textAlign: "center",
																				fontWeight: "600",
																				color: "#111111",
																				marginBottom: 8,
																			}}
																		>
																			{item.name}
																		</Text>
																	</View>

																	<View>
																		<Text
																			style={{
																				textAlign: "left",
																				fontSize: 14,
																				fontWeight: "500",
																				color: "#47B5FF",
																				marginBottom: 8,
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
																				fontSize: 22,
																				textAlign: "center",
																				fontWeight: "500",
																				color: "#47B5FF",
																				marginBottom: 8,
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
																				fontWeight: "400",
																				color: "#256D85",
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
																							alignSelf: "center",
																							backgroundColor: "#00C851",
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
																								fontSize: 14,
																								textTransform: "uppercase",
																							}}
																						>
																							Unregister
																						</Text>
																					</Button>
																				) : (
																					<Button
																						mode="contained-tonal"
																						style={{
																							alignSelf: "center",
																							backgroundColor: "#FF4444",
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
																								fontSize: 14,
																								color: "white",
																								textTransform: "uppercase",
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
		marginBottom: 12,
		marginHorizontal: 32,
		padding: 16,
		backgroundColor: "#fff",
		borderTopLeftRadius: 16,
		borderBottomRightRadius: 16,
		borderTopRightRadius: 4,
		borderBottomLeftRadius: 4,
		borderColor: "#06283D",
		borderWidth: 1.5,
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
