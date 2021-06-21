import React, {useEffect, useState} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from "react-native";
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
            backgroundColor: following ? theme.colors.accent : theme.colors.primary,
            borderWidth: 1,
            borderColor: theme.colors.accent,
            paddingVertical: 6,
            paddingHorizontal: 16,
            alignItems: "center",
            borderRadius: 15
        },
        text: {
            color: theme.colors.text
        }
    });

    const [label, setLabel] = useState('')

    useEffect(() => {
        if (following) {
            setLabel('Following')
        } else if(follower) {
            setLabel('Follow back')
        } else {
            setLabel('Follow')
        }
    }, [following])

    return (
        <View style={[styles.followButton, style]}
              onTouchEnd={() => onPress()}
        >
            <Text style={styles.text}>{label}</Text>
        </View>
    )
}

export default withTheme(FollowButtonComponent)

