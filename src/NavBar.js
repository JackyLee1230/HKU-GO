import React from "react";
import { Text, Image, View, TouchableOpacity } from "react-native";
import { Appbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function NavBar(scene, navigation) {
	const { userName, userPoint, userAvatar } = scene.options;

	return (
		<Appbar.Header
			style={{
				backgroundColor: "#47B5FF",
				paddingHorizontal: 36,
				color: "white",
				justifyContent: "space-between",
			}}
		>
            <Appbar.Content title={userName} titleStyle={{color: "white", fontWeight: "700", fontSize: 20}} />
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<Icon
					name={"star"}
					color={"#FFFFFF"}
					size={20}
					style={{ marginLeft: 48 }}
				/>
				<Text
					style={{
						fontWeight: "500",
						fontSize: 20,
						color: "#FFFFFF",
						marginLeft: 12,
						marginRight: 24,
					}}
				>
					{userPoint}
				</Text>
			</View>

            {typeof userAvatar === 'function' ? userAvatar() : userAvatar}
		</Appbar.Header>
	);
}
