import { View, Text, Button } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const ProfileScreen = ({ navigation }) => {
	return (
		<View>
			<Text>{auth.currentUser ? auth.currentUser.email : "NULL"}</Text>
			<Text>{auth.currentUser.displayName}</Text>
			<Text>{auth.currentUser.photoURL}</Text>
			<Text>{auth.currentUser.name}</Text>
		</View>
	);
};

export default ProfileScreen;
