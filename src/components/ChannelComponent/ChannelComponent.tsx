import React, {useState} from 'react';
import {GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {Text, withTheme} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AccountUtil from "../../utils/Account";
import {Account} from "../../types/PostsTypes";

interface ChannelProperties {
    theme: Theme
    account: Account
    style?: StyleProp<ViewStyle>
    onTouchStart?: (event: GestureResponderEvent) => void
    onTouchEnd: (event: GestureResponderEvent, color?: string) => void
}

interface Channel {
    icon: string
    color: string
}

const ChannelComponent: React.FC<ChannelProperties> = ({
                                                           theme,
                                                           account,
                                                           style = {},
                                                           onTouchStart,
                                                           onTouchEnd
                                                       }) => {
    const {name, value} = account
    const [channel] = useState<Channel>(AccountUtil.getChannel(name))
    const styles = StyleSheet.create({
        channel: {
            flexDirection: "row",
            alignItems: "center",
            padding: 6,
            borderRadius: 6,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        url: {
            color: channel?.color,
            textAlign: "right",
            flex: 1,
            marginRight: 8
        }
    });

    return (
        <View
            style={[styles.channel, style]}
            onTouchStart={(e) => onTouchStart && onTouchStart(e)}
            onTouchEnd={(e) => onTouchEnd(e, channel?.color)}
        >
            {channel && <MaterialCommunityIcons name={channel.icon} color={channel.color} size={35}/>}

            <Text style={styles.url}>{value}</Text>

        </View>
    )
}

export default withTheme(ChannelComponent)
