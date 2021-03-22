import React, {useEffect, useRef} from 'react'
import {Animated, StyleProp, StyleSheet, View, ViewStyle} from "react-native"
import {Text, withTheme} from 'react-native-paper'
import {Theme} from "react-native-paper/lib/typescript/types"

interface ButtonPageProperties {
    label: number
    isCurrentPage: boolean
    onClick: (page: number) => void
    theme: Theme
}

const ButtonPageComponent: React.FC<ButtonPageProperties> = ({
                                                                 label,
                                                                 isCurrentPage,
                                                                 onClick,
                                                                 theme
                                                             }) => {
    const opacity = useRef(new Animated.Value(1)).current

    useEffect(() => {
        let duration = 0
        let toValue = 0
        if (isCurrentPage) {
            duration = 2000
            toValue = 1
        }
        Animated.timing(opacity, {
            useNativeDriver: true,
            duration,
            toValue
        }).start()
    }, [opacity, isCurrentPage])

    const styles = StyleSheet.create({
        fadingContainer: {
            height: '100%',
            width: '100%',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            backgroundColor: isCurrentPage ? theme.colors.primary : theme.colors.accent
        }
    })

    const getButtonStyles = (): StyleProp<ViewStyle> => {
        return {
            height: 40,
            width: 40,
            backgroundColor: theme.colors.accent,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            borderRadius: 4,
            marginHorizontal: 10,
        }
    }

    const getNumberStyles = () => {
        return {
            fontFamily: 'Ranchers-Regular',
            fontSize: 26,
        }
    }

    const getAfterStyle = (): StyleProp<ViewStyle> => {
        const styles: StyleProp<ViewStyle> = {
            height: '100%',
            width: '100%',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
        }

        if (isCurrentPage) {
            styles.backgroundColor = theme.colors.accent
        }

        return styles
    }

    return (
        <View style={getButtonStyles()} onTouchEnd={() => onClick(label)}>
            {isCurrentPage && <Animated.View style={[
                styles.fadingContainer,
                {
                    opacity: opacity
                }
            ]}>
                <Text style={getNumberStyles()}>{label}</Text>
            </Animated.View>}

            {!isCurrentPage && <View style={getAfterStyle()}>
                <Text style={getNumberStyles()}>{label}</Text>
            </View>}
        </View>
    )
}

export default withTheme(ButtonPageComponent)
