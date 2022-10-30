import { View, Text, Button } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
	return (
		<View>
			<Text>HKU GO HomeScreen</Text>
			<Button
				title="Move to Map Screen"
				onPress={() => {
					navigation.navigate("Map");
				}}
			></Button>
		</View>
	);
};

export default HomeScreen;
