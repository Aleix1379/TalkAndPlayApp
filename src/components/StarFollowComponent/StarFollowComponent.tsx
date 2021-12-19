import React, {useEffect, useState} from 'react'
import {Animated, StyleProp, StyleSheet, ViewStyle} from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

interface StarFollowProperties {
    style?: StyleProp<ViewStyle>
    visible: boolean
    following: boolean
    onPress: () => void
}

const StarFollowComponent: React.FC<StarFollowProperties> = ({
                                                                 style,
                                                                 visible,
                                                                 following,
                                                                 onPress
                                                             }) => {
    const styles = StyleSheet.create({
        starFollow: {
            width: 30,
            alignSelf: "center",
            zIndex: 9000000,
        }
    })
    const animationDuration = 500
    const [rotationAnimation] = useState(new Animated.Value(0))
    const [colorAnimation] = useState(new Animated.Value(0))
    const [focused, setFocused] = useState(false)
    const [upperAnimation] = useState(new Animated.Value(0))

    const startAnimation = () => {
        Animated.timing(upperAnimation, {
            useNativeDriver: true,
            toValue: !focused ? 1 : 2,
            duration: animationDuration,
        }).start()

        Animated.timing(rotationAnimation, {
            useNativeDriver: true,
            toValue: !focused ? 0 : 1,
            duration: animationDuration,
        }).start()
    }

    const startColorAnimation = () => {
        Animated.timing(colorAnimation, {
            useNativeDriver: false,
            toValue: !following ? 0 : 1,
            duration: animationDuration * 3
        }).start()
    }

    const color = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FAFAD2', '#FFD700']
    })

    const animatedStyles = {
        upper: {
            transform: [
                {
                    scale: upperAnimation
                },
                {
                    rotate: rotationAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '25deg']
                    })
                },
            ]
        }
    }

    useEffect(() => startAnimation(), [focused])
    useEffect(() => startColorAnimation(), [following])

    const onStartTouch = () => {
        setFocused(true)
    }
    const onEndTouch = () => {
        setTimeout(() => {
            setFocused(false)
            onPress()
        }, animationDuration)
    }

    return (
        <>
            {
                visible &&
                <Animated.View
                    style={[styles.starFollow, style, animatedStyles.upper]}
                    onTouchStart={onStartTouch}
                    onTouchEnd={onEndTouch}
                >
                    <Animated.Text style={{color}}>
                        <MaterialCommunityIcons
                            name={following ? 'star-face' : 'star-outline'}
                            size={32}
                        />
                    </Animated.Text>
                </Animated.View>
            }
        </>
    )
}

export default StarFollowComponent
