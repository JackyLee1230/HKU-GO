import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    mainFrame: {
        flexDirection: "column",
        padding: 32,
    },
    promoteContainer: {
        height: 200,
        width: "100%",
        borderRadius: 8,
        borderTopLeftRadius: 32,
        backgroundColor: "white",
        flexDirection: "column",
        alignItems: "center",
    },
    promotionImage: {
        height: 200,
        width: "100%",
        borderRadius: 8,
        borderTopLeftRadius: 32,
    },  
    infoContainer: {
        width: "100%",
        marginTop: 12,
        borderRadius: 8,
        borderBottomRightRadius: 32,
    },
    infoInsideContainer: {
        width: "100%",
        borderRadius: 8,
        borderBottomRightRadius: 32,
        flexDirection: "column",
        paddingHorizontal: 16,
        paddingVertical: 24,  
    },
    infoImage: {
        borderRadius: 8,
        borderBottomRightRadius: 32,
    },
    logoContainter: {
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        width: "100%",
        backgroundColor: 'rgba(223, 246, 255, 0.8)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 6,
        elevation: 10,
        shadowColor: '#171717',
    }, 
    appLogo: {
        height: 194.5,
        width: 242,
    }, 
    appTextContainter: {
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        width: "100%",
        backgroundColor: 'rgba(223, 246, 255, 0.8)',
        borderRadius: 12,
        marginTop: 24,
        elevation: 10,
        shadowColor: '#171717',
    }, 
    infoText: {
        fontSize: 20,
        fontWeight: "500",
        textAlign: "center",
        color: "#256D85",
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
  