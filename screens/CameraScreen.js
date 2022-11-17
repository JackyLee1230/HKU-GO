// import { Camera, CameraType } from "expo-camera";
// import { useState } from "react";
// import {
// 	StyleSheet,
// 	Text,
// 	TouchableOpacity,
// 	View,
// 	Dimensions,
// 	Image,
// } from "react-native";
// import { FAB, Button } from "react-native-paper";
// import { LinearGradient } from "expo-linear-gradient";

// const CameraCompo = ({ navigation }) => {
// 	const [type, setType] = useState(CameraType.back);
// 	const [permission, requestPermission] = Camera.useCameraPermissions();
// 	const [photo, setPhoto] = useState(null);
// 	const [camera, setCamera] = useState(null);
// 	let photoDir = "";

// 	async function takePhoto() {
// 		if (!camera) return;
// 		console.log(camera);

// 		const res = await camera.takePictureAsync();
// 		console.log(res);
// 		photoDir = res.uri;
// 		setPhoto(res);
// 		console.log("sdf", res);
// 	}

// 	return (
// 		<>
// 			{!permission ? (
// 				<View>
// 					<Text>Loading</Text>
// 				</View>
// 			) : (
// 				<>
// 					{!permission.granted ? (
// 						<View style={styles.container}>
// 							<Text style={{ textAlign: "center" }}>
// 								Please Grant Permission To Use Your Phone's Camera
// 							</Text>
// 							<Button
// 								onPress={async () => {
// 									let res = await Camera.requestCameraPermissionsAsync();
// 									if (res.granted == true) {
// 										permission.granted = true;
// 									}
// 								}}
// 								title="grant permission"
// 							/>
// 						</View>
// 					) : (
// 						<>
// 							{!photo ? (
// 								<View style={styles.containerStyle}>
// 									<Camera
// 										style={styles.fixedRatio}
// 										type={type}
// 										ratio={"16:9"}
// 										whiteBalance={900}
// 										ref={(ref) => setCamera(ref)}
// 									>
// 										<View>
// 											<FAB style={styles.photoBtn} onPress={takePhoto}></FAB>
// 										</View>
// 									</Camera>
// 								</View>
// 							) : (
// 								<View style={styles.containerStyle}>
// 									<Image
// 										style={styles.photoStyle}
// 										source={{
// 											uri: photo && photo.uri,
// 										}}
// 									/>
// 									<View style={{ flexDirection: "row" }}>
// 										<TouchableOpacity
// 											activeOpacity={0.6}
// 											style={{
// 												width: "43%",
// 												marginTop: Dimensions.get("window").height * 0.81,
// 												marginLeft: "2%",
// 												flex: "3",
// 											}}
// 											onPress={() => {
// 												setPhoto(null);
// 											}}
// 										>
// 											<LinearGradient
// 												start={{ x: 0, y: 0 }}
// 												end={{ x: 1, y: 0 }}
// 												colors={["#F8C4B4", "#FF8787"]}
// 												style={styles.buttonContainer}
// 											>
// 												<Text style={styles.button}>Retake</Text>
// 											</LinearGradient>
// 										</TouchableOpacity>
// 										<TouchableOpacity
// 											activeOpacity={0.6}
// 											style={{
// 												width: "43%",
// 												marginTop: Dimensions.get("window").height * 0.81,
// 												flex: " 3",
// 												marginLeft: "2%",
// 												marginRight: "2%",
// 											}}
// 											onPress={() => {
// 												navigation.navigate("Ai", {
// 													photo: photo && photo.uri,
// 												});
// 											}}
// 										>
// 											<LinearGradient
// 												start={{ x: 0, y: 0 }}
// 												end={{ x: 1, y: 0 }}
// 												colors={["#F8C4B4", "#FF8787"]}
// 												style={styles.buttonContainer}
// 											>
// 												<Text style={styles.button}>Check</Text>
// 											</LinearGradient>
// 										</TouchableOpacity>
// 									</View>
// 								</View>
// 							)}
// 						</>
// 					)}
// 				</>
// 			)}
// 		</>
// 	);
// };
// const styles = StyleSheet.create({
// 	containerStyle: {
// 		flex: 1,
// 		flexDirection: "column",
// 	},
// 	fixedRatio: {
// 		width: Dimensions.get("window").width,
// 		height: Dimensions.get("window").height,
// 	},
// 	photoBtn: {
// 		position: "absolute",

// 		left: Dimensions.get("window").width * 0.39,
// 		top: Dimensions.get("window").height * 0.8,
// 		backgroundColor: "#FFFFFF",
// 		borderRadius: 32,
// 		margin: 16,
// 		zIndex: 1,
// 	},
// 	photoStyle: {
// 		width: Dimensions.get("window").width,
// 		height: Dimensions.get("window").height * 0.8,
// 		resizeMode: "stretch",
// 		position: "absolute",
// 	},
// 	bottomBarStyle: {
// 		backgroundColor: "#000000",
// 	},
// 	textSign: {
// 		fontSize: 20,
// 		fontWeight: "bold",
// 		color: "#FF6347",
// 		top: Dimensions.get("window").height * 0.8,
// 	},
// 	button: {
// 		width: "100%",
// 		fontWeight: "500",
// 		fontSize: 18,
// 		textAlign: "center",
// 		color: "#fff",
// 	},
// 	buttonContainer: {
// 		width: "100%",
// 		paddingVertical: 12,
// 		borderRadius: 8,
// 		elevation: 1,
// 		shadowColor: "#171717",
// 	},
// });

import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ImageBackground,
} from "react-native";
import { Camera } from "expo-camera";
const tag = "[CAMERA]";
export default function CameraScreen() {
	const [hasPermission, setHasPermission] = useState(null);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [capturedImage, setCapturedImage] = useState(null);
	const [startOver, setStartOver] = useState(true);
	const [type, setType] = useState(Camera.Constants.Type.back);
	let camera;
	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);
	const __closeCamera = () => {
		setStartOver(true);
	};
	const __takePicture = async () => {
		if (!camera) return;
		const photo = await camera.takePictureAsync();
		console.log(photo);
		setPreviewVisible(true);
		setCapturedImage(photo);
	};
	const __savePhoto = async () => {};
	return (
		<View
			style={{
				flex: 1,
			}}
		>
			{startOver ? (
				<View
					style={{
						flex: 1,
						backgroundColor: "#fff",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<TouchableOpacity
						onPress={() => setStartOver(false)}
						style={{
							width: 130,
							borderRadius: 4,
							backgroundColor: "#14274e",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
							height: 40,
						}}
					>
						<Text
							style={{
								color: "#fff",
								fontWeight: "bold",
								textAlign: "center",
							}}
						>
							Take picture
						</Text>
					</TouchableOpacity>
				</View>
			) : (
				<View
					style={{
						flex: 1,
					}}
				>
					{previewVisible ? (
						<ImageBackground
							source={{ uri: capturedImage && capturedImage.uri }}
							style={{
								flex: 1,
							}}
						>
							<View
								style={{
									flex: 1,
									flexDirection: "column",
									padding: 15,
									justifyContent: "flex-end",
								}}
							>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
									}}
								>
									<TouchableOpacity
										onPress={() => setPreviewVisible(false)}
										style={{
											width: 130,
											height: 40,

											alignItems: "center",
											borderRadius: 4,
										}}
									>
										<Text
											style={{
												color: "#fff",
												fontSize: 20,
											}}
										>
											Re-take
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={__savePhoto}
										style={{
											width: 130,
											height: 40,

											alignItems: "center",
											borderRadius: 4,
										}}
									>
										<Text
											style={{
												color: "#fff",
												fontSize: 20,
											}}
										>
											save photo
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</ImageBackground>
					) : (
						<Camera
							style={{ flex: 1 }}
							type={type}
							ref={(r) => {
								camera = r;
							}}
						>
							<View
								style={{
									flex: 1,
									backgroundColor: "transparent",
									flexDirection: "row",
								}}
							>
								<View
									style={{
										position: "absolute",
										top: "5%",
										right: "5%",
									}}
								>
									<TouchableOpacity onPress={__closeCamera}>
										<Text
											style={{
												color: "#fff",
												fontSize: 20,
											}}
										>
											X
										</Text>
									</TouchableOpacity>
								</View>
								<TouchableOpacity
									style={{
										position: "absolute",
										top: "5%",
										left: "5%",
									}}
									onPress={() => {
										setType(
											type === Camera.Constants.Type.back
												? Camera.Constants.Type.front
												: Camera.Constants.Type.back
										);
									}}
								>
									<Text
										style={{ fontSize: 18, marginBottom: 10, color: "white" }}
									>
										{" "}
										Flip{" "}
									</Text>
								</TouchableOpacity>
								<View
									style={{
										position: "absolute",
										bottom: 0,
										flexDirection: "row",
										flex: 1,
										width: "100%",
										padding: 20,
										justifyContent: "space-between",
									}}
								>
									<View
										style={{
											alignSelf: "center",
											flex: 1,
											alignItems: "center",
										}}
									>
										<TouchableOpacity
											onPress={__takePicture}
											style={{
												width: 70,
												height: 70,
												bottom: 0,
												borderRadius: 50,
												backgroundColor: "#fff",
											}}
										/>
									</View>
								</View>
							</View>
						</Camera>
					)}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
		alignItems: "center",
		justifyContent: "center",
	},
});

// export default CameraCompo;
