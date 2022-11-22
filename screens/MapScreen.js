import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	Image,
	ImageBackground,
	TouchableOpacity,
	ScrollView,
	Animated,
	Linking,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { Modal, Portal, FAB, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { auth, db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.6;
const SPACING_FOR_CARD_INSET = (CARD_WIDTH / 0.6) * 0.1 - 5;

const MapScreen = ({ navigation }) => {
	const [points, setPoints] = useState();
	const [facName, setFacName] = useState("");
	const [result, setResult] = useState();
	const [mapType, setMapType] = useState("standard");
	const [region, setRegion] = useState({
		latitude: 22.28333,
		longitude: 114.13643,
		latitudeDelta: 0.00922,
		longitudeDelta: 0.00421,
	});

	useLayoutEffect(() => {
		navigation.setOptions({
			userName: auth?.currentUser?.displayName ?? "Anonymous",
			userPoint: points,
			userAvatar: () => <TouchableOpacity
									stlye={{
										justifyContent: "center",
										alignSelf: "center",
										alignItem: "center",
									}}
									onPress={() => {
										navigation.navigate("ProfileStack");
									}}
								>
									<Image
										style={{
											height: 40,
											width: 40,
											borderRadius: 100,
										}}
										source={{
											uri: auth?.currentUser
												? auth?.currentUser?.userImg ||
												"https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
												: "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
										}}
									/>
								</TouchableOpacity>
		});
	});

	let getPoints = async () => {
		await AsyncStorage.getItem("notification").then((value) => {
			if (value === "enabled") {
				setResult("enabled");
			} else {
				setResult("disabled");
			}
		});
		const q = query(
			collection(db, "points"),
			where("uid", "==", auth?.currentUser?.uid)
		);
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			let temp = doc.data();
			setPoints(temp.points);
		});
	};

	useEffect(() => {
		const interval = setInterval(() => {
			getPoints();
		}, 120000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (auth && auth?.currentUser) {
			getPoints();
		}
	}, [navigation]);

	let mapAnimation = new Animated.Value(0);
	const _map = React.useRef(null);
	let mapIndex = 0;

	let loadFacility = async () => {
		let r = [];
		const q = query(collection(db, "facility"), where("name", "==", facName));
		const querySnapshot = await getDocs(q).then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				let temp = doc.data();
				temp.id = doc.id;
				r.push(temp);
			});
			setResult(r[0]);
		});
	};

	useEffect(() => {
		if (facName) {
			loadFacility();
			showModal();
		}
	}, [facName]);

	//  function that change the mapType to hybrid if standard and vice versa
	const changeMapType = () => {
		if (mapType == "standard") {
			setMapType("hybrid");
		} else {
			setMapType("standard");
		}
	};

	useEffect(() => {
		mapAnimation.addListener(({ value }) => {
			let index = Math.floor(value / CARD_WIDTH + 0.3);
			if (index >= markers.length) {
				index = markers.length - 1;
			}
			if (index <= 0) {
				index = 0;
			}

			clearTimeout(regionTimeout);

			const regionTimeout = setTimeout(() => {
				if (mapIndex !== index) {
					mapIndex = index;
					const { latitude, longitude } = markers[index];
				}
			}, 10);
		});
	});

	const onMarkerPress = (mapEventData) => {
		const markerID = mapEventData._targetInst.return.key;

		let x = markerID * CARD_WIDTH + markerID * 20;

		_scrollView.current.scrollTo({ x: x, y: 0, animated: true });
	};

	const Images = [
		{ image: require("../assets/library.png") },
		{ image: require("../assets/chiwah.png") },
		{ image: require("../assets/hakingwong.png") },
		{ image: require("../assets/knowles.png") },
		{ image: require("../assets/mainbuilding.jpg") },
		{ image: require("../assets/composite.png") },
		{ image: require("../assets/chowyeiching.jpeg") },
		{ image: require("../assets/raysonhuang.png") },
		{ image: require("../assets/cya.jpg") },
		{ image: require("../assets/cyp.jpg") },
		{ image: require("../assets/cyc.jpg") },
		{ image: require("../assets/mengwah.jpg") },
	];
	let markers = [
		{
			latitude: 22.283284854186324,
			longitude: 114.13772673346415,
			title: "Main Library",
			subtitle: "HKU",
			description: "HKU Main Library",
			image: Images[0].image,
			ID: 0,
		},
		{
			latitude: 22.28356,
			longitude: 114.13473,
			title: "Chi Wah Learning Commons",
			subtitle: "HKU",
			description: "Chi Wah Learning Commons",
			image: Images[1].image,
			ID: 1,
		},
		{
			latitude: 22.28299,
			longitude: 114.13654,
			title: "Haking Wong Building",
			subtitle: "HKU",
			description: "Haking Wong Building",
			image: Images[2].image,
			ID: 2,
		},
		{
			latitude: 22.283350359069324,
			longitude: 114.13843503157959,
			title: "Knowles Building",
			subtitle: "HKU",
			description: "Knowles Building",
			image: Images[3].image,
			ID: 3,
		},
		{
			latitude: 22.28396,
			longitude: 114.13772673346415,
			title: "Main Building",
			subtitle: "HKU",
			description: "Main Building",
			image: Images[4].image,
			ID: 4,
		},
		{
			latitude: 22.28299,
			longitude: 114.13614,
			title: "Composite Building",
			subtitle: "HKU",
			description: "Composite Building",
			image: Images[5].image,
			ID: 5,
		},
		{
			latitude: 22.28299,
			longitude: 114.13574,
			title: "Chow Yei Ching Building",
			subtitle: "HKU",
			description: "Chow Yei Ching Building",
			image: Images[6].image,
			ID: 6,
		},
		{
			latitude: 22.282350359069324,
			longitude: 114.13843503157959,
			title: "Rayson Huang Theatre",
			subtitle: "HKU",
			description: "Rayson Huang Theatre",
			image: Images[7].image,
			ID: 7,
		},
		{
			latitude: 22.282600359069324,
			longitude: 114.13913503157959,
			title: "Chong Yuet Ming Amenities Centre",
			subtitle: "HKU",
			description: "Chong Yuet Ming Amenities Centre",
			image: Images[8].image,
			ID: 8,
		},
		{
			latitude: 22.283150359069324,
			longitude: 114.13977503157959,
			title: "Chong Yuet Ming Physics Building",
			subtitle: "HKU",
			description: "Chong Yuet Ming Physics Building",
			image: Images[9].image,
			ID: 9,
		},
		{
			latitude: 22.282990359069324,
			longitude: 114.13997503157959,
			title: "Chong Yuet Ming Chemistry Building",
			subtitle: "HKU",
			description: "Chong Yuet Ming Chemistry Building",
			image: Images[10].image,
			ID: 10,
		},
		{
			latitude: 22.282200359069324,
			longitude: 114.13917503157959,
			title: "Meng Wah Complex",
			subtitle: "HKU",
			description: "Meng Wah Complexe",
			image: Images[11].image,
			ID: 11,
		},
	];

	function onRegionChange(region) {
		setRegion({ region });
	}

	// pop up modal
	const [visible, setVisible] = React.useState(false);
	const [hideDesc, setHideDesc] = React.useState(true);
	const showModal = () => setVisible(true);
	const hideModal = () => {
		setVisible(false);
		setFacName("");
		setResult();
	};
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: "80%",
		alignSelf: "center",
		borderRadius: 16,
	};

	const _scrollView = React.useRef(null);

	return (
		<View style={styles.container}>
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={containerStyle}
				>
					<Text style={{ fontSize: 24, alignSelf: "center" }}>
						{facName}
						{"\n"}
					</Text>

					<Text>
						{result &&
						result.description &&
						result.description.length > 200 &&
						hideDesc
							? result.description.substring(0, 200) + "..."
							: result && result.description}
					</Text>

					{result && result.description && result.description.length > 200 && (
						<Button
							mode="contained"
							onPress={() => {
								setHideDesc(!hideDesc);
							}}
						>
							{hideDesc ? "Show More" : "Show Less"}
						</Button>
					)}

					{result && result.departments && result.departments != [] ? (
						<>
							<Text>Departments Associated:</Text>
							<Text>
								{result &&
									result.departments.map((dep, idx) => {
										return (
											<Text key={idx}>
												{idx + 1}: {dep}
												{"\n"}
											</Text>
										);
									})}
							</Text>
						</>
					) : null}

					{result && result.facilities && result.facilities != [] ? (
						<>
							<Text>Facilities:</Text>
							<Text>
								{result &&
									result.facilities.map((f, idx) => {
										return (
											<Text key={idx}>
												{f}
												{"\n"}
											</Text>
										);
									})}
							</Text>
						</>
					) : null}

					{result && result.links && result.links != [] ? (
						<>
							{result && result.links && result.links.length !== 0 ? (
								<Text>Links:</Text>
							) : (
								<Text>Links: N/A</Text>
							)}
							<Text>
								{result && result.links
									? result.links.map((link, idx) => {
											return (
												<Text
													key={idx}
													style={{ color: "blue" }}
													onPress={() => Linking.openURL(link)}
												>
													{idx + 1}: {link}
													{"\n"}
												</Text>
											);
									  })
									: null}
							</Text>
						</>
					) : null}

					<Button
						mode="contained"
						onPress={hideModal}
						style={{
							marginTop: 24,
							backgroundColor: "#00C851",
						}}
					>
						CLOSE
					</Button>
				</Modal>
			</Portal>
			<MapView
				region={region || { latitude: 22.28333, longitude: 114.13643 }}
				onRegionChange={onRegionChange}
				style={styles.map}
				mapType={mapType}
				provider="google"
				ref={_map}
			>
				{markers.map((key, index) => {
					return (
						<Marker
							onPress={(e) => onMarkerPress(e)}
							key={key.ID}
							coordinate={{
								latitude: key.latitude,
								longitude: key.longitude,
							}}
							title={key.title}
							description={key.description}
						>
							<Animated.View style={[styles.markerWrap]}>
								<Animated.Image
									source={require("../assets/map-marker.png")}
									style={[styles.marker]}
									resizeMode="cover"
								/>
							</Animated.View>
						</Marker>
					);
				})}
			</MapView>
			<FAB
				icon={mapType === "standard" ? "map-plus" : "map"}
				style={styles.fab}
				onPress={() => changeMapType()}
			/>
			<Animated.ScrollView
				ref={_scrollView}
				horizontal
				pagingEnabled
				scrollEventThrottle={1}
				showsHorizontalScrollIndicator={false}
				snapToInterval={CARD_WIDTH + 20}
				snapToAlig
				nment="center"
				style={styles.scrollView}
				contentInset={{
					top: 0,
					left: SPACING_FOR_CARD_INSET,
					bottom: 0,
					right: SPACING_FOR_CARD_INSET,
				}}
				contentContainerStyle={{ paddingHorizontal: SPACING_FOR_CARD_INSET }}
				onScroll={Animated.event(
					[
						{
							nativeEvent: {
								contentOffset: {
									x: mapAnimation,
								},
							},
						},
					],
					{ useNativeDriver: true }
				)}
			>
				{markers.map((marker, index) => (
					<View style={styles.card} key={index}>
						<Image
							source={marker.image}
							style={styles.cardImage}
							resizeMode="cover"
						/>
						<View style={styles.textContent}>
							<Text numberOfLines={1} style={styles.cardtitle}>
								{marker.title}
							</Text>
							<Text numberOfLines={1} style={styles.cardDescription}>
								{marker.description}
							</Text>
							<View style={styles.button}>
								<TouchableOpacity
									onPress={(e) => {
										setRegion({
											latitude: marker.latitude,
											longitude: marker.longitude,
											latitudeDelta: 0.00222,
											longitudeDelta: 0.00121,
										});
									}}
								>
									<Text
										style={[
											styles.textSign,
											{
												color: "#FF6347",
											},
										]}
									>
										Visit
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => {
										navigation.navigate("MapHunt", {marker: markers[index]});
									}}
								>
									<Text
										style={[
											styles.textSign,
											{
												color: "#FF6347",
											},
										]}
									>
										Start the Hunt
									</Text>

								</TouchableOpacity>
								<TouchableOpacity
									onPress={(e) => {
										setFacName(marker.title);
									}}
								>
									<Text
										style={[
											styles.textSign,
											{
												color: "#FF6347",
											},
										]}
									>
										Learn More
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				))}
			</Animated.ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	bubble: {
		flexDirection: "column",
		alignSelf: "flex-start",
		backgroundColor: "#fff",
		borderRadius: 6,
		borderColor: "#ccc",
		borderWidth: 0.5,
		padding: 15,
		width: 150,
	},
	name: {
		fontSize: 16,
		marginBottom: 5,
	},
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	card: {
		padding: 10,
		elevation: 2,
		backgroundColor: "#FFF",
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		marginHorizontal: 10,
		shadowColor: "#000",
		shadowRadius: 5,
		shadowOpacity: 0.3,
		shadowOffset: { x: 2, y: -2 },
		height: 220,
		width: CARD_WIDTH,
		overflow: "hidden",
	},
	cardImage: {
		flex: 3,
		width: "100%",
		height: "100%",
		alignSelf: "center",
	},
	textContent: {
		flex: 2,
		padding: 10,
	},
	marker: {
		width: 30,
		height: 30,
	},
	cardtitle: {
		fontSize: 12,
		// marginTop: 5,
		fontWeight: "bold",
	},
	cardDescription: {
		fontSize: 12,
		color: "#444",
	},
	scrollView: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		paddingVertical: 10,
	},
	map: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		marginBottom: "5%",
	},
	calloutText: {
		width: Dimensions.get("window").width * 0.3,
		height: Dimensions.get("window").height * 0.3,
		backgroundColor: "white",
	},
	fab: {
		position: "absolute",
		margin: 16,
		right: 5,
		top: "3%",
	},
	image: {
		width: 80,
		height: 80,
	},
	textSign: {
		fontSize: 14,
		fontWeight: "bold",
	},
});

export default MapScreen;
