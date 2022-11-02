import {
	View,
	Text,
	FlatList,
	StyleSheet,
	Pressable,
	TouchableOpacity,
} from "react-native";
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

const SocDetailScreen = ({ route, navigation }) => {
	const { id, name } = route.params;

	const [isLoading, setIsLoading] = useState(true);
	let [isRefreshing, setIsRefreshing] = useState(false);
	const [soc, setSoc] = useState([]);
	useLayoutEffect(() => {
		navigation.setOptions({
			headerBackTitle: "Back To Home Page",
		});
	}, [navigation]);

	let loadSocs = async () => {
		const q = query(collection(db, "society"), where("name", "==", name));
		const querySnapshot = await getDocs(q);

		let result = [];
		querySnapshot.forEach((doc) => {
			let temp = doc.data();
			temp.id = doc.id;
			result.push(temp);
		});

		setSoc(result[0]);
		setIsLoading(false);
		setIsRefreshing(false);
	};

	if (isLoading) {
		loadSocs();
	}

	return (
		<View style={{ flex: 1, marginTop: 100 }}>
			<View>
				<Text>{soc.name}</Text>
				{/* <Text>{soc.id}</Text>
				<Text>{soc.name}</Text>
				<Text>{soc.description}</Text> */}
				{/* <Text>{item.links}</Text> */}
			</View>
		</View>
	);
};

export default SocDetailScreen;

const styles = StyleSheet.create({
	container: {
		margin: 5,
		marginHorizontal: 10,
		padding: 15,
		borderRadius: 15,
		backgroundColor: "#e5e5e5",
	},
});
