import { View, Text, Button, Linking } from "react-native";
import React, { useState } from "react";

export default function EventCard({ ...props }) {
	const [expand, setExpand] = useState(false);

	return (
		<>
			<View
				key={props.event.name}
				style={{
					margin: 5,
					marginHorizontal: 32,
					padding: 15,
					backgroundColor: "#fff",
					borderTopLeftRadius: 16,
					borderBottomRightRadius: 4,
					borderTopRightRadius: 16,
					borderBottomLeftRadius: 4,
				}}
			>
				<Text
					style={{
						fontSize: 16,
						fontWeight: "bold",
					}}
				>
					{props.event.name} By {props.event.organiser}
				</Text>
				<Text
					style={{
						fontSize: 14,
						fontWeight: "bold",
					}}
				>
					{props.event.date} {props.event.time}
				</Text>
				<Text
					style={{
						fontSize: 14,
						fontWeight: "bold",
					}}
				>
					{props.event.location}
				</Text>
				<Text
					style={{
						fontSize: 14,
						fontWeight: "bold",
					}}
				>
					{props.event.description.length > 150
						? expand
							? props.event.description
							: props.event.description.substring(0, 150) + "..."
						: props.event.description}
				</Text>
				{props.event.description.length > 150 ? (
					<Button
						title="Expand"
						onPress={() =>
							setExpand((prev) => {
								return !prev;
							})
						}
					></Button>
				) : null}
				{props.event.link ? (
					<Button
						title="Register"
						onPress={() => {
							Linking.openURL(props.event.link);
						}}
					></Button>
				) : null}
			</View>
		</>
	);
}
