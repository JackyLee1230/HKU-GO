import {
	View,
	Text,
	FlatList,
	StyleSheet,
	Pressable,
	TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { FAB, Searchbar } from "react-native-paper";
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
	doc,
	setDoc,
} from "firebase/firestore";

const SocScreen = ({ navigation }) => {
	const [isLoading, setIsLoading] = useState(true);
	let [isRefreshing, setIsRefreshing] = React.useState(false);
	const [socs, setSocs] = useState([]);
	const [search, setSearch] = useState("");
	const [debouncedSearch] = useDebounce(search, 500);

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
		console.log(socs);
	}

	const onChangeSearch = (query) => setSearch(query);

	return (
		<View style={{ flex: 1, marginTop: 100 }}>
			<Text>Society Page</Text>

			<Searchbar
				value={search}
				onChangeText={onChangeSearch}
				placeholder={"Search With Name"}
			/>

			<FlatList
				data={socs}
				style={{ height: "100%" }}
				numColumns={1}
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
									<View>
										<Text>{item.id}</Text>
										<Text>{item.name}</Text>
										<Text>{item.description}</Text>
										{/* <Text>{item.links}</Text> */}
										{item.links.map((link, idx) => {
											return (
												<Text>
													{idx}: {link}
												</Text>
											);
										})}
									</View>
								</TouchableOpacity>
							</>
						)}
					</>
				)}
			/>
		</View>
	);
};

export default SocScreen;

const styles = StyleSheet.create({
	container: {
		margin: 5,
		marginHorizontal: 10,
		padding: 15,
		borderRadius: 15,
		backgroundColor: "#e5e5e5",
	},
});
