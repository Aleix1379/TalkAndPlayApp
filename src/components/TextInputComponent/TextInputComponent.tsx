import React, {useState} from 'react'
import {Text, withTheme} from 'react-native-paper'
import {StyleProp, StyleSheet, TextInput, View, ViewStyle} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {ErrorType} from "../../utils/Validator/types"

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

    const styles = StyleSheet.create({
        label: {
            position: "absolute",
            top: isFocused || value.length > 0 ? -24 : 10,
            paddingHorizontal: 4,
            color: theme.colors.text,
            zIndex: 10
        },
        input: {
            paddingHorizontal: 10,
            paddingVertical: 8,
            paddingBottom: 4,
            borderRadius: 5,
            color: theme.colors.text,
            backgroundColor: theme.colors.primary
        },
        error: {
            color: '#fa4848',
            marginLeft: 4,
            marginBottom: 4,
            fontSize: 12
        }
    })

    const showErrorMessage = (): boolean => {
        return error?.touched! && error.message.length > 0
    }

    const toggleFocus = (focus: boolean) => {
        setIsFocused(focus)
        if (!focus) {
            onBlur && onBlur()
        }
    }

    const getStlyes = (): StyleProp<ViewStyle> => {
        let item: StyleProp<ViewStyle> = {
            marginTop: label ? 10 : 0,
            display: "flex",
            borderWidth: 2,
            borderRadius: 5,
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

    return (
        <View style={getStlyes()}>
            {label && <Text style={styles.label}>{label}</Text>}
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

            {showErrorMessage() && <Text style={styles.error}>{error?.message}</Text>}
        </View>
    )
}

export default withTheme(TextInputComponent)
