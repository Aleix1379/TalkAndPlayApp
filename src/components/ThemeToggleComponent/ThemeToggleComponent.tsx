import React from 'react';
import {StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {Switch, Text, withTheme} from "react-native-paper";

interface ThemeToggleProperties {
    theme: Theme
    value: boolean
    onPress: Function
}

const ThemeToggleComponent: React.FC<ThemeToggleProperties> = ({theme, value, onPress}) => {
    const styles = StyleSheet.create({
        themeToggle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.colors.surface,
            height: 50,
            paddingVertical: 6,
            paddingLeft: 8,
            paddingRight: 32,
            borderRadius: 20
        },
        text: {
            color: theme.colors.text
        }
    });

    return (
        <View style={styles.themeToggle} onTouchEnd={() => onPress()}>
            <Switch value={value}/>
            <Text style={styles.text}>Dark Theme</Text>
        </View>
    )
}

export default withTheme(ThemeToggleComponent)
