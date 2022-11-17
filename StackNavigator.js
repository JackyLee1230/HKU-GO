import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import InitialScreen from "./screens/InitialScreen/InitialScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import MapScreen from "./screens/MapScreen";
import SocScreen from "./screens/SocScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SocDetailScreen from "./screens/SocDetailScreen";
import MyNavbar from "./src/Navbar";
import MapHuntScreen from "./screens/MapHuntScreen.js";
import CameraScreen from './screens/CameraScreen.js'
import AiScreen from './screens/AiScreen.js'

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Initial"
				options={{
					headerShown: false,
				}}
				component={InitialScreen}
			/>
			<Stack.Screen
				name="MyNavbar"
				options={{
					headerShown: false,
				}}
				component={MyNavbar}
			/>
			<Stack.Screen
				name="Home"
				component={HomeScreen}
				options={{ title: "Home Page" }}
			/>
			<Stack.Screen
				name="Map"
				component={MapScreen}
				options={{
					title: "HKU Map",
					headerStyle: {
						backgroundColor: "#f4511e",
					},
					headerTintColor: "#fff",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
			<Stack.Screen
				name="Login"
				component={LoginScreen}
				options={{ title: "Sign Up / Login In" }}
			/>
			<Stack.Screen name="Soc" component={SocScreen} />
			<Stack.Screen name="Register" component={RegisterScreen} />
			<Stack.Screen name="Profile" component={ProfileScreen} />
			<Stack.Screen name="SocDetail" component={SocDetailScreen} />
			<Stack.Screen name="Camera" component={CameraScreen} options={{
				title: "HKU Hunt",
				headerStyle: {
					backgroundColor: "#f4511e",
				},
				headerTintColor: "#fff",
				headerTitleStyle: {
					fontWeight: "bold",
				},
			}} />
			<Stack.Screen name="MapHunt" component={MapHuntScreen}
				options={{
					title: "HKU Hunt",
					headerStyle: {
						backgroundColor: "#f4511e",
					},
					headerTintColor: "#fff",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}} />
			<Stack.Screen name="Ai" component={AiScreen}
				options={{
					title: "Result",
					headerStyle: {
						backgroundColor: "#f4511e",
					},
					headerTintColor: "#fff",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}} />
			{/* <Navbar /> */}
		</Stack.Navigator>
	);
};

export default StackNavigator;