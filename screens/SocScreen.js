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
import { FAB, Searchbar, ActivityIndicator, Portal } from "react-native-paper";
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
	doc,
	setDoc,
} from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

const SocScreen = ({ navigation }) => {
	const scrollRef = useRef();
	const isFocused = useIsFocused();
	const [isLoading, setIsLoading] = useState(true);
	let [isRefreshing, setIsRefreshing] = React.useState(false);
	const [socs, setSocs] = useState([]);
	const [search, setSearch] = useState("");
	const [debouncedSearch] = useDebounce(search, 500);
	const [onTop, setOnTop] = useState(true);
	const [debouncedOnTop] = useDebounce(onTop, 200);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerBackTitle: "Back To Home Page",
		});
	}, [navigation]);

	let loadSocs = async () => {
		const q = query(collection(db, "society"));
		const querySnapshot = await getDocs(q);

		let result = [];
		querySnapshot.forEach((doc) => {
			let temp = doc.data();
			temp.id = doc.id;
			result.push(temp);
		});

		setSocs(result);
		setIsLoading(false);
		setIsRefreshing(false);
	};

	if (isLoading) {
		loadSocs();
	}

	const onChangeSearch = (query) => setSearch(query);

	const handleScroll = (event) => {
		if (event.nativeEvent.contentOffset.y != 0) {
			setOnTop(false);
		} else {
			setOnTop(true);
		}
	};

	return (
		<>
			{!onTop ? (
				<Portal>
					<FAB
						visible={isFocused}
						icon={"arrow-up-drop-circle-outline"}
						color="#fff"
						style={{
							position: "absolute",
							margin: 16,
							right: 5,
							bottom: "10%",
							backgroundColor: "#7FB77E",
						}}
						onPress={() => {
							scrollRef.current?.scrollToOffset({
								y: 0,
								animated: true,
							});
						}}
					/>
				</Portal>
			) : null}
			{isLoading && <ActivityIndicator color={"#47B5FF"} size={"large"} />}
			{!isLoading && (
				<LinearGradient colors={["#C3E8FD", "#EFF8FD"]} style={{ flex: 1 }}>
					<View style={{ flex: 1 }}>
						{debouncedOnTop ? (
							<LinearGradient
								colors={["#EF9F9F", "#F8C4B4"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								style={{
									backgroundColor: "pink",
									marginTop: 12,
									marginHorizontal: 32,
									borderTopLeftRadius: 8,
									borderBottomRightRadius: 8,
									borderTopRightRadius: 32,
									borderBottomLeftRadius: 32,
									padding: 16,
								}}
							>
								<Text
									style={{
										fontSize: 20,
										fontWeight: "600",
										lineHeight: 30,
										textAlign: "center",
										color: "#06283D",
									}}
								>
									Find out more about the Societies and Faculties @HKU
								</Text>
							</LinearGradient>
						) : null}

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
							data={socs}
							style={{ height: "100%" }}
							numColumns={1}
							onScroll={handleScroll}
							keyExtractor={(item, index) => item.id.toString()}
							renderItem={({ item }) => (
								<>
									{item.name
										.toLowerCase()
										.includes(debouncedSearch.toLowerCase()) && (
										<>
											<TouchableOpacity
												style={styles.container}
												onPress={() =>
													navigation.navigate("SocDetail", {
														id: item.id,
														name: item.name,
													})
												}
											>
												<View
													style={{
														borderTopLeftRadius: 8,
														borderBottomRightRadius: 8,
														borderTopRightRadius: 32,
														borderBottomLeftRadius: 32,
													}}
												>
													{/* center the image */}
													<View
														style={{
															justifyContent: "center",
															alignItems: "center",
															width: "100%",
														}}
													>
														<Image
															resizeMode="cover"
															style={{
																width: "100%",
																height: 157,
																borderRadius: 8,
															}}
															source={{ uri: item.image }}
														></Image>
													</View>

													<View style={{ marginHorizontal: 12 }}>
														<Text
															style={{
																color: "#06283D",
																fontWeight: "600",
																marginTop: 16,
																marginBottom: 16,
																fontSize: 24,
																textAlign: "center",
															}}
														>
															{item.name}
														</Text>
													</View>

													<View style={styles.innerBox}>
														<Text
															style={{
																marginHorizontal: 12,
																marginVertical: 8,
																fontSize: 16,
																color: "#256D85",
															}}
														>
															{item.description.length > 150
																? item.description.substring(0, 150) + "..."
																: item.description}
														</Text>
													</View>
												</View>
											</TouchableOpacity>
										</>
									)}
								</>
							)}
						/>
					</View>
				</LinearGradient>
			)}
		</>
	);
};

export default SocScreen;

const styles = StyleSheet.create({
	container: {
		margin: 12,
		marginHorizontal: 32,
		padding: 16,
		backgroundColor: "#fff",
		borderTopLeftRadius: 16,
		borderBottomRightRadius: 16,
		borderTopRightRadius: 4,
		borderBottomLeftRadius: 4,
		borderColor: "#06283D",
		borderWidth: 1.5,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
		elevation: 5,
		shadowColor: "#171717",
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
