import React from 'react'
import {ColorValue, StyleProp, StyleSheet, View, ViewStyle} from "react-native"
import {Text} from 'react-native-paper'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

interface MessageCounterProperties {
    style?: StyleProp<ViewStyle>
    value: number
    color: ColorValue
    icon: string
}

const MessageCounterComponent: React.FC<MessageCounterProperties> = ({style, icon, value, color}) => {
    const styles = StyleSheet.create({
        messageCounter: {
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            height: 20,
            marginLeft: 8
        }
    })

    return (
        <View style={[styles.messageCounter, style]}>
            <MaterialCommunityIcons name={icon} color={color} size={18}/>
            <Text style={{color, marginLeft: 2}}>{value}</Text>
        </View>
    )
}

export default MessageCounterComponent
