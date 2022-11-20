import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SocScreen from "../../screens/SocScreen";
import SocDetailScreen from "../../screens/SocDetailScreen";

const Stack = createNativeStackNavigator();

const SocStackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Soc"
				component={SocScreen}
				options={{
					title: "HKU Societies",
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
				name="SocDetail"
				component={SocDetailScreen}
				options={{
					title: "Societies Detail",
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

export default SocStackNavigator;
