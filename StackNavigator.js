import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import MapScreen from "./screens/MapScreen";
import SocScreen from "./screens/SocScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SocDetailScreen from "./screens/SocDetailScreen";
import Navbar from "./src/Navbar";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Home" component={HomeScreen} />
			<Stack.Screen name="Map" component={MapScreen} />
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Soc" component={SocScreen} />
			<Stack.Screen name="Register" component={RegisterScreen} />
			<Stack.Screen name="Profile" component={ProfileScreen} />
			<Stack.Screen name="SocDetail" component={SocDetailScreen} />
			<Navbar />
		</Stack.Navigator>
	);
};

export default StackNavigator;
