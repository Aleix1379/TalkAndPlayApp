import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {withTheme} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface PageGoButtonProperties {
    theme: Theme
    onPress: () => void
    icon: string
    style?: StyleProp<ViewStyle>
}

const PageGoButtonComponent: React.FC<PageGoButtonProperties> = ({
                                                                     theme,
                                                                     onPress,
                                                                     icon,
                                                                     style = {}
                                                                 }) => {
    const styles = StyleSheet.create({
        pageGoButton: {
            backgroundColor: theme.colors.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 28,
            width: 28,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            borderRadius: 4,
        }
    });

    return (
        <View
            style={[styles.pageGoButton, style]}
            onTouchEnd={() => onPress()}
        >
            <MaterialCommunityIcons name={icon}
                                    color={theme.colors.text}
                                    size={15}
            />
        </View>
    )
}

export default withTheme(PageGoButtonComponent)
