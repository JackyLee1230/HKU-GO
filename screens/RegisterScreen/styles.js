import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    mainFrame: {
        flexDirection: "column",
        padding: 32,
        flex: 1,
    },
    welcomeMessage: {
        fontSize: 28,
        textAlign: "center",
        color: "#256D85",
        fontWeight: "700",
    },
    buttonContainer: {
        width: "100%",
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#171717',
    },
    button: {
        width: "100%",
        fontWeight: "500",
        fontSize: 18,
        textAlign: "center",
        color: '#fff',
    }, 
});

export default styles;
  