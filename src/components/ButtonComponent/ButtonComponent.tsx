import React, {useEffect, useState} from 'react'
import {Text, withTheme} from "react-native-paper"
import {Animated, StyleProp, StyleSheet, View, ViewStyle} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

interface ButtonProperties {
    label: string
    icon?: string
    onPress: () => void
    theme: Theme
    style?: StyleProp<ViewStyle>
    disabled?: boolean
    fontSize?: number
    iconSize?: number
}

const ButtonComponent: React.FC<ButtonProperties> = ({
                                                         label,
                                                         icon,
                                                         onPress,
                                                         theme,
                                                         style,
                                                         disabled = false,
                                                         fontSize = 20,
                                                         iconSize = 25
                                                     }) => {
    const [isPressed, setIsPressed] = useState(false)
    const styles = StyleSheet.create({
        label: {
            fontSize: fontSize,
            color: disabled ? '#333333' : '#e0e0e0'
        }
    })

    const [rotationAnimation] = useState(new Animated.Value(0))

    const startAnimation = () => {
        Animated.timing(rotationAnimation, {
            useNativeDriver: true,
            toValue: icon === 'cog' ? 1 : 0,
            duration: 5000,
        }).start()
    }

    const spin = rotationAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '2160deg']
    })

    const animatedStyles = {
        rotation: {
            transform: [{rotate: spin}]
        }
    }

    const onTouchStart = () => {
        if (!disabled) {
            setIsPressed(true)
        }
    }

    const onTouchEnd = () => {
        if (!disabled) {
            setTimeout(() => {
                setIsPressed(false)
                onPress()
            }, 100)
        }
    }

    const getStyles = (): StyleProp<ViewStyle> => {
        let item: StyleProp<ViewStyle> = {
            height: 50,
            backgroundColor: disabled ? '#c1c1c1' : theme.colors.onSurface,

            borderRadius: 20,
            shadowColor: theme.colors.primary,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        }

        if (!isPressed) {
            item = {
                ...item, shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.5,
                shadowRadius: 3.84,
                elevation: disabled ? 0 : 8,
                backgroundColor: disabled ? 'rgba(110,174,255,0.2)' : theme.colors.accent,
            }
        }

        return item
        /*        return {
                    ...item, ...style as {}
                }*/
    }

    useEffect(() => startAnimation(), [])

    return (
        <View style={[getStyles(), style]}
              onTouchStart={() => onTouchStart()}
              onTouchEnd={() => onTouchEnd()}>
            {icon && <Animated.View style={[animatedStyles.rotation, {marginRight: 12}]}>
                <MaterialCommunityIcons name={icon} color={disabled ? '#333333' : '#e0e0e0'} size={iconSize}/>
            </Animated.View>}
            <Text style={styles.label}>{label}</Text>
        </View>
    )
}

export default withTheme(ButtonComponent)
