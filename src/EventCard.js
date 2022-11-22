import { View, Text, Button, Linking, TouchableOpacity } from "react-native";
import React, { useState } from "react";

export default function EventCard({ ...props }) {
	const [expand, setExpand] = useState(false);

	return (
		<>
			<View
				key={props.event.name}
				style={{
					margin: 12,
					marginHorizontal: 32,
					padding: 16,
					backgroundColor: "#fff",
					borderRadius: 4,
					borderColor: "#06283D",
					borderWidth: 1.5,
				}}
			>
				<Text
					style={{
						textAlign: "center",
						fontSize: 20,
						fontWeight: "600",
						color: "#111111",
						marginBottom: 8,
					}}
				>
					{props.event.name} By {props.event.organiser}
				</Text>
				<Text
					style={{
						textAlign: "right",
						fontSize: 14,
						fontWeight: "500",
						color: "#47B5FF",
						marginBottom: 8,
					}}
				>
					{props.event.date} {props.event.time}
				</Text>
				{props.event.location &&(
					<Text
						style={{
							textAlign: "right",
							fontSize: 14,
							fontWeight: "500",
							color: "#256D85",
							marginBottom: 8,
						}}
					>
						{props.event.location}
					</Text>
				)}
				<Text
					style={{
						textAlign: "justify",
						fontSize: 14,
						fontWeight: "400",
						color: "#256D85",
					}}
				>
					{props.event.description.length > 250
						? expand
							? props.event.description
							: props.event.description.substring(0, 250) + "..."
						: props.event.description}
				</Text>
				{props.event.description.length > 150 ? (
					<TouchableOpacity
						onPress={() => {
							setExpand((prev) => {
								return !prev;
							})
						}}
						style={{
							alignSelf: 'center', 
							borderRadius: 24,
							shadowOffset: { width: 0, height: 1 },
							shadowOpacity: 0.5,
							shadowRadius: 1,
							elevation: 1,
							shadowColor: "#171717",
							marginBottom: 8,
						}}
					>
						<View
							style={{
								backgroundColor: "#47B5FF",
								borderRadius: 24,
								paddingHorizontal: 12,
								paddingVertical: 8,
							}}
						>
							<Text
								style={{
									fontSize: 14,
									fontWeight: "500",
									color: "#fff",
								}}
							>
								{!expand ? "Expand" : "Collapse"}
							</Text>
						</View>
					</TouchableOpacity>
				) : null}
				{props.event.link ? (
					<TouchableOpacity
						onPress={() => {
							Linking.openURL(props.event.link);
						}}
						style={{
							borderRadius: 8,
							shadowOffset: { width: 0, height: 1 },
							shadowOpacity: 0.5,
							shadowRadius: 1,
							elevation: 1,
							shadowColor: "#171717",
							marginBottom: 8,
						}}
					>
						<View
							style={{
								backgroundColor: "#FF8787",
								borderRadius: 8,
								paddingHorizontal: 16,
								paddingVertical: 12,
							}}
						>
							<Text
								style={{
									textAlign: "center",
									fontSize: 18,
									fontWeight: "500",
									color: "#fff",
									textTransform: "uppercase",
								}}
							>
								register
							</Text>
						</View>
					</TouchableOpacity>
				) : null}
			</View>
		</>
	);
}
