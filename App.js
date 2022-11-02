import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./StackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navbar from "./src/Navbar";
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
	return (
		<PaperProvider theme={theme}>
			<SafeAreaProvider>
				<NavigationContainer>
					<StackNavigator />
				</NavigationContainer>
			</SafeAreaProvider>
		</PaperProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
