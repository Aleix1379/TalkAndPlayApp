import React from 'react'
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import RoundButtonComponent from "../RoundButtonComponent/RoundButtonComponent";
import {Notification} from "../../types/Notification";

interface NotificationProperties {
    theme: Theme
    notification: Notification
    style?: StyleProp<ViewStyle>
    onPress: (notification: Notification) => void
    onDelete: (notification: Notification) => void
}

const NotificationComponent: React.FC<NotificationProperties> = ({
                                                                     theme,
                                                                     notification,
                                                                     style,
                                                                     onPress,
                                                                     onDelete
                                                                 }) => {
    const styles = StyleSheet.create({
        notification: {
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 6,
            paddingVertical: 8,
            flexDirection: "row"
        },
        content: {
            flex: 1,
        },
        title: {
            fontSize: 16,
            marginBottom: 2
        },
        body: {
        },
        text: {
            fontWeight: notification.seen ? 'normal' : 'bold',
            color: notification.seen ? '#adadad' : theme.colors.text
        },
        icon: {
            marginLeft: 'auto',
            alignSelf: "center",
            marginRight: 8,
            backgroundColor: theme.colors.background
        }
    })

    return (
        <View style={[styles.notification, style]}>
            <View style={styles.content}>
                <TouchableOpacity onPress={() => onPress(notification)}>
                    <Text style={[styles.title, styles.text]}>{notification.data.postTitle}</Text>
                    <Text style={[styles.body, styles.text]}>{notification.data.body}</Text>
                </TouchableOpacity>
            </View>

            <RoundButtonComponent
                icon="close"
                iconSize={20}
                containerSize={25}
                style={styles.icon}
                color={theme.colors.text}
                onPress={() => onDelete(notification)}
            />
        </View>
    )
}

export default withTheme(NotificationComponent)
