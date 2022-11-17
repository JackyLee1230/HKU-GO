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
		<LinearGradient colors={["#C3E8FD", "#EFF8FD"]} style={{ flex: 1 }}>
			<ScrollView>
				{soc && soc.name ? (
					<View style={{ flex: 1 }}>
						<View
							style={{
								margin: 12,
								marginBottom: 24,
								marginHorizontal: 32,
								backgroundColor: "#fff",
								borderTopLeftRadius: 32,
								borderBottomRightRadius: 4,
								borderTopRightRadius: 32,
								borderBottomLeftRadius: 4,
								borderColor: "#06283D",
								borderWidth: 1.5,
							}}
						>
							<LinearGradient
								colors={["#7FB77E", "#B6E399"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								style={{
									alignItems: "center",
									borderTopLeftRadius: 30,
									borderBottomRightRadius: 0,
									borderTopRightRadius: 30,
									borderBottomLeftRadius: 0,
								}}
							>
								<Text
									style={{
										fontSize: 28,
										fontWeight: "700",
										textAlign: "center",
										paddingVertical: 12,
										paddingHorizontal: 24,
										color: "#FFFFFF",
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
											color: "#256D85",
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
											style={{ 
												alignSelf: 'center', 
												marginBottom: 8,
												backgroundColor: "#FF8787",
											}}
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
									alignItems: "center",
									paddingHorizontal: 32,
									justifyContent: "space-around",
									marginBottom: 24,
								}}
							>
								{soc.links["instagram"] && (
									<TouchableOpacity
										onPress={() => {
											Linking.openURL(soc.links["instagram"]);
										}}
										style={{
											borderRadius: 8,
											shadowOffset: { width: 0, height: 1 },
											shadowOpacity: 0.5,
											shadowRadius: 1,
											elevation: 1,
											shadowColor: "#171717",
										}}
									>
										<LinearGradient
											start={{ x: 0, y: 0 }}
											end={{ x: 1, y: 0 }}
											colors={["#FF8787", "#F8C4B4"]}
											style={{
												borderRadius: 8,
												paddingHorizontal: 12,
												paddingVertical: 8,
											}}
										>
											<Text
												style={{
													fontSize: 14,
													fontWeight: "500",
													color: "#222222",
												}}
											>
												Instagram
											</Text>
										</LinearGradient>
									</TouchableOpacity>
								)}
								{soc.links["facebook"] && (
									<TouchableOpacity
										onPress={() => {
											Linking.openURL(soc.links["instagram"]);
										}}
										style={{
											borderRadius: 8,
											shadowOffset: { width: 0, height: 1 },
											shadowOpacity: 0.5,
											shadowRadius: 1,
											elevation: 1,
											shadowColor: "#171717",
										}}
									>
										<LinearGradient
											start={{ x: 0, y: 0 }}
											end={{ x: 1, y: 0 }}
											colors={["#47B5FF", "#9AE3FF"]}
											style={{
												borderRadius: 8,
												paddingHorizontal: 12,
												paddingVertical: 8,
											}}
										>
											<Text
												style={{
													fontSize: 14,
													fontWeight: "500",
													color: "#222222",
												}}
											>
												Facebook
											</Text>
										</LinearGradient>
									</TouchableOpacity>
								)}
								{soc.links["official"] && (
									<TouchableOpacity
										onPress={() => {
											Linking.openURL(soc.links["instagram"]);
										}}
										style={{
											borderRadius: 8,
											shadowOffset: { width: 0, height: 1 },
											shadowOpacity: 0.5,
											shadowRadius: 1,
											elevation: 1,
											shadowColor: "#171717",
										}}
									>
										<LinearGradient
											start={{ x: 0, y: 0 }}
											end={{ x: 1, y: 0 }}
											colors={["#B6E388", "#7FB77E"]}
											style={{
												borderRadius: 8,
												paddingHorizontal: 12,
												paddingVertical: 8,
											}}
										>
											<Text
												style={{
													fontSize: 14,
													fontWeight: "500",
													color: "#222222",
												}}
											>
												Official Webpage
											</Text>
										</LinearGradient>
									</TouchableOpacity>
								)}
							</View>
						)}

						{soc.images && soc.images.length !== 0 && (
							<Swiper
								autoplay
								autoplayTimeout={4}
								style={{ 
									height: 280,
									alignItems: 'center',
									marginBottom: 24,
								}}
								activeDotColor={"#47B5FF"}
							>
								{soc.images.map((image, index) => (
									<View key={index}>
										<Image
											style={{ 
												aspectRatio: 3.5 / 3,
											}}
											source={{ uri: image }}
											resizeMode="contain"
										></Image>
									</View>
								))}
							</Swiper>
						)}

						{events && events.length > 0 && (
							<View style={{ 
								width: "100%",
								marginBottom: 24,
							}}>
								<Text
									style={{
										width: "100%",
										fontWeight: "700",
										fontSize: 16,
										color: "#06283D",
										textAlign: "center",
										marginBottom: 12,
									}}
								>
									Join Our Upcoming Events(s):
								</Text>

								{events.map((event) => (
									<EventCard key={event.name} event={event} />
								))}
							</View>
						)}
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
