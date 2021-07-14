import React, {useState} from 'react'
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {withTheme} from "react-native-paper"

interface RoundButtonProperties {
    theme: Theme
    icon?: string
    containerSize?: number
    iconSize?: number,
    style?: StyleProp<ViewStyle>
    onPress: () => void
    color?: string
}

const RoundButtonComponent: React.FC<RoundButtonProperties> = ({
                                                                   theme,
                                                                   icon,
                                                                   containerSize = 36,
                                                                   iconSize = 24,
                                                                   style = {},
                                                                   onPress,
                                                                   color = theme.colors.accent
                                                               }) => {
    const [active, setActive] = useState(false)

    const styles = StyleSheet.create({
        roundButton: {
            backgroundColor: active ? 'rgba(25,118,210,0.25)' : theme.colors.primary,
            height: icon ? containerSize : 0,
            width: containerSize,
            borderRadius: containerSize / 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }
    })

    const startTouch = () => {
        setActive(true)
    }

    const endTouch = () => {
        setActive(false)
        onPress()
    }

    return (
        <View
            style={{...styles.roundButton, ...style as {}}}
            onTouchStart={startTouch}
            onTouchEnd={endTouch}
        >
            <MaterialCommunityIcons name={icon}
                                    color={color}
                                    size={iconSize}
            />
        </View>
    )
}

export default withTheme(RoundButtonComponent)
