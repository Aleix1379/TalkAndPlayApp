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

    const getColorText = () => {
        return unreadMessages > 0 ? theme.colors.text : '#959595'
    }

    const styles = StyleSheet.create({
        post: {
            backgroundColor: theme.colors.primary,
            display: "flex",
            paddingTop: 12,
            paddingBottom: 8,
            paddingLeft: 4,
            paddingRight: 8,
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
            flexDirection: "row",
            marginBottom: 6,
            // alignItems: "center",
            // marginRight: 12,
            // justifyContent: "space-between",
            // flex: 1,
            // backgroundColor: '#ff0077'
        },
        avatar: {
            alignSelf: "center",
            marginLeft: 3,
            marginRight: 8
        },
        game: {
            flex: 4,
            justifyContent: "space-between",
            color: theme.colors.accent
        },
        details: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 1
        },
        title: {
            flex: 1,
            color: getColorText(),
            fontWeight: unreadMessages > 0 ? 'bold' : 'normal',
        },
        text: {
            color: getColorText(),
            textAlign: "right",
            flex: 1
        },
        label: {
            flex: 1,
            color: getColorText(),
        },
        userName: {
            color: getColorText(),
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
                    size={35}
                    style={styles.avatar}
                    uri={UserUtils.getImageUrl(user)}
                />
                <View style={{
                    alignItems: "flex-start"
                }}>
                    <Text style={styles.userName}>{user?.name}</Text>
                    <Text style={[styles.text, {fontSize: 12}]}>{Time.diff(lastUpdate)}</Text>
                </View>

                <View style={[styles.details, {marginLeft: 'auto', alignItems: "center"}]}>
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

            </View>

            <View style={styles.game}>


                <View style={styles.details}>
                    <Text style={styles.label}>{title}</Text>
                    <Text style={styles.text}>{game}</Text>
                </View>

                <View style={styles.details}>
                    <Text style={styles.label}>{language.name}</Text>
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

            </View>
        </View>
    )

}

export default withTheme(PostComponent)
