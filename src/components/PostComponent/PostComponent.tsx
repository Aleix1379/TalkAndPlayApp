import React from 'react'
import {StyleSheet, View} from "react-native"
import {Text, withTheme} from 'react-native-paper'
import UserUtils from "../../utils/UserUtils"
import Time from "../../utils/Time"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Channel, Option, PostInfo} from "../../types/PostsTypes"
import MessageCounterComponent from "../MessageCounterComponent/MessageCounterComponent";
import AvatarComponent from "../AvatarComponent/AvatarComponent";

interface PostProperties {
    post: PostInfo,
    onClick: (id: number, title: string) => void,
    theme: Theme
    unreadMessages: number
    totalMessages: number
}

const PostComponent: React.FC<PostProperties> = ({post, onClick, theme, unreadMessages, totalMessages}) => {
    const {id, title, game, platforms, channels, user, language, lastUpdate} = post
    let startX = 0

    const styles = StyleSheet.create({
        post: {
            backgroundColor: theme.colors.primary,
            display: "flex",
            flexDirection: "row",
            paddingTop: 12,
            paddingBottom: 8,
            paddingHorizontal: 12,
            borderRadius: 4,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        user: {
            display: "flex",
            alignItems: "center",
            marginRight: 12,
            justifyContent: "space-between"
        },
        avatar: {
            marginBottom: 6
        },
        game: {
            flex: 1,
            justifyContent: "space-between",
            color: theme.colors.accent
        },
        details: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        title: {
            flex: 1,
            color: theme.colors.text,
            fontWeight: unreadMessages > 0 ? 'bold' : 'normal'
        },
        text: {
            color: theme.colors.text,
            textAlign: "right",
            flex: 1
        },
        label: {
            flex: 1,
            color: theme.colors.text
        },
        userName: {
            color: theme.colors.text,
            textAlign: "right",
            marginTop: 'auto'
        },
        counter: {}
    })

    return (
        <View
            key='view-post'
            style={styles.post}
            onTouchStart={(e) => startX = e.nativeEvent.locationX}
            onTouchEnd={(e) => {
                if (startX === e.nativeEvent.locationX) {
                    onClick(id, title)
                }
            }}>
            <View style={styles.user}>
                {/*<Image
                    style={styles.avatar}
                    source={{uri: UserUtils.getImageUrl(user)}}/>*/}
                <AvatarComponent
                    borderWidth={0}
                    size={50}
                    style={styles.avatar}
                    uri={UserUtils.getImageUrl(user)}
                />
                <Text style={styles.userName}>{user?.name}</Text>
            </View>

            <View style={styles.game}>

                <View style={styles.details}>
                    <Text style={styles.title}>{title}</Text>


                    {unreadMessages >= 0 &&
                    <MessageCounterComponent
                        icon={'email-mark-as-unread'}
                        color={'#c87a26'}
                        value={unreadMessages}
                    />}

                    {totalMessages && <MessageCounterComponent
                        icon={'email'}
                        color={'#267a26'}
                        value={totalMessages}
                    />}
                </View>

                <View style={styles.details}>
                    <Text style={styles.label}>{game}</Text>
                    <Text style={{
                        ...styles.text,
                        alignSelf: 'center'
                    }}>{platforms.map((platform: Option) => platform.name).join(', ')}</Text>
                </View>

                {
                    channels.length > 0 &&
                    <View style={styles.details}>
                        <Text style={{
                            ...styles.text,
                            alignSelf: 'center'
                        }}>
                            {channels.map((channel: Channel) => channel.name).join(', ')}</Text>
                    </View>
                }

                <View style={styles.details}>
                    <Text style={styles.label}>{language.name}</Text>
                    <Text style={styles.text}>{Time.diff(lastUpdate)}</Text>
                </View>
            </View>
        </View>
    )

}

export default withTheme(PostComponent)
