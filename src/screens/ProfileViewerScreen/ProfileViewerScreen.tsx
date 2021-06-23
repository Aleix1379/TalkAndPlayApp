import React, {useEffect, useState} from 'react'
import {BackHandler, Dimensions, GestureResponderEvent, ScrollView, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Snackbar, Text, withTheme} from "react-native-paper"
import HeaderComponent from "../../components/HeaderComponent"
import AvatarComponent from "../../components/AvatarComponent/AvatarComponent"
import UserUtils from "../../utils/UserUtils"
import Info from "../../components/Info/Info"
import UserService from "../../services/User"
import ChannelComponent from "../../components/ChannelComponent/ChannelComponent"
import Clipboard from "@react-native-clipboard/clipboard"
import FollowButtonComponent from "../../components/FollowButtonComponent"
import {shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import {User} from "../../types/PostsTypes"

interface ProfileViewerProperties {
    navigation: any,
    theme: Theme
}

interface SnackBar {
    visible: boolean
    content: string
    color?: string
}

const ProfileViewerScreen: React.FC<ProfileViewerProperties> = ({theme, navigation}) => {
    const styles = StyleSheet.create({
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 3,
            fontSize: 25
        },
        profileViewer: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: 8,
            paddingTop: 8,
            display: "flex",
            flex: 1,
            // alignItems: "center"
        },
        avatar: {
            marginTop: 8,
            marginBottom: 16,
        },
        info: {
            marginVertical: 8,
            width: '100%'
        },
        button: {
            flex: 1,
            marginHorizontal: 8
        },
        channel: {
            marginVertical: 8,
            backgroundColor: theme.colors.primary
        },
        snackBarContainer: {
            backgroundColor: theme.colors.primary,
        },
        snackBarWrapper: {
            width: Dimensions.get('window').width,
        },
        follow: {
            marginBottom: 8
        }
    })
    const [following, setFollowing] = useState(false)
    const [follower, setFollower] = useState(false)
    const [snackbar, setSnackbar] = useState<SnackBar>({
        visible: false,
        content: '',
        color: theme.colors.primary
    })
    const {email, origin} = navigation.state.params
    const [userVisited, setUserVisited] = useState<User>()
    const userService = new UserService()

    const currentUser: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const goBack = () => {
        if (origin) {
            navigation.navigate(origin.screen, {id: origin.id})
        } else {
            navigation.goBack()
        }
    }

    const handleBackButtonClick = (): boolean => {
        goBack()
        return true
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
        }
    }, [])


    useEffect(() => {
        userService.findUserByEmail(email)
            .then(response => {
                setUserVisited(response[0])
            })
            .catch(err => {
                console.log('error find user by email')
                console.log(err)
            })
    }, [email])

    const onTouchEnd = (event: GestureResponderEvent, value: string, color?: string) => {
        Clipboard.setString(value)
        setSnackbar({
            visible: true,
            content: `${value} copied`,
            color
        })
    }

    const follow = () => {
        if (userVisited && !following) {
            userService.addFollowing(currentUser.id, userVisited.id)
                .then(response => setFollowing(response))
                .catch(err => {
                    console.log('error add following')
                    console.log(err)
                })
        } else if (userVisited && following) {
            userService.deleteFollowing(currentUser.id, userVisited.id)
                .then(response => setFollowing(response))
                .catch(err => {
                    console.log('error delete following')
                    console.log(err)
                })
        }
    }

    useEffect(() => {
        if (userVisited) {
            userService.isFollowing(currentUser.id, userVisited.id)
                .then(isFollowing => setFollowing(isFollowing))
                .catch(err => {
                    console.log('error getFollowing')
                    console.log(err)
                })

            console.log('currentUser.id => ' + currentUser.id)
            console.log('userVisited.id => ' + userVisited.id)

            userService.isFollower(currentUser.id, userVisited.id)
                .then(isFollower => {
                    console.log('IS FOLLOWER => ' + isFollower)
                    setFollower(isFollower)
                })
                .catch(err => {
                    console.log('error getFollower')
                    console.log(err)
                })
        }
    }, [userVisited])

    return (
        <>
            {
                userVisited &&
                <HeaderComponent
                    title={userVisited?.name}
                    leftAction={{
                        image: "arrow-left",
                        onPress: () => navigation.goBack()
                    }}
                />
            }

            {
                userVisited &&
                <ScrollView style={styles.profileViewer}>
                    <AvatarComponent
                        style={styles.avatar} uri={UserUtils.getImageUrl(userVisited)}
                    />

                    <View style={{alignItems: "center"}}>
                        <FollowButtonComponent
                            style={styles.follow}
                            onPress={follow}
                            following={following}
                            follower={follower}
                        />
                    </View>

                    <Info label="Languages"
                          value={userVisited.languages.map(language => language.name).join(', ')}
                          style={styles.info}/>
                    <Info label="Platforms"
                          value={userVisited.platforms.map(platform => platform.name).join(', ')}
                          style={styles.info}/>

                    {
                        userVisited?.profiles?.filter(account => account.value).map(account => (
                            <ChannelComponent
                                key={account.name}
                                style={styles.channel}
                                account={account}
                                onTouchEnd={((event, color?: string) => onTouchEnd(event, account.value, color))}
                            />
                        ))
                    }

                </ScrollView>
            }

            <Snackbar
                visible={snackbar.visible}
                duration={1000}
                onDismiss={() => setSnackbar({visible: false, content: ''})}
                wrapperStyle={styles.snackBarWrapper}
                style={[styles.snackBarContainer, {backgroundColor: snackbar.color}]}
            >
                <Text>{snackbar.content}</Text>
            </Snackbar>
        </>
    )
}

export default withTheme(ProfileViewerScreen)
