import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapScreen from "../../screens/MapScreen";
import NavBar from "../NavBar";

const Stack = createNativeStackNavigator();

const MapStackNavigator = () => {
	return (
		<Stack.Navigator headerMode="screen" screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="Map"
				component={MapScreen}
				options={{
					title: "Map",
				}}
			/>
		</Stack.Navigator>
	);
};

export default MapStackNavigator;
