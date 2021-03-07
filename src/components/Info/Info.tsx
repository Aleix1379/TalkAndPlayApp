import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {Text} from 'react-native-paper';
import {Theme} from "react-native-paper/lib/typescript/types";

interface InfoProperties {
    label: string
    value: string
    theme: Theme
    style: StyleProp<ViewStyle>
}

const Info: React.FC<InfoProperties> = ({style, theme, label, value}) => {

    const getStyles = (): StyleProp<ViewStyle> => {
        const item: StyleProp<ViewStyle> = {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: theme.colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderRadius: 4,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        };

        return {
            ...item, ...style as {}
        };
    }

    return (
        <View style={getStyles()}>
            <Text>{label}</Text>
            <Text>{value}</Text>
        </View>
    )
}

export default Info;
