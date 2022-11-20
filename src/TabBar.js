import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React from "react";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HomeStackNavigator from "./navigation/HomeStackNavigator";
import MapStackNavigator from "./navigation/MapStackNavigator";
import ProfileStackNavigator from "./navigation/ProfileStackNavigator";
import SocStackNavigator from "./navigation/SocStackNavigator";
import EventRegisterStackNavigator from "./navigation/EventRegisterStackNavigator";
import ChatRoomStackNavigator from "./navigation/ChatRoomStackNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Tab = createMaterialBottomTabNavigator();

const styles = StyleSheet.create({
	bar: {
		borderTopWidth: 1,
		elevation: 0,
	},
});

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
	  	name="HomeStackNavigator" 
		component={HomeStackNavigator} 
		options={{
			headerShown: false,
		}}
	/>
	<HomeStack.Screen 
	  	name="ChatRoomStack" 
		component={ChatRoomStackNavigator} 
		options={{
			headerShown: false,
		}}
	/>
    <HomeStack.Screen 
	  	name="SocStack" 
		component={SocStackNavigator} 
		options={{
			headerShown: false,
		}}
	/>
	<HomeStack.Screen 
	  	name="EventsStack" 
		component={EventRegisterStackNavigator} 
		options={{
			headerShown: false,
		}}
	/>
    </HomeStack.Navigator>
  );
}

export default function TabBar() {
	return (
		<Tab.Navigator
			activeColor="#47b5ff"
			inactiveColor="#666666"
			barStyle={{
				backgroundColor: "white",
			}}
			screenOptions={{ tabBarHideOnKeyboard: true }}
		>
			<Tab.Screen
				name="HomeStack"
				component={HomeStackScreen}
				options={{
					title: "Home",
					tabBarIcon: ({ focused, color }) => (
						<Icon
							name={focused ? "home" : "home-outline"}
							color={color}
							size={24}
						/>
					),
					tabBarColor: "#47b5ff",
				}}
			/>

			<Tab.Screen
				name="MapStack"
				component={MapStackNavigator}
				options={{
					title: "Map",
					headerStyle: {
						backgroundColor: "#f4511e",
					},
					headerTintColor: "#fff",
					headerTitleStyle: {
						fontWeight: "bold",
					},
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
				component={ProfileStackNavigator}
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
