import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox } from "react-native";
import RootStackNavigator from "./src/navigation/RootStackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import TabBar from "./src/TabBar";
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
	LogBox.ignoreLogs([
		"Warning: Async Storage has been extracted from react-native core",
	]);
	return (
		<PaperProvider>
			<SafeAreaProvider>
				<NavigationContainer>
					<RootStackNavigator />
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
