import React from 'react'
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native"
import {Text} from "react-native-paper"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

interface FollowsYouProperties {
    style?: StyleProp<ViewStyle>
}

const FollowsYouComponent: React.FC<FollowsYouProperties> = ({style = {}}) => {
    const styles = StyleSheet.create({
        followContainer: {
            flexDirection: "row",
            alignItems: "center"
        },
        follow: {
            fontSize: 11,
            color: '#808080',
            textDecorationLine: "underline",
        },
        icon: {
            marginLeft: 6,
            marginTop: 1
        }
    })

    return (
        <View style={[styles.followContainer, style]}>
            <Text style={styles.follow}>Follows you</Text>
            <View style={styles.icon}>
                <MaterialCommunityIcons name='account-arrow-left' color='#808080' size={14}/>
            </View>
        </View>
    )
}

export default FollowsYouComponent
