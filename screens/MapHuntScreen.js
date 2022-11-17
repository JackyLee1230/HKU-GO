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

const MapHuntScreen = ({ navigation, route }) => {
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
			let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
			if (index >= marker.length) {
				index = marker.length - 1;
			}
			if (index <= 0) {
				index = 0;
			}

			clearTimeout(regionTimeout);

			const regionTimeout = setTimeout(() => {
				if (mapIndex !== index) {
					mapIndex = index;
					const { latitude, longitude } = marker;
					_map.current.animateToRegion(
						{
							latitude: latitude,
							longitude: longitude,
						},
						350
					);
				}
			}, 10);
		});
	});

	const onMarkerPress = (mapEventData) => {
		const markerID = mapEventData._targetInst.return.key;
		console.log(markerID);

		let x = markerID * CARD_WIDTH + markerID * 20;

		_scrollView.current.scrollTo({ x: x, y: 0, animated: true });
	};

	const Images = [
		{ image: require("../assets/library.png") },
		{ image: require("../assets/chiwah.png") },
		{ image: require("../assets/hakingwong.png") },
		{ image: require("../assets/knowles.png") },
	];
	let marker = route.params.marker;

	// const interpolations = markers.map((marker, index) => {
	//     const inputRange = [
	//         (index - 1) * CARD_WIDTH,
	//         index * CARD_WIDTH,
	//         (index + 1) * CARD_WIDTH,
	//     ];

	//     const scale = mapAnimation.interpolate({
	//         inputRange,
	//         outputRange: [1, 1.5, 1],
	//         extrapolate: "clamp",
	//     });

	//     return { scale };
	// });

	function onRegionChange(region) {
		setRegion({ region });
	}

	function markerClick() {
		alert("test");
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
				<Marker
					onPress={(e) => onMarkerPress(e)}
					key={marker.ID}
					coordinate={{
						latitude: marker.latitude,
						longitude: marker.longitude,
					}}
					title={marker.title}
					description={marker.description}
				>
					<Animated.View style={[styles.markerWrap]}>
						<Animated.Image
							source={require("../assets/map-marker.png")}
							style={[styles.marker]}
							resizeMode="cover"
						/>
					</Animated.View>
				</Marker>
			</MapView>
			<Image source={marker.image} style={[styles.image]}></Image>

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
			></Animated.ScrollView>
			<FAB
				icon={"camera"}
				style={styles.camera}
				onPress={() => {
					navigation.navigate("Camera");
				}}
			></FAB>
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
		height: Dimensions.get("window").height / 2,
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
	camera: {
		position: "absolute",

		left: Dimensions.get("window").width * 0.39,
		top: Dimensions.get("window").height * 0.8,
		backgroundColor: "#FFFFFF",
		borderRadius: 32,
		margin: 16,
	},
	image: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height / 2,
	},
	textSign: {
		fontSize: 14,
		fontWeight: "bold",
	},
});

export default MapHuntScreen;
