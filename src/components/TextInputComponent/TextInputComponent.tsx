import React, {useEffect, useState} from 'react'
import {Text, withTheme} from 'react-native-paper'
import {Animated, Easing, StyleProp, StyleSheet, TextInput, View, ViewStyle} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {ErrorType} from "../../utils/Validator/types"
import ErrorHelperComponent from "../ErrorHelperComponent";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface TextInputProperties {
    id: string
    label?: string
    value: string
    error?: ErrorType
    onChange?: (id: string, value: string) => void
    onBlur?: () => void
    password?: boolean
    theme: Theme
    style?: React.CSSProperties
    placeholder?: string
    multiLine?: boolean
    maxLength?: number
}

const TextInputComponent: React.FC<TextInputProperties> = ({
                                                               id,
                                                               label,
                                                               value,
                                                               error,
                                                               onChange,
                                                               password = false,
                                                               theme,
                                                               style,
                                                               placeholder,
                                                               multiLine = false,
                                                               maxLength,
                                                               onBlur
                                                           }) => {
    const [showText, setShowText] = useState(!password)
    const [isFocused, setIsFocused] = useState(false)
    const [transformAnimation] = useState(new Animated.Value(0))

    const isInputFilled = () => isFocused || value.length > 0

    const translation = transformAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [35, 0]
    })

    const animatedStyles = {
        translate: {
            transform: [{translateY: translation}]
        }
    }

    const startAnimation = (focus: boolean = false) => {
        Animated.timing(transformAnimation, {
            useNativeDriver: true,
            toValue: focus || isInputFilled() ? 1 : 0,
            duration: 1000,
            easing: Easing.in(Easing.bounce)
        }).start()
    }

    const showErrorMessage = (): boolean => (error?.touched! && error.message.length > 0) && !isFocused
    
    const styles = StyleSheet.create({
        label: {
            position: "absolute",
            top: -24, //isInputFilled() ? -24 : 10,
            paddingHorizontal: 4,
            marginLeft: 4,
            zIndex: 10
        },
        input: {
            paddingHorizontal: 10,
            paddingVertical: 8,
            paddingBottom: 4,
            borderRadius: 3,
            paddingRight: password ? 40 : 0,
            color: theme.colors.text,
            backgroundColor: 'rgba(20,20,20, 0.6)',
            lineHeight: 15
        },
        icon: {
            position: "absolute",
            top: 8,
            right: 12
        }
    })

    const toggleFocus = (focus: boolean) => {
        setIsFocused(focus)
        if (!focus) {
            onBlur && onBlur()
        }
    }

    const getStyles = (): StyleProp<ViewStyle> => {
        let item: StyleProp<ViewStyle> = {
            marginTop: label ? 10 : 0,
            display: "flex",
            borderWidth: 2,
            borderRadius: 3,
            borderColor: theme?.colors.background,
            backgroundColor: 'rgba(20,20,20, 0.6)'
        }

        // @ts-ignore
        if (style) {
            Object.keys(style).forEach((key: string) => {
                // @ts-ignore
                item[key] = style[key]
            })
        }

        if (isFocused) {
            item.borderColor = theme?.colors.accent
        }

        return item
    }

    useEffect(() => {
        startAnimation(isFocused)
    }, [value, isFocused])

    const toggleShowText = () => {
        setShowText(!showText)
    }

    return (
        <View style={getStyles()}>
            {
                label &&
                <Animated.View style={[styles.label, animatedStyles.translate]}>
                    <Text>{label}</Text>
                </Animated.View>
            }
            <TextInput style={styles.input}
                       secureTextEntry={!showText}
                       value={value}
                       placeholder={placeholder}
                       multiline={multiLine}
                       maxLength={maxLength}
                       placeholderTextColor={theme.colors.text}
                       onChangeText={(text: string) => onChange && onChange(id, text)}
                       editable={!!onChange}
                       onBlur={() => toggleFocus(false)}
                       onFocus={() => toggleFocus(true)}
            />

            {password &&
            <View style={styles.icon}
                  onTouchEnd={() => toggleShowText()}
            >
                <MaterialCommunityIcons
                    name={showText ? 'lock' : 'eye'}
                    color={theme.colors.text}
                    size={22}
                />
            </View>}

            <ErrorHelperComponent visible={showErrorMessage()} message={`😿   ${error?.message}`}/>
        </View>
    )
}

export default withTheme(TextInputComponent)
