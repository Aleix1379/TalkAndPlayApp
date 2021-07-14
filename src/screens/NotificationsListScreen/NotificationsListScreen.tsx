import React, {useEffect, useState} from 'react'
import {BackHandler, Dimensions, ScrollView, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent"
import {Text, withTheme} from "react-native-paper"
import {connect, shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import NotificationComponent from "../../components/NotificationComponent"
import Image from "react-native-scalable-image"
import {User} from "../../types/PostsTypes"
import UserService from "../../services/User"
import {Notification} from "../../types/Notification"
import {login} from "../../store/user/actions"
import {setLoading} from "../../store/loading/actions"

interface NotificationsListProperties {
    theme: Theme
    navigation: any
    login: (user: User, token?: string) => void
    setLoading: (visible: boolean) => void
}

const NotificationsListScreen: React.FC<NotificationsListProperties> = ({theme, navigation, login, setLoading}) => {
    const styles = StyleSheet.create({
        notificationsList: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        notification: {
            marginVertical: 1
        },
        empty: {
            backgroundColor: theme.colors.background,
            flex: 1,
            alignItems: "center",
            paddingHorizontal: 8
        },
        emptyText: {
            marginTop: 'auto',
            fontSize: 18
        },
        image: {
            marginTop: 50,
            marginBottom: 100,
        }
    })

    const {originalScreen} = navigation.state.params

    // const notifications: NotificationState = useSelector((state: ApplicationState) => {
    //     return state.notifications
    // }, shallowEqual)

    // const [notifications, setNotifications] = useState<Notification[]>([])

    // useEffect(() => {
    //     setNotifications(notificationState.items)
    // }, [notificationState])
    const [downloadFinished, setDownloadFinished] = useState(false)
    const userService = new UserService()
    const [notifications, setNotifications] = useState<Notification[]>([])

    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    useEffect(() => {
        if (user.id > 0) {
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
            setLoading(true)
            userService.getNotifications(user.id)
                .then(values => {
                    setDownloadFinished(true)
                    setNotifications(values)
                    let newValues: Notification[] = []

                    values.forEach(item => {
                        item.seen = true
                        newValues.push(item)
                    })

                    userService.updateNotifications(user.id, newValues)
                        .then(() => {
                            // login({...user, notifications: newValues})
                            // setNotifications(newValues)
                        })
                        .catch(err => {
                            console.log('error updateNotifications')
                            console.log(err)
                        })
                        .finally(() => setLoading(false))

                })
                .catch(err => {
                    console.log('error getNotifications')
                    console.log(err)
                    setLoading(false)
                })
        }

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
        }
    }, [])


    const onPress = (notification: Notification) => {
        console.log('notification on load........')
        console.log(notification)

        login({...user, notifications})
        navigation.navigate('Detail', {
            title: notification.data.postTitle,
            id: notification.data.postId,
            newCommentId: notification.data.commentId
        })
    }

    const deleteNotification = (notification: Notification) => {
        setLoading(true)
        userService.deleteNotification(user.id, notification.id!)
            .then(result => {
                if (result) {
                    let newValues = [...notifications.filter(not => not.id !== notification.id)]
                    setNotifications(newValues)
                    login({...user, notifications: newValues})
                }
            })
            .catch(err => {
                console.log('error deleteNotification')
                console.log(err)
            })
            .finally(() => setLoading(false))
    }

    const goBack = () => {
        login({...user, notifications})
        if (originalScreen) {
            console.log(`go back to originalScreen => ${JSON.stringify(originalScreen)}`)
            navigation.navigate(originalScreen, {notificationRead: false})
        } else {
            navigation.goBack()
        }
    }

    const handleBackButtonClick = (): boolean => {
        goBack()
        return true
    }

    return (
        <>
            <HeaderComponent
                navigation={navigation}
                title='Notifications'
                leftAction={{
                    image: "arrow-left",
                    onPress: () => goBack()
                }}
            />
            <View style={styles.notificationsList}>
                <ScrollView>
                    {
                        notifications.reverse().map(
                            (notification: Notification, index: number) =>
                                <NotificationComponent
                                    onPress={onPress}
                                    key={index}
                                    notification={notification}
                                    style={styles.notification}
                                    onDelete={deleteNotification}
                                />
                        )
                    }
                </ScrollView>
                {
                    downloadFinished && notifications.length === 0 &&
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>
                            {'You have no notifications yet, subscribe to a post to get notifications'}
                        </Text>
                        <Image width={Dimensions.get('window').width * 0.75} style={styles.image}
                               source={require('../../assets/images/undraw_Push_notifications_re_t84m.png')}/>
                    </View>
                }
            </View>
        </>
    )
}

export default connect(null, {
    setLoading: setLoading,
    login: login
})(withTheme(NotificationsListScreen))
