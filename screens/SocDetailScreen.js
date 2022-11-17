import {
	View,
	Text,
	FlatList,
	StyleSheet,
	Pressable,
	TouchableOpacity,
	ScrollView,
	Image,
	Linking,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { FAB, Button } from "react-native-paper";
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
import { LinearGradient } from "expo-linear-gradient";
import EventCard from "../src/EventCard";
import Swiper from "react-native-swiper";

const SocDetailScreen = ({ route, navigation }) => {
	const { id, name } = route.params;

	const [isLoading, setIsLoading] = useState(true);
	const [soc, setSoc] = useState([]);
	const [events, setEvents] = useState([]);
	const [hideDesc, setHideDesc] = useState(true);
	useLayoutEffect(() => {
		navigation.setOptions({
			headerBackTitle: "Back To Home Page",
		});
	}, [navigation]);

	useEffect(() => {
		navigation.setOptions({
			title: soc.name,
		});
	}, [soc]);

	let loadSocs = async () => {
		const q = query(collection(db, "society"), where("name", "==", name));
		const querySnapshot = await getDocs(q);

		let result = [];
		querySnapshot.forEach((doc) => {
			let temp = doc.data();
			temp.id = doc.id;
			result.push(temp);
		});

		const q2 = query(collection(db, "events"), where("organiser", "==", name));
		const querySnapshot2 = await getDocs(q2);

		let result2 = [];
		querySnapshot2.forEach((doc) => {
			let temp = doc.data();
			temp.id = doc.id;
			result2.push(temp);
		});

		setSoc(result[0]);
		setEvents(result2);
		setIsLoading(false);
	};

	if (isLoading) {
		loadSocs();
	}

	return (
		<LinearGradient colors={["#0098FF", "#DFF6FF"]} style={{ flex: 1 }}>
			<ScrollView>
				{soc && soc.name ? (
					<View style={{ flex: 1 }}>
						<View
							style={{
								margin: 5,
								marginHorizontal: 32,
								padding: 15,
								backgroundColor: "#fff",
								borderTopLeftRadius: 16,
								borderBottomRightRadius: 4,
								borderTopRightRadius: 16,
								borderBottomLeftRadius: 4,
							}}
						>
							<LinearGradient
								colors={["#7FB77E", "#B6E399"]}
								style={{
									alignItems: "center",
								}}
							>
								<Text
									style={{
										fontSize: 28,
										paddingVertical: 12,
										paddingHorizontal: 32,
									}}
								>
									{soc.name}
								</Text>
							</LinearGradient>
							<View>
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
										source={{ uri: soc.image }}
									></Image>
								</View>

								<View style={styles.innerBox}>
									<Text
										style={{
											marginHorizontal: 12,
											marginVertical: 8,
											fontSize: 16,
										}}
									>
										{soc.description.length > 150
											? hideDesc
												? soc.description.substring(0, 150) + "..."
												: soc.description
											: soc.description}
									</Text>
									{soc.description.length > 150 && (
										<Button
											mode="contained"
											onPress={() => setHideDesc((prev) => !prev)}
										>
											{hideDesc ? "Show More" : "Show Less"}
										</Button>
									)}
								</View>
							</View>
						</View>
						{/* Soc Links */}
						{soc.links && (
							<View
								style={{
									width: "100%",
									flexDirection: "row",
									alignItems: "flex-start",
								}}
							>
								{soc.links["instagram"] && (
									<Button
										mode="contained-tonal"
										compact="true"
										onPress={() => {
											Linking.openURL(soc.links["instagram"]);
										}}
									>
										Instagram
									</Button>
								)}
								{soc.links["facebook"] && (
									<Button
										mode="contained-tonal"
										compact="true"
										onPress={() => {
											Linking.openURL(soc.links["facebook"]);
										}}
									>
										Facebook
									</Button>
								)}
								{soc.links["official"] && (
									<Button
										mode="contained-tonal"
										compact="true"
										onPress={() => {
											Linking.openURL(soc.links["official"]);
										}}
									>
										Official Webpage
									</Button>
								)}
							</View>
						)}

						{soc.images && soc.images.length !== 0 && (
							<Swiper
								autoplay
								autoplayTimeout={4}
								showsButtons={true}
								activeDotColor={"blue"}
								containerStyle={{ aspectRatio: 4 / 3 }}
							>
								{soc.images.map((image, index) => (
									<View key={index}>
										<Image
											style={{ aspectRatio: 4 / 3 }}
											source={{ uri: image }}
											resizeMode="contain"
										></Image>
									</View>
								))}
							</Swiper>
						)}

						{events && events.length > 0 ? (
							<View style={{ width: "100%" }}>
								<Text
									style={{
										width: "100%",
										textAlign: "center",
									}}
								>
									Join Our Upcoming Events(s):
								</Text>

								{events.map((event) => (
									<EventCard key={event.name} event={event} />
								))}
							</View>
						) : null}
					</View>
				) : null}
			</ScrollView>
		</LinearGradient>
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
	innerBox: {
		borderTopLeftRadius: 16,
		borderBottomRightRadius: 16,
		borderTopRightRadius: 4,
		borderBottomLeftRadius: 4,
		marginTop: 16,
		marginHorizontal: 12,
		marginBottom: 16,
		borderColor: "#256D85",
		borderWidth: 1,
	},
});
