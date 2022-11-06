import { View, Text, Button } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = ({ navigation }) => {
	var user = auth?.currentUser;

	const signOutUser = async () => {
		await signOut(auth);
		user = null;
		navigation.reset({
			index: 0,
			routes: [{ name: "Initial" }],
		});
	};

	return (
		<SafeAreaView>
			<View>
				<Text>{user ? user?.email : "NULL"}</Text>
				<Text>HKU GO HomeScreen</Text>
				<Button
					title="Move to Map Screen"
					onPress={() => {
						navigation.navigate("Map");
					}}
				></Button>
				<Button
					title="Move to Soc Screen"
					onPress={() => {
						navigation.navigate("Soc");
					}}
				></Button>
				{!user && (
					<Button
						title="Move to Register Screen"
						onPress={() => {
							navigation.navigate("Register");
						}}
					></Button>
				)}
				{!user && (
					<Button
						title="Move to Login Screen"
						onPress={() => {
							navigation.navigate("Login");
						}}
					></Button>
				)}
				<Button
					title="Move to Profile Screen"
					onPress={() => {
						navigation.navigate("Profile");
					}}
				></Button>
				<Button
					title="Move to Events Screen"
					onPress={() => {
						navigation.navigate("Events");
					}}
				></Button>
				{user && user?.uid ? (
					<Button
						title="signout"
						onPress={() => {
							signOutUser();
						}}
					></Button>
				) : null}
			</View>
		</SafeAreaView>
	);
};

export default HomeScreen;
