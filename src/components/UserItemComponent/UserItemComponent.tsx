import React from 'react'
import {StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import AvatarComponent from "../AvatarComponent"
import UserUtils from "../../utils/UserUtils"
import FollowButtonComponent from "../FollowButtonComponent"
import {User} from "../../types/PostsTypes"
import FollowsYouComponent from "../FollowsYouComponent";

interface UserItemProperties {
    theme: Theme
    user: User
    onFollowUpdate: (follow: User, following: boolean) => void
    onUserSelected: (user: User) => void
    following: boolean
    follower: boolean
}

const UserItemComponent: React.FC<UserItemProperties> = ({
                                                             theme,
                                                             user,
                                                             onFollowUpdate,
                                                             onUserSelected,
                                                             following,
                                                             follower
                                                         }) => {
    const styles = StyleSheet.create({
        userItemContainer: {
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
        button: {
            marginLeft: 'auto'
        },
        avatar: {
            marginLeft: 2,
            marginRight: 16
        },
        userContainer: {},
        userName: {
            fontSize: 16,
        }
    })

    return (
        <View style={styles.userItemContainer}>
            <View style={styles.userItemRow} onTouchEnd={() => onUserSelected(user)}>
                <AvatarComponent
                    uri={UserUtils.getImageUrl(user)}
                    borderWidth={1}
                    size={64}
                    style={styles.avatar}
                />

                <View style={styles.userContainer}>
                    <Text style={styles.userName}>{user.name}</Text>
                    {
                        follower && <FollowsYouComponent />
                    }
                </View>
            </View>
            <FollowButtonComponent
                onPress={() => onFollowUpdate(user, following)}
                following={following}
                follower={follower}
                style={styles.button}
            />
        </View>
    )
}

export default withTheme(UserItemComponent)

