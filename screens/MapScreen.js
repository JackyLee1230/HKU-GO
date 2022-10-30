import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";

const MapScreen = ({ navigation }) => {
	const [region, setRegion] = useState({
		latitude: 22.28333,
		longitude: 114.13643,
		latitudeDelta: 0.00922,
		longitudeDelta: 0.00421,
	});

	let markers = [
		{
			latitude: 22.283284854186324,
			longitude: 114.13772673346415,
			title: "Library",
			subtitle: "HKU",
			description: "This is the HKU Library",
		},
	];

	function onRegionChange(region) {
		setRegion({ region });
		console.log(region);
	}

	return (
		<View style={styles.container}>
			<MapView
				region={region}
				onRegionChange={onRegionChange}
				style={styles.map}
			>
				{markers.map((marker, index) => (
					<Marker
						key={index}
						coordinate={{
							latitude: marker.latitude,
							longitude: marker.longitude,
						}}
						title={marker.title}
						// description={marker.description}
						// onCalloutPress={this.markerClick}
						// image={require("../assets/library.png")}>
					>
						<MapView.Callout tooltip style={styles.customView}>
							<View style={styles.calloutText}>
								<Text>
									{marker.title}
									{"\n"}
									{marker.description}
								</Text>
							</View>
						</MapView.Callout>
					</Marker>
				))}
			</MapView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	map: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
	calloutText: {
		width: Dimensions.get("window").width * 0.3,
		height: Dimensions.get("window").height * 0.3,
	},
});

export default MapScreen;
