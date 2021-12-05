import React from 'react';
import {StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {Text, withTheme} from "react-native-paper";
import {User} from "../../types/PostsTypes";
import AvatarComponent from "../AvatarComponent/AvatarComponent";
import FollowsYouComponent from "../FollowsYouComponent";
import FollowButtonComponent from "../FollowButtonComponent/FollowButtonComponent";
import ButtonComponent from "../ButtonComponent";

interface BlockedUserProperties {
    theme: Theme
    user: User
    onUserUnblocked: (user: User) => void
}

const BlockedUserComponent: React.FC<BlockedUserProperties> = ({theme, user, onUserUnblocked}) => {
    const styles = StyleSheet.create({
        blockedUser: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.primary,
            padding: 8,
            marginVertical: 1
        },
        userItemRow: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.primary,
            flex: 1
        },
        avatar: {
            marginLeft: 2,
            marginRight: 16
        },
        userName: {
            fontSize: 16,
        },
        button: {
            marginLeft: 'auto',
            height: 30,
            paddingHorizontal: 12,
            backgroundColor: theme.colors.error
        },
    });

    return (
        <View style={styles.blockedUser}>
            <View style={styles.userItemRow}>
                <AvatarComponent
                    name={user.avatar}
                    borderWidth={1}
                    size={64}
                    style={styles.avatar}
                />

                <Text style={styles.userName}>{user.name}</Text>
            </View>

            <ButtonComponent
                label="Blocked"
                onPress={() => onUserUnblocked(user)}
                fontSize={12}
                style={styles.button}
            />

        </View>
    )
}

export default withTheme(BlockedUserComponent)
