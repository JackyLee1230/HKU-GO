import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox } from "react-native";
import StackNavigator from "./StackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navbar from "./src/Navbar";
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
	LogBox.ignoreLogs([
		"Warning: Async Storage has been extracted from react-native core",
	]);
	return (
		<PaperProvider>
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
