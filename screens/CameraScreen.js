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

const RESULT_MAPPING = ["Centennial Campus", "Happy Park", "Main Building"];

const CameraCompo = ({ navigation }) => {
	const [type, setType] = useState(CameraType.back);
	const [permission, setPermission] = Camera.useCameraPermissions();
	const cameraRef = React.useRef();
	const [isProcessing, setIsProcessing] = useState(false);
	const [presentedShape, setPresentedShape] = useState("");

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
		if (Math.max.apply(null, prediction) > 0) {
			highestPrediction = prediction.indexOf(Math.max.apply(null, prediction));
			setPresentedShape(RESULT_MAPPING[highestPrediction]);
		} else {
			highestPrediction = -1;
			setPresentedShape("Not Valid");
		}
	};

	const addPoints = async () => {
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

		let exist = 0;

		// check if the presentedShape is in the mapHunt array
		if (mapHunt.includes(presentedShape)) {
			// if yes, do nothing
			exist = 1;
		} else {
			// if no, add the presentedShape to the mapHunt array
			mapHunt.push(presentedShape);
			console.log("updated maphunt array: ", mapHunt);
			// update the mapHunt array in the database
			updateDoc(doc(db, "points", result[0].id), {
				mapHunt: mapHunt,
			});
		}

		if (exist === 0) {
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
	};

	// useEffect(() => {
	// 	if (presentedShape !== "" && presentedShape !== "Not Valid") {
	// 		addPoints();
	// 	}
	// }, [presentedShape]);

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
									{presentedShape !== "Not Valid" && presentedShape !== "" ? (
										<>
											<Text>Your visited {presentedShape}</Text>
											<Text>20 Pointshave been awarded</Text>
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
											setPresentedShape("");
											setIsProcessing(false);
											await addPoints();
											console.log(auth?.currentUser.uid);
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
									type={Camera.Constants.Type.back}
									autoFocus={true}
									whiteBalance={Camera.Constants.WhiteBalance.auto}
								></Camera>
								<Pressable
									onPress={() => handleImageCapture()}
									style={styles.captureButton}
								></Pressable>
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
		left: Dimensions.get("screen").width / 2 - 50,
		bottom: 40,
		width: 100,
		zIndex: 100,
		height: 100,
		backgroundColor: "white",
		borderRadius: 50,
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
