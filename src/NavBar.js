import React from 'react';
import { Text, Image, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function NavBar(scene) {
    const { userName, userPoint, userAvatar } = scene.options;

    return (
        <Appbar.Header
            style={{
                backgroundColor: "#47B5FF",
                paddingHorizontal: 36,
            }}
        >
            <View
                stlye={{
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignItem: 'center',
                }}
            >
                <Text
                    style={{
                        fontWeight: "500",
                        fontSize: 24,
                        color: "#FFFFFF",
                    }}
                >
                    {userName}
                </Text>
            </View>

            <Icon name={"star"} color={"#FFFFFF"} size={24} style={{ marginLeft: 36,}} />
            <Text
                style={{
                    fontWeight: "500",
                    fontSize: 24,
                    color: "#FFFFFF",
                    marginLeft: 12,
                    marginRight: 36,
                }}
            >
                {userPoint}
            </Text>

            <View
                stlye={{
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignItem: 'center',
                }}
            >
                <Image
                    style={{
                        height: 48,
                        width: 48,
                        borderRadius: 100,
                    }}
                    source={{
                        uri: userAvatar,
                    }}
                />
            </View>
        </Appbar.Header>
    )
};
 