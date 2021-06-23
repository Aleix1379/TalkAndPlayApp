import React, {useEffect, useState} from 'react'
import {Text, withTheme} from 'react-native-paper'
import {Animated, Easing, StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {ErrorType} from "../../utils/Validator/types"
import ErrorHelperComponent from "../ErrorHelperComponent"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

interface TextInputProperties {
    id: string
    label?: string
    value: string
    error?: ErrorType
    onChange?: (id: string, value: string) => void
    onBlur?: () => void
    onFocus?: () => void
    password?: boolean
    theme: Theme
    style?: StyleProp<TextStyle>
    placeholder?: string
    multiLine?: boolean
    maxLength?: number
    setRef?: (ref: TextInput | null) => void
    onImageChange?: (event: any) => void
    borderColor?: string
    labelColor?: string
    textColor?: string
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
                                                               onBlur,
                                                               onFocus,
                                                               setRef,
                                                               onImageChange,
                                                               borderColor = theme?.colors.accent,
                                                               labelColor = theme?.colors.text,
                                                               textColor = theme?.colors.text,
                                                           }) => {
    let reference: TextInput | null = null
    const [showText, setShowText] = useState(!password)
    const [isFocused, setIsFocused] = useState(false)
    const [transformAnimation] = useState(new Animated.Value(0))

    const isInputFilled = () => isFocused || value && value.length > 0

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

    const showErrorMessage = (): boolean => (error?.touched! && error.message?.length > 0)

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
            color: textColor,
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
        } else {
            onFocus && onFocus()
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
            item.borderColor = borderColor
        }

        return item
    }

    useEffect(() => {
        startAnimation(isFocused)
    }, [value, isFocused])

    const toggleShowText = () => {
        setShowText(!showText)
    }

    const updateRed = (input: TextInput | null) => {
        reference = input
        setRef && setRef(input)
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <View style={getStyles()}>
            {
                label &&
                <Animated.View style={[styles.label, animatedStyles.translate]}>
                    <Text style={{color: labelColor}} onPress={() => reference?.focus()}>{label}</Text>
                </Animated.View>
            }
            <TextInput
                ref={(input: TextInput | null) => updateRed(input)}
                style={styles.input}
                secureTextEntry={!showText}
                value={value}
                placeholder={placeholder}
                multiline={multiLine}
                maxLength={maxLength}
                selectionColor={textColor}
                placeholderTextColor={theme.colors.text}
                onChangeText={(text: string) => onChange && onChange(id, text)}
                editable={!!onChange}
                onBlur={() => toggleFocus(false)}
                onFocus={() => toggleFocus(true)}
                // @ts-ignore
                onImageChange={onImageChange}
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
