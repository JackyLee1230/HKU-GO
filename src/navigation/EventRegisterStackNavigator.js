import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EventsScreen from "../../screens/EventsScreen";

const Stack = createNativeStackNavigator();

const EventRegisterStackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen 
				name="Events"
				component={EventsScreen}
				options={{
					title: "HKU InfoDay Events",
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

export default EventRegisterStackNavigator;
