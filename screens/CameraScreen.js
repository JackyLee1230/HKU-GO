import { Camera, CameraType } from "expo-camera";
import { useState } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Dimensions,
	Image,

} from "react-native";
import { FAB, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";


const CameraCompo = ({ navigation }) => {
	const [type, setType] = useState(CameraType.back);
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const [photo, setPhoto] = useState(null)
	const [camera, setCamera] = useState(null)
	let photoDir = ''


	async function takePhoto() {
		const res = await camera.takePictureAsync(null);
		photoDir = res.uri
		setPhoto(res.uri);
		console.log('sdf', photo)

	}


	return (
		<>
			{!permission ? (
				<View>
					<Text>Loading</Text>
				</View>
			) : (
				<>
					{!permission.granted ? (
						<View style={styles.container}>
							<Text style={{ textAlign: "center" }}>
								Please Grant Permission To Use Your Phone's Camera
							</Text>
							<Button onPress={async () => {
								let res = await Camera.requestCameraPermissionsAsync();
								if (res.granted == true) {
									permission.granted = true;
								}
							}} title="grant permission" />
						</View>
					) : (
						<>
							{!photo ? (<View style={styles.containerStyle}>
								<Camera
									style={styles.fixedRatio}
									type={type}
									ratio={"16:9"}
									whiteBalance={900}
									ref={ref => setCamera(ref)}
								>
									<View >
										<FAB style={styles.photoBtn} onPress={takePhoto}></FAB>
									</View>



								</Camera>

							</View>) : (
								<View style={styles.containerStyle}>
									<Image
										style={styles.photoStyle}
										source={{
											uri: photo
										}}
									/>
									<View style={{flexDirection: "row"}}>

										<TouchableOpacity
											activeOpacity={0.6}
											style={{
												width: "43%",
												marginTop: Dimensions.get("window").height * 0.81,
												marginLeft: '2%',
												flex: '3',
											}}
											onPress={() => {
												setPhoto(null)
											}}
										>
											<LinearGradient
												start={{ x: 0, y: 0 }}
												end={{ x: 1, y: 0 }}
												colors={["#F8C4B4", "#FF8787"]}
												style={styles.buttonContainer}
											>
												<Text style={styles.button}>Retake</Text>
											</LinearGradient>
										</TouchableOpacity>
										<TouchableOpacity
											activeOpacity={0.6}
											style={{
												width: "43%",
												marginTop: Dimensions.get("window").height * 0.81,
												flex:' 3',
												marginLeft: '2%',
												marginRight: '2%',

											}}
											onPress={() => {
												navigation.navigate("Ai", {photo: photo});
											}}
										>
											<LinearGradient
												start={{ x: 0, y: 0 }}
												end={{ x: 1, y: 0 }}
												colors={["#F8C4B4", "#FF8787"]}
												style={styles.buttonContainer}
											>
												<Text style={styles.button}>Check</Text>
											</LinearGradient>
										</TouchableOpacity>

									</View>

								</View>

							)}
						</>

					)}
				</>
			)}
		</>
	);
}
const styles = StyleSheet.create({
	containerStyle: {
		flex: 1,
		flexDirection: "column",
	},
	fixedRatio: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
	photoBtn: {
		position: "absolute",

		left: Dimensions.get("window").width * 0.39,
		top: Dimensions.get("window").height * 0.8,
		backgroundColor: '#FFFFFF',
		borderRadius: 32,
		margin: 16,
		zIndex: 1,
	},
	photoStyle: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height * 0.8,
		resizeMode: 'stretch',
		position: "absolute",
	},
	bottomBarStyle: {

		backgroundColor: "#000000",

	},
	textSign: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#FF6347",
		top: Dimensions.get("window").height * 0.8,
	},
	button: {
		width: "100%",
		fontWeight: "500",
		fontSize: 18,
		textAlign: "center",
		color: '#fff',
	},
	buttonContainer: {
		width: "100%",
		paddingVertical: 12,
		borderRadius: 8,
		elevation: 1,
		shadowColor: '#171717',


	},

});

export default CameraCompo;
