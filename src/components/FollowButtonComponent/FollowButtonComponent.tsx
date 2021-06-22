import React, {useEffect, useState} from 'react';
import {Animated, StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {withTheme} from "react-native-paper";

interface FollowButtonProperties {
    theme: Theme
    onPress: () => void
    style?: StyleProp<ViewStyle>
    following: boolean
    follower: boolean
}

const FollowButtonComponent: React.FC<FollowButtonProperties> = ({
                                                                     theme,
                                                                     onPress,
                                                                     style,
                                                                     following,
                                                                     follower
                                                                 }) => {
    const styles = StyleSheet.create({
        followButton: {
            backgroundColor: theme.colors.background,
            borderWidth: 1,
            paddingVertical: 6,
            paddingHorizontal: 16,
            alignItems: "center",
            borderRadius: 15,
            width: 120,
            height: 33,
            overflow: "hidden",
            position: "relative"
        },
        text: {
            color: theme.colors.text
        },
        background: {
            backgroundColor: theme.colors.accent,
            position: "absolute",
            top: 0,
            width: 120,
            height: 33,
            borderRadius: 40
        }
    });

    const [upperAnimation] = useState(new Animated.Value(following ? 1 : 0))

    const startAnimation = () => {
        Animated.timing(upperAnimation, {
            useNativeDriver: true,
            toValue: following ? 1 : 0,
            duration: 500
        }).start()
    }

    const animatedStyles = {
        upper: {
            transform: [
                {
                    scale: upperAnimation
                }
            ]
        }
    }


    const [label, setLabel] = useState('')

    useEffect(() => {
        startAnimation()
        if (following) {
            setLabel('Following')
        } else if (follower) {
            setLabel('Follow back')
        } else {
            setLabel('Follow')
        }
    }, [following])

    return (
        <View style={[styles.followButton, style]}
              onTouchEnd={() => onPress()}
        >
            <Animated.View style={[styles.background, animatedStyles.upper]}/>
            <Text style={styles.text}>{label}</Text>
        </View>
    )
}

export default withTheme(FollowButtonComponent)

