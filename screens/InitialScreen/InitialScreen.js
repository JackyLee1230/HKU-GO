import React from "react";
import { ScrollView, View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

const InitialScreen = ({ navigation }) => {
    
    return (
        <LinearGradient
            colors={['#0098FF', '#DFF6FF']}
            style={styles.linearGradient}
        >
            <ScrollView
                contentContainerStyle={styles.mainFrame}
            >
                <View
                    style={styles.promoteContainer}
                >
                    <Image
                        source={require("../../assets/promotion.jpg")}
                        style={styles.promotionImage}
                        resizeMode="cover"
                    />
                </View>

                <ImageBackground
                    source={require("../../assets/HKUBackground.jpg")}
                    style={styles.infoContainer}
                    imageStyle={styles.infoImage}
                    resizeMode="cover"
                >
                    <View
                        style={styles.infoInsideContainer}
                    >
                        <View
                            style={styles.logoContainter}
                        >
                            <Image
                                source={require("../../assets/appLogo.png")}
                                style={styles.appLogo}
                                resizeMode="contain"
                            />
                        </View>
                        <View
                            style={styles.appTextContainter}
                        >
                            <Text
                                style={styles.infoText} 
                            >
                                An Interactive Guide To Exploring the HKU Campus
                            </Text>
                        </View>
                    </View>
                </ImageBackground>

                <TouchableOpacity 
                    activeOpacity={0.6}
                    style={{        
                        width: "100%",
                        marginTop: 20,
                    }}
                    onPress={() => {
                        navigation.navigate("Login");
                    }}
                >
                    <LinearGradient
                        start={{x: 0, y: 0}} 
                        end={{x: 1, y: 0}}
                        colors={['#F8C4B4', '#FF8787']}
                        style={styles.buttonContainer}
                    >
                        <Text style={styles.button}>SIGN IN</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                    activeOpacity={0.6}
                    style={{        
                        width: "100%",
                        marginTop: 20,
                    }}
                    onPress={() => {
                        navigation.navigate("Register");
                    }}
                >
                    <LinearGradient
                        start={{x: 0, y: 0}} 
                        end={{x: 1, y: 0}}
                        colors={['#B6E388', '#7FB77E']}
                        style={styles.buttonContainer}
                    >
                        <Text style={styles.button}>REGISTER</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
	);
};

export default InitialScreen;
