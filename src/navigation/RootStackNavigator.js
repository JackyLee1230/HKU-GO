import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainStackNavigator from "./MainStackNavigator";
import BeforeLoginStackNavigator from "./BeforeLoginStackNavigator";

const Stack = createNativeStackNavigator();

const RootStackNavigator = () => {
	return (
		<Stack.Navigator>
            <Stack.Screen
				name="WithoutTab"
				component={BeforeLoginStackNavigator}
                options={{
					headerShown: false,
				}}
			/>
            <Stack.Screen
				name="WithTab"
				component={MainStackNavigator}
                options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
};

export default RootStackNavigator;
