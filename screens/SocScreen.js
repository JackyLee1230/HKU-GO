import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { FAB } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
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

	return (
		<View style={{ flex: 1, marginTop: 100 }}>
			<Text>Society Page</Text>
			<FlatList
				data={socs}
				style={{ height: "100%" }}
				numColumns={1}
				renderItem={({ item }) => (
					<Pressable style={styles.container}>
						<View>
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
					</Pressable>
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
