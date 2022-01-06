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
import styles from './styles'

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
            style={[styles.post, {backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary}]}
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
                        style={{
                            minWidth: 120,
                            minHeight: 20,
                            backgroundColor: background,
                            color: getColorText()
                        }}
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
                        <Text style={[styles.text, {fontSize: 10, color: getColorText()}]}>
                            {lastAuthor + (lastAuthor && ' | ') + Time.diff(lastUpdate)}
                        </Text>
                    }
                </View>

            </View>

            <View style={styles.game}>

                <View style={[styles.details, {marginTop: 2}]}>
                    <Text style={[styles.label, {color: getColorText()}]}>{title}</Text>
                    <Text style={[styles.text, {color: getColorText()}]}>{language?.name}</Text>
                </View>

                {
                    game?.length > 0 && platforms.length > 0 &&
                    < View style={[styles.details, {marginTop: 2}]}>
                        <Text style={[styles.label, {color: getColorText()}]}>{game}</Text>
                        {
                            platforms && platforms.length > 0 && <Text style={{
                                ...styles.text,
                                alignSelf: 'center',
                                color: getColorText()
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
