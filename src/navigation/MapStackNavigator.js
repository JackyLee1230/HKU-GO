import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "../../screens/MapScreen";
import MapHuntScreen from "../../screens/MapHuntScreen";
import CameraScreen from "../../screens/CameraScreen";
import NavBar from "../NavBar";

const Stack = createNativeStackNavigator();

const MapStackNavigator = () => {
	return (
		<Stack.Navigator headerMode="screen">
			<Stack.Screen
				name="Map"
				component={MapScreen}
				options={{
					title: "Map",
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="MapHunt"
				component={MapHuntScreen}
				options={{
					title: "Map Hunt",
					headerStyle: {
						backgroundColor: '#47B5FF',
					},
					headerTintColor: '#fff',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
				}}
			/>
			<Stack.Screen
				name="Camera"
				component={CameraScreen}
				options={{
					title: "Camera",
					headerStyle: {
						backgroundColor: '#47B5FF',
					},
					headerTintColor: '#fff',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
				}}
			/>
		</Stack.Navigator>
	);
};

export default MapStackNavigator;
