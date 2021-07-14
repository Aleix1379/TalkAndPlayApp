import React, {useEffect, useState} from 'react'
import {Animated, Easing, StyleProp, StyleSheet, View, ViewStyle} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import UserService from "../../services/User"
import {User} from "../../types/PostsTypes"

interface NotificationBellProperties {
    theme: Theme
    style?: StyleProp<ViewStyle>
    onPress: () => void
}

const NotificationBellComponent: React.FC<NotificationBellProperties> = ({
                                                                             theme,
                                                                             style,
                                                                             onPress
                                                                         }) => {
    const badgeSize = 20
    const styles = StyleSheet.create({
        notificationBell: {},
        badge: {
            position: "absolute",
            top: -10,
            right: -10,
            backgroundColor: theme.colors.error,
            height: badgeSize,
            width: badgeSize,
            borderRadius: badgeSize / 2,
            zIndex: 10000,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
        },
        badgeWrapper: {
            alignItems: "center",
            justifyContent: "center",
            height: badgeSize,
            width: badgeSize,
            position: "absolute",
            borderRadius: badgeSize / 2,
            right: -10,
        },
        badgeText: {
            fontSize: 12,
            width: badgeSize,
            textAlign: "center"
        }
    })

    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const userService = new UserService()
    const [values, setValues] = useState<number[]>([])
    const [rotationAnimation] = useState(new Animated.Value(0))
    const [transformAnimation] = useState(new Animated.Value(0))
    const translation = transformAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [((badgeSize) * -1), ((values.length * (badgeSize)) * -1)]
    })

    const animatedStyles = {
        translate: {
            transform: [{translateY: translation}]
        }
    }

    const spin = rotationAnimation.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: ['0deg', '-10deg', '10deg', '0deg']
    })

    const animatedRotatedStyles = {
        rotation: {
            transform: [{rotate: spin}]
        }
    }

    const startAnimation = () => {
        Animated.timing(transformAnimation, {
            useNativeDriver: true,
            toValue: 1,
            duration: 3000,
            easing: Easing.bounce,
        }).start()

        Animated.timing(rotationAnimation, {
            useNativeDriver: true,
            toValue: 3,
            easing: Easing.in(Easing.bounce),
            duration: 1000,
        }).start()
    }

    useEffect(() => {
        startAnimation()
    }, [values])

    useEffect(() => {
        if (user.id > 0) {
            userService.getNotifications(user.id)
                .then(values => {
                    loadValues(values.filter(item => !item.seen).length)
                })
                .catch(err => {
                    console.log('error getNotifications')
                    console.log(err)
                })
        }
    }, [user])

    const loadValues = (newValue: number) => {
        const nums: number[] = []
        for (let i = 1; i <= newValue; i++) {
            nums.push(i)
        }
        setValues(nums)
    }

    return (
        <Animated.View
            style={[styles.notificationBell, animatedRotatedStyles.rotation, style]}
            onTouchEnd={() => {
                onPress()
            }}
        >
            {
                values.length > 0 &&
                <View style={styles.badge}>
                    <Animated.View style={[animatedStyles.translate, {top: -10}]}>
                        {
                            values.map((value: number) =>
                                <View
                                    key={value}
                                    style={[styles.badgeWrapper, {top: value * badgeSize,}]}>
                                    <Text style={styles.badgeText}>{value}</Text>
                                </View>
                            )
                        }
                    </Animated.View>
                </View>
            }
            <MaterialCommunityIcons name={'bell'} color={theme.colors.text} size={22}/>
        </Animated.View>
    )
}

export default withTheme(NotificationBellComponent)
