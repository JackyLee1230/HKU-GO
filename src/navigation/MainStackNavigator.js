import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
		</Stack.Navigator>
	);
};

export default MainStackNavigator;
