import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SocScreen from "../../screens/SocScreen";
import SocDetailScreen from "../../screens/SocDetailScreen";
import ChatRoomScreen from "../../screens/ChatRoomScreen";

const Stack = createNativeStackNavigator();

const SocStackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Soc"
				component={SocScreen}
				options={{
					title: "HKU Societies",
				}}
			/>
			<Stack.Screen
				name="SocDetail"
				component={SocDetailScreen}
				options={{
					title: "Societies Detail",
				}}
			/>
			<Stack.Screen
				name="ChatRoom"
				component={ChatRoomScreen}
				options={{
					title: "Chat Room",
				}}
			/>
		</Stack.Navigator>
	);
};

export default SocStackNavigator;
