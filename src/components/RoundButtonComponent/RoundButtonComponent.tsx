import React, {useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {withTheme} from "react-native-paper";

interface RoundButtonProperties {
    theme: Theme
    icon?: string
    iconSize?: number
    style?: StyleProp<ViewStyle>
    onPress: () => void
}

const RoundButtonComponent: React.FC<RoundButtonProperties> = ({
                                                                   theme,
                                                                   icon,
                                                                   iconSize = 36,
                                                                   style = {},
                                                                   onPress
                                                               }) => {
    const [active, setActive] = useState(false)

    const styles = StyleSheet.create({
        roundButton: {
            backgroundColor: active ? 'rgba(25,118,210,0.25)' : theme.colors.surface,
            height: icon ? iconSize : 0,
            width: iconSize,
            borderRadius: iconSize / 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }
    });

    const startTouch = () => {
        setActive(true)
        setTimeout(() => setActive(false), 200)
    }

    return (
        <View
            style={{...styles.roundButton, ...style as {}}}
            onTouchStart={() => startTouch()}
            onTouchEnd={() => onPress()}
        >
            <MaterialCommunityIcons name={icon}
                                    color={theme.colors.accent}
                                    size={24}
            />
        </View>
    )
}

export default withTheme(RoundButtonComponent)
