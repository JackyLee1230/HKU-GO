import { View, Text, Button } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = ({ navigation }) => {
	return (
		<SafeAreaView>
			<View>
				<Text>{auth.currentUser ? auth.currentUser.email : "NULL"}</Text>
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
				<Button
					title="Move to Register Screen"
					onPress={() => {
						navigation.navigate("Register");
					}}
				></Button>
				<Button
					title="Move to Login Screen"
					onPress={() => {
						navigation.navigate("Login");
					}}
				></Button>
				<Button
					title="Move to Profile Screen"
					onPress={() => {
						navigation.navigate("Profile");
					}}
				></Button>
				{auth.currentUser && auth.currentUser.uid ? (
					<Button title="signout" onPress={() => signOut(auth)}></Button>
				) : null}
			</View>
		</SafeAreaView>
	);
};

export default HomeScreen;
