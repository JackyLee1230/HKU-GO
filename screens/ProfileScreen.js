import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Button,
	StyleSheet,
	ScrollView,
	RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
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

const ProfileScreen = ({ navigation }) => {
	const [points, setPoints] = useState();
	const [refreshing, setRefreshing] = React.useState(false);

	let getPoints = async () => {
		console.log("UID is " + auth.currentUser.uid);
		const q = query(
			collection(db, "points"),
			where("uid", "==", auth.currentUser.uid)
		);
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			let temp = doc.data();
			console.log(temp);
			setPoints(temp.points);
		});
	};
	const wait = (timeout) => {
		return new Promise((resolve) => setTimeout(resolve, timeout));
	};

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		getPoints();
		wait(2000).then(() => setRefreshing(false));
	}, []);

	useEffect(() => {
		getPoints();
	}, [navigation]);

	// console.log(auth.currentUser);
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<ScrollView
				style={styles.container}
				contentContainerStyle={{
					justifyContent: "center",
					alignItems: "center",
				}}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				showsVerticalScrollIndicator={false}
			>
				<Image
					style={styles.userImg}
					source={{
						uri: auth.currentUser
							? auth.currentUser.userImg ||
							  "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg"
							: "https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg",
					}}
				/>
				<Text style={styles.userName}>
					{auth.currentUser
						? auth.currentUser.displayName || "Anonymous"
						: "Anonymous"}
				</Text>
				<Text style={styles.aboutUser}>
					{auth.currentUser
						? auth.currentUser.about || "No details added."
						: ""}
				</Text>
				<Text style={styles.aboutUser}>
					{auth.currentUser ? auth.currentUser.uid || "Unknown UID." : ""}
				</Text>
				<Text style={styles.aboutUser}>{points ?? 0}</Text>
			</ScrollView>
		</SafeAreaView>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 20,
	},
	userImg: {
		height: 150,
		width: 150,
		borderRadius: 75,
	},
	userName: {
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 10,
		marginBottom: 10,
	},
	aboutUser: {
		fontSize: 12,
		fontWeight: "600",
		color: "#666",
		textAlign: "center",
		marginBottom: 10,
	},
	userBtnWrapper: {
		flexDirection: "row",
		justifyContent: "center",
		width: "100%",
		marginBottom: 10,
	},
	userBtn: {
		borderColor: "#2e64e5",
		borderWidth: 2,
		borderRadius: 3,
		paddingVertical: 8,
		paddingHorizontal: 12,
		marginHorizontal: 5,
	},
	userBtnTxt: {
		color: "#2e64e5",
	},
	userInfoWrapper: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
		marginVertical: 20,
	},
	userInfoItem: {
		justifyContent: "center",
	},
	userInfoTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 5,
		textAlign: "center",
	},
	userInfoSubTitle: {
		fontSize: 12,
		color: "#666",
		textAlign: "center",
	},
});
