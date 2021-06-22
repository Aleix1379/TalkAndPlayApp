import React from 'react';
import {StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {Text, withTheme} from "react-native-paper";
import {UserState} from "../../store/user/types";
import AvatarComponent from "../AvatarComponent";
import UserUtils from "../../utils/UserUtils";
import FollowButtonComponent from "../FollowButtonComponent";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface UserItemProperties {
    theme: Theme
    user: UserState
    onFollowUpdate: (follow: UserState, following: boolean) => void
    following: boolean
    follower: boolean
}

const UserItemComponent: React.FC<UserItemProperties> = ({
                                                             theme,
                                                             user,
                                                             onFollowUpdate,
                                                             following,
                                                             follower
                                                         }) => {
    const styles = StyleSheet.create({
        userItem: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.primary,
            padding: 8,
            marginVertical: 1
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
        },
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
    });

    const onPress = (): void => {
        onFollowUpdate(user, following)
    }

    return (
        <View style={styles.userItem}>
            <AvatarComponent
                uri={UserUtils.getImageUrl(user)}
                borderWidth={1}
                size={64}
                style={styles.avatar}
            />

            <View style={styles.userContainer}>
                <Text style={styles.userName}>{user.name}</Text>

                {
                    follower &&
                    <View style={styles.followContainer}>
                        <Text style={styles.follow}>Follows you</Text>
                        <View style={styles.icon}>
                            <MaterialCommunityIcons name='account-arrow-left' color='#808080' size={14}/>
                        </View>
                    </View>
                }
            </View>

            <FollowButtonComponent
                onPress={() => onPress()}
                following={following}
                follower={follower}
                style={styles.button}
            />
        </View>
    )
}

export default withTheme(UserItemComponent)

