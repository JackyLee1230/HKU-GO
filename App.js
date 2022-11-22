import { StyleSheet, LogBox } from "react-native";
import RootStackNavigator from "./src/navigation/RootStackNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";

export default function App() {
	// LogBox.ignoreAllLogs();

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
