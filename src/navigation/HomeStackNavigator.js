import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../screens/HomeScreen/HomeScreen";
import NavBar from "../NavBar";

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
	return (
		<Stack.Navigator headerMode="screen" screenOptions={{ header: NavBar }}>
			<Stack.Screen 
				name="Home"
				component={HomeScreen}
				options={{
					title: "Home",
				}}
			/>
		</Stack.Navigator>
	);
};

export default HomeStackNavigator;
