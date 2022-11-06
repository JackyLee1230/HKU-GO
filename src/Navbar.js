import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import MapScreen from "../screens/MapScreen";
import SocScreen from "../screens/SocScreen";
import RegisterScreen from "../screens/RegisterScreen/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SocDetailScreen from "../screens/SocDetailScreen";

const Tab = createMaterialBottomTabNavigator();

const styles = StyleSheet.create({
	bar: {
		borderTopWidth: 1,
		elevation: 0,
	},
});

export default function Navbar() {
	return (
		<Tab.Navigator>
			<Tab.Screen
				name="HomeStack"
				component={HomeScreen}
				options={{
					title: "Home",
					tabBarIcon: ({ focused, color }) => (
						<Icon
							name={focused ? "home" : "home-outline"}
							color={color}
							size={24}
						/>
					),
				}}
			/>

			<Tab.Screen
				name="DiscussionStack"
				component={MapScreen}
				options={{
					title: "Map",
					tabBarIcon: ({ focused, color }) => (
						<Icon
							name={focused ? "map-marker" : "map-marker-outline"}
							color={color}
							size={24}
						/>
					),
				}}
			/>

			<Tab.Screen
				name="ProfileStack"
				component={ProfileScreen}
				options={{
					title: "Profile",
					tabBarIcon: ({ focused, color }) => (
						<Icon
							name={focused ? "account-circle" : "account-circle-outline"}
							color={color}
							size={24}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
}
