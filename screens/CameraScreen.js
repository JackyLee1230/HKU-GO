import { Camera, CameraType } from "expo-camera";
import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	Button,
	Pressable,
	Modal,
	ActivityIndicator,
} from "react-native";
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
import { FAB } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import {
	getModel,
	convertBase64ToTensor,
	startPrediction,
} from "../src/tensor-helper";
import { cropPicture } from "../src/image-helper";
import { updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const RESULT_MAPPING = [
	"Main Building",
	"Centennial Campus",
	"Yuet Ming Fountain",
];

const CameraCompo = ({ navigation }) => {
	const [type, setType] = useState(CameraType.back);
	const [permission, setPermission] = Camera.useCameraPermissions();
	const [hasPermission, setHasPermission] = useState(null);
	const cameraRef = React.useRef();
	const [isProcessing, setIsProcessing] = useState(false);
	const [presentedShape, setPresentedShape] = useState("");
	const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
	const [exist, setExist] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const changeCameraType = () => {
		if (cameraType === Camera.Constants.Type.back) {
			setCameraType(Camera.Constants.Type.front);
		} else {
			setCameraType(Camera.Constants.Type.back);
		}
	};

	const handleImageCapture = async () => {
		setIsProcessing(true);
		const imageData = await cameraRef.current.takePictureAsync({
			base64: true,
		});
		processImagePrediction(imageData);
	};

	const processImagePrediction = async (base64Image) => {
		const croppedData = await cropPicture(base64Image, 300);
		const model = await getModel();
		const tensor = await convertBase64ToTensor(croppedData.base64);

		const prediction = await startPrediction(model, tensor);

		console.log(prediction);
		let highestPrediction = 0;
		console.log(Math.max.apply(null, prediction));
		if (Math.max.apply(null, prediction) > 0.6) {
			highestPrediction = prediction.indexOf(Math.max.apply(null, prediction));
			setPresentedShape(RESULT_MAPPING[highestPrediction]);
		} else {
			highestPrediction = -1;
			setPresentedShape("Not Valid");
		}
	};

	const addPoints = async () => {
		setIsLoading(true);
		const q = query(
			collection(db, "points"),
			where("uid", "==", auth?.currentUser?.uid)
		);
		const querySnapshot = await getDocs(q);
		let result = [];
		querySnapshot.forEach((doc) => {
			let temp = doc.data();
			temp.id = doc.id;
			result.push(temp);
		});
		// get the value of mapHunt array
		let mapHunt = result[0].mapHunt;
		console.log(mapHunt);

		setExist(0);
		let temp = 0;

		// check if the presentedShape is in the mapHunt array
		if (mapHunt.includes(presentedShape)) {
			// if yes, do nothing
			setExist(1);
			temp = 1;
		} else {
			// if no, add the presentedShape to the mapHunt array
			mapHunt.push(presentedShape);
			console.log("updated maphunt array: ", mapHunt);
			// update the mapHunt array in the database
			updateDoc(doc(db, "points", result[0].id), {
				mapHunt: mapHunt,
			});
		}

		if (exist === 0 || temp === 0) {
			const q3 = query(
				collection(db, "points"),
				where("uid", "==", auth?.currentUser?.uid)
			);
			const querySnapshot3 = await getDocs(q3);
			let result3 = [];
			querySnapshot3.forEach((doc) => {
				let temp = doc.data();
				temp.id = doc.id;
				result3.push(temp);
			});
			if (result3.length > 0) {
				const docRef3 = doc(db, "points", result3[0].id);
				await updateDoc(docRef3, {
					points: result3[0].points + 20,
				});
			}
		}
		setIsLoading(false);
	};

	return (
		<>
			{!permission ? (
				<>
					<Text>Loading</Text>
				</>
			) : (
				<>
					<View style={styles.container}>
						<Modal
							visible={isProcessing}
							transparent={true}
							animationType="slide"
						>
							<View style={styles.modal}>
								<View style={styles.modalContent}>
									{!isLoading ? (
										<>
											{presentedShape !== "Not Valid" &&
											presentedShape !== "" ? (
												<>
													<Text style={{ fontWeight: "bold" }}>
														{presentedShape}
													</Text>
													{exist === 0 ? (
														<Text>You got 20 points!</Text>
													) : (
														<Text>You have already visited this place!</Text>
													)}
												</>
											) : null}
										</>
									) : (
										<ActivityIndicator size="large" />
									)}

									{presentedShape == "Not Valid" ? (
										<>
											<Text>Detection failed.</Text>
											<Text>Please try again.</Text>
										</>
									) : null}

									{!RESULT_MAPPING.includes(presentedShape) &&
										presentedShape !== "" &&
										presentedShape !== "Not Valid" && (
											<ActivityIndicator size="large" />
										)}
									<Pressable
										style={styles.dismissButton}
										onPress={async () => {
											if (
												presentedShape !== "Not Valid" &&
												presentedShape !== ""
											) {
												await addPoints();
											}
											setPresentedShape("");
											setIsProcessing(false);
										}}
									>
										<Text>Dismiss</Text>
									</Pressable>
								</View>
							</View>
						</Modal>
						{!permission.granted ? (
							<>
								<Button
									onPress={async () => {
										let res =
											await Camera.requestCameraPermissionsAsync().then();

										if (res.granted == true) {
											permission.granted = true;
											setHasPermission(true);
										}
									}}
									title="grant permission"
								/>
							</>
						) : (
							<>
								<Camera
									ref={cameraRef}
									style={styles.camera}
									type={cameraType}
									autoFocus={true}
									ratio={"16:9"}
									whiteBalance={Camera.Constants.WhiteBalance.auto}
								></Camera>
								<FAB
									icon="camera"
									style={styles.captureButton}
									onPress={async () => {
										handleImageCapture();
									}}
								/>
								<FAB
									icon="camera-flip-outline"
									style={{
										position: "absolute",
										left: Dimensions.get("window").width * 0.7,
										top: Dimensions.get("window").height * 0.7,
										backgroundColor: "#FFFFFF",
										borderRadius: 32,
										margin: 16,
										zIndex: 1,
									}}
									onPress={async () => {
										changeCameraType();
									}}
								/>
							</>
						)}
					</View>
				</>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	camera: {
		width: "100%",
		height: "100%",
	},
	captureButton: {
		position: "absolute",
		left: Dimensions.get("window").width * 0.39,
		top: Dimensions.get("window").height * 0.7,
		backgroundColor: "#FFFFFF",
		borderRadius: 32,
		margin: 16,
		zIndex: 1,
	},
	modal: {
		flex: 1,
		width: "100%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
	},
	modalContent: {
		alignItems: "center",
		justifyContent: "center",
		width: 300,
		height: 300,
		borderRadius: 24,
		backgroundColor: "gray",
	},
	dismissButton: {
		width: 150,
		height: 50,
		marginTop: 60,
		borderRadius: 24,
		color: "white",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "red",
	},
});

export default CameraCompo;
