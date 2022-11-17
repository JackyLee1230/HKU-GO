import { Camera, CameraType } from "expo-camera";
import React, { useState } from "react";
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
import { FAB } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import {
	getModel,
	convertBase64ToTensor,
	startPrediction,
} from "../src/tensor-helper";
import { cropPicture } from "../src/image-helper";

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

		const highestPrediction = prediction.indexOf(
			Math.max.apply(null, prediction)
		);
		console.log(highestPrediction);
		setPresentedShape(RESULT_MAPPING[highestPrediction]);
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
									<Text>Your current shape is {presentedShape}</Text>
									{presentedShape === "" && <ActivityIndicator size="large" />}
									<Pressable
										style={styles.dismissButton}
										onPress={() => {
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
										let res = await Camera.requestCameraPermissionsAsync();
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
