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
} from "react-native";
import React, { useState, useEffect } from "react";
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

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.6;
const SPACING_FOR_CARD_INSET = (CARD_WIDTH / 0.6) * 0.1 - 5;

const MapScreen = ({ navigation }) => {
	const [facName, setFacName] = useState("");
	const [result, setResult] = useState();
	const [region, setRegion] = useState({
		latitude: 22.28333,
		longitude: 114.13643,
		latitudeDelta: 0.00922,
		longitudeDelta: 0.00421,
	});

	let mapAnimation = new Animated.Value(0);
	const _map = React.useRef(null);
	let mapIndex = 0;

	let loadFacility = async () => {
		const q = query(collection(db, "facility"), where("name", "==", facName));
		const querySnapshot = await getDocs(q);

		let r = [];
		querySnapshot &&
			querySnapshot.forEach((doc) => {
				let temp = doc.data();
				console.log(temp);
				temp.id = doc.id;
				r.push(temp);
			});

		setResult(r[0]);
	};

	useEffect(() => {
		if (facName) {
			loadFacility();
			showModal();
		}
	}, [facName]);

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
	];

	function onRegionChange(region) {
		setRegion({ region });
	}

	// pop up modal
	const [visible, setVisible] = React.useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => {
		setVisible(false);
		setFacName("");
	};
	const containerStyle = { backgroundColor: "white", padding: 20 };

	const _scrollView = React.useRef(null);

	return (
		<View style={styles.container}>
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={containerStyle}
				>
					<Text>{facName}</Text>
					<Text>
						{result &&
							result.departments.map((dep, idx) => {
								return (
									<Text>
										{dep}
										{"\n"}
									</Text>
								);
							})}
					</Text>
				</Modal>
			</Portal>
			<MapView
				region={region}
				onRegionChange={onRegionChange}
				style={styles.map}
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
			<FAB icon="help" style={styles.fab} onPress={() => showModal()} />
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
											latitudeDelta: 0.00922,
											longitudeDelta: 0.00421,
										});
										console.log(marker.longitude, marker.latitude);
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
