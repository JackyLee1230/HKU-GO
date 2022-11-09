import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import InitialScreen from "../../screens/InitialScreen/InitialScreen";
import LoginScreen from "../../screens/LoginScreen/LoginScreen";
import RegisterScreen from "../../screens/RegisterScreen/RegisterScreen";

const Stack = createNativeStackNavigator();

const BeforeLoginStackNavigator = () => {
	return (
		<Stack.Navigator>
            <Stack.Screen
				name="Initial"
				component={InitialScreen}
                options={{
					headerShown: false,
				}}
			/>
            <Stack.Screen
				name="Login"
				component={LoginScreen}
				options={{ title: "Sign In" }}
			/>
            <Stack.Screen name="Register" component={RegisterScreen} />
		</Stack.Navigator>
	);
};

export default BeforeLoginStackNavigator;
