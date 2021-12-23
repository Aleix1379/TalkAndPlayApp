import React, {useEffect, useState} from 'react'
import {Animated, StyleSheet, View} from "react-native"
import {Text, withTheme} from 'react-native-paper'
import Time from "../../utils/Time"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Channel, Option, PostInfo, User, UserPost} from "../../types/PostsTypes"
import MessageCounterComponent from "../MessageCounterComponent/MessageCounterComponent"
import AvatarComponent from "../AvatarComponent/AvatarComponent"
import {shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"

interface PostProperties {
    post: PostInfo,
    onClick: (id: number, title: string) => void,
    theme: Theme
    unreadMessages: number
    totalMessages: number
    lastAuthor: string
    user: UserPost
}

const PostComponent: React.FC<PostProperties> = ({
                                                     post,
                                                     onClick,
                                                     theme,
                                                     unreadMessages,
                                                     totalMessages,
                                                     lastAuthor = '',
                                                     user
                                                 }) => {
    const {id, title, game, platforms, channels, language, lastUpdate} = post
    let startX = 0

    const userConnected: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const getColorText = () => {
        return unreadMessages > 0 ? theme.colors.text : '#959595'
    }

    const styles = StyleSheet.create({
        post: {
            backgroundColor: theme.colors.primary,
            display: "flex",
            paddingTop: 10,
            paddingBottom: 8,
            paddingLeft: 6,
            paddingRight: 10,
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
            marginBottom: 6
        },
        avatar: {
            alignSelf: "center",
            marginRight: 12
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
        },
        counter: {}
    })

    const [backgroundAnimation] = useState(new Animated.Value(0))

    const background = backgroundAnimation.interpolate({
        inputRange: [0, 1, 2, 3, 4, 5, 6],
        outputRange: ["#202020", "#303030", "#404040", "#505050", "#404040", "#303030", "#202020"]

    })

    const startAnimation = () => {
        backgroundAnimation.setValue(0)
        Animated.timing(backgroundAnimation, {
            useNativeDriver: false,
            toValue: 6,
            duration: 3000
        }).start(() => {
            startAnimation()
        })
    }

    useEffect(() => {
        if (post.id < 0) {
            startAnimation()
        }
    }, [])

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
                {
                    post.id >= 0 &&
                    <AvatarComponent
                        borderWidth={0}
                        size={40}
                        style={styles.avatar}
                        name={user.imageName}
                    />
                }

                {
                    post.id < 0 &&
                    <Animated.View style={{
                        height: 60,
                        width: 60,
                        borderRadius: 30,
                        marginRight: 16,
                        backgroundColor: background
                    }}/>
                }

                <View style={{
                    justifyContent: "center",
                    alignItems: "flex-start",
                    flex: 1
                }}>
                    <Animated.Text
                        style={[styles.userName, {
                            minWidth: 120,
                            minHeight: 20,
                            backgroundColor: background
                        }]}
                    >
                        {user.name}
                    </Animated.Text>
                </View>

                <View style={{}}>
                    <View style={[styles.details, {marginLeft: 'auto'}]}>
                        {
                            userConnected.id >= 0 && unreadMessages >= 0 && post.id >= 0 &&
                            <MessageCounterComponent
                                icon={'email-mark-as-unread'}
                                color={'#c87a26'}
                                value={unreadMessages}
                            />
                        }

                        {
                            post.id >= 0 && totalMessages &&
                            <MessageCounterComponent
                                icon={'email'}
                                color={'#267a26'}
                                value={totalMessages}
                            />
                        }

                        {
                            post.id < 0 &&
                            <Animated.View style={{
                                height: 20,
                                width: 100,

                                backgroundColor: background
                            }}>
                            </Animated.View>
                        }

                    </View>

                    {
                        post.id >= 0 &&
                        <Text style={[styles.text, {fontSize: 10}]}>
                            {lastAuthor + (lastAuthor && ' | ') + Time.diff(lastUpdate)}
                        </Text>
                    }
                </View>

            </View>

            <View style={styles.game}>


                <View style={[styles.details, {marginTop: 2}]}>
                    <Text style={styles.label}>{title}</Text>
                    <Text style={styles.text}>{language?.name}</Text>
                </View>

                {
                    game?.length > 0 && platforms.length > 0 &&
                    < View style={[styles.details, {marginTop: 2}]}>
                        <Text style={styles.label}>{game}</Text>
                        {
                            platforms && platforms.length > 0 && <Text style={{
                                ...styles.text,
                                alignSelf: 'center'
                            }}>
                                {platforms.map((platform: Option) => platform.name).join(', ')}
                            </Text>
                        }
                    </View>
                }

                {
                    channels && channels.length > 0 &&
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
