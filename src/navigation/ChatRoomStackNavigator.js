import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatRoomScreen from "../../screens/ChatRoomScreen";

const Stack = createNativeStackNavigator();

const ChatRoomStackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="ChatRoom"
				component={ChatRoomScreen}
				options={{
					title: "Chat Room",
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

export default ChatRoomStackNavigator;
