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
import { FAB, Searchbar } from "react-native-paper";
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
			{!isLoading && (
				<LinearGradient colors={["#0098FF", "#DFF6FF"]} style={{ flex: 1 }}>
					<View style={{ flex: 1 }}>
						{debouncedOnTop ? (
							<View
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
								<Text style={{ fontSize: 24, textAlign: "center" }}>
									Find out more about the Societies and Faculties @HKU
								</Text>
							</View>
						) : null}

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
							}}
						/>

						<FlatList
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
														}}
													>
														<Image
															style={{
																width: "100%",
																height: 157,
															}}
															source={{ uri: item.image }}
														></Image>
													</View>

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
