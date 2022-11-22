import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../screens/ProfileScreen";
import NavBar from "../NavBar";

const Stack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
	return (
		<Stack.Navigator headerMode="screen" screenOptions={{ header: NavBar }}>
			<Stack.Screen 
				name="Profile"
				component={ProfileScreen}
				options={{
					title: "Profile",
				}}
			/>
		</Stack.Navigator>
	);
};

export default ProfileStackNavigator;
