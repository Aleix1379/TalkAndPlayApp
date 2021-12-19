import React, {useEffect, useState} from 'react'
import {Animated, DeviceEventEmitter, StyleSheet} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {withTheme} from "react-native-paper"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

interface NavigationBottomTabProperties {
    theme: Theme
    icon: string
    color?: string
    size?: number
    focused: boolean
}

const NavigationBottomTabComponent: React.FC<NavigationBottomTabProperties> = (
    {
        theme,
        icon,
        color = theme.colors.primary,
        size = 25,
        focused
    }
) => {
    let eventListener: any = null

    const [scaleAnimation] = useState(new Animated.Value(0))

    const scale = scaleAnimation.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [1, 1.75, 1]
    })

    const animatedStyles = {
        scale: {
            transform: [{scale: scale}]
        }
    }

    const startAnimation = () => {
        if (focused) {
            Animated.timing(scaleAnimation, {
                useNativeDriver: true,
                toValue: 2,
                duration: 750
            }).start()
        }
    }

    const styles = StyleSheet.create({
        navigationBottomTab: {}
    })

    const handleEvent = () => {
        scaleAnimation.setValue(0)
        startAnimation()
    }

    useEffect(() => {
        eventListener = DeviceEventEmitter.addListener('tabBarOnPress', handleEvent)

        return () => {
            eventListener?.remove()
        }

    }, [])

    return (
        <Animated.View style={[styles.navigationBottomTab, animatedStyles.scale]}>
            <MaterialCommunityIcons name={icon} color={color} size={size}/>
        </Animated.View>
    )
}

export default withTheme(NavigationBottomTabComponent)
