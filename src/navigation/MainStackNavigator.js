import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../screens/HomeScreen/HomeScreen";
import MapScreen from "../../screens/MapScreen";
import SocScreen from "../../screens/SocScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import SocDetailScreen from "../../screens/SocDetailScreen";
import EventsScreen from "../../screens/EventsScreen";
import TabBar from "../TabBar";

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="TabBar"
				options={{
					headerShown: false,
				}}
				component={TabBar}
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
				name="Soc"
				component={SocScreen}
				options={{
					title: "HKU Societies",
				}}
			/>
			<Stack.Screen
				name="Profile"
				component={ProfileScreen}
				options={{
					title: "Your HKU Go Profile",
				}}
			/>
			<Stack.Screen
				name="SocDetail"
				component={SocDetailScreen}
				options={{
					title: "HKU Societies",
				}}
			/>
			<Stack.Screen
				name="Events"
				component={EventsScreen}
				options={{
					title: "HKU InfoDay Events",
				}}
			/>
			{/* <TabBar /> */}
		</Stack.Navigator>
	);
};

export default MainStackNavigator;
