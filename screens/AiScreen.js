import { Camera, CameraType } from "expo-camera";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Image,

} from "react-native";
import { FAB, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const AiScreen = ({ navigation, route }) => {
    const photo = route.params.photo;
    console.log(photo)
    return (
        <>
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    Success!
                </Text>
            </View>
        </>
    );

}

const styles = StyleSheet.create({
});



export default AiScreen;