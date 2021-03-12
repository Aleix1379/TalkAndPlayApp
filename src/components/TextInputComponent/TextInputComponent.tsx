import React, {useEffect, useState} from 'react'
import {Text, withTheme} from 'react-native-paper'
import {Animated, Easing, StyleProp, StyleSheet, TextInput, View, ViewStyle} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {ErrorType} from "../../utils/Validator/types"
import ErrorHelperComponent from "../ErrorHelperComponent";

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


    const styles = StyleSheet.create({
        label: {
            position: "absolute",
            top: -24, //isInputFilled() ? -24 : 10,
            paddingHorizontal: 4,
            color: theme.colors.text,
            marginLeft: 4,
            zIndex: 10
        },
        input: {
            paddingHorizontal: 10,
            paddingVertical: 8,
            paddingBottom: 4,
            borderRadius: 3,
            color: theme.colors.text,
            backgroundColor: theme.colors.primary
        }
    })

    const showErrorMessage = (): boolean => (error?.touched! && error.message.length > 0) && !isFocused

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
            backgroundColor: theme.colors.primary
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

    return (
        <View style={getStyles()}>
            {
                label &&
                <Animated.View style={[styles.label, animatedStyles.translate]}>
                    <Text>{label}</Text>
                </Animated.View>
            }
            <TextInput style={styles.input}
                       secureTextEntry={password}
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

            <ErrorHelperComponent visible={showErrorMessage()} message={`😿   ${error?.message}`}/>
        </View>
    )
}

export default withTheme(TextInputComponent)
