import React, {useEffect, useState} from 'react'
import {BackHandler, Dimensions, ScrollView, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import UserService from "../../services/User"
import {shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import HeaderComponent from "../../components/HeaderComponent"
import UserItemComponent from "../../components/UserItemComponent"
import Image from "react-native-scalable-image"
import {User} from "../../types/PostsTypes"

interface FollowingFollowersListProperties {
    theme: Theme
    navigation: any
}

interface FollowState {
    following: boolean
    follower: boolean
}

const FollowingFollowersListScreen: React.FC<FollowingFollowersListProperties> = ({theme, navigation}) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background
        },
        followingFollowersList: {
            backgroundColor: theme.colors.background,
            flex: 1
        },
        followingFollowersEmpty: {
            backgroundColor: theme.colors.background,
            flex: 1,
            alignItems: "center"
        },
        image: {
            marginTop: 50,
            marginBottom: 100,
        },
        followingFollowersEmptyText: {
            marginTop: 'auto',
            fontSize: 22
        }
    })

    const {userType} = navigation.state.params
    const [list, setList] = useState<User[] | null>(null)
    const userService = new UserService()
    const [followingState, setFollowingState] = useState<{ [id: number]: FollowState }>({})
    const currentUser: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const goBack = () => {
        navigation.navigate('Profile')
    }

    const handleBackButtonClick = (): boolean => {
        goBack()
        return true
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)

        loadData().catch(err => {
            console.log('error load data')
            console.log(err)
        })

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
        }
    }, [])

    const loadData = async () => {
        let followingData: User[]
        let followersData: User[]

        followingData = await userService.getFollowing(currentUser.id)
        followersData = await userService.getFollowers(currentUser.id)

        let itemsFollowingState: { [id: number]: FollowState } = {}
        followingData.forEach(value => {
            itemsFollowingState[value.id] = {
                following: true,
                follower: followersData.some(item => item.id === value.id)
            }
        })

        setFollowingState(itemsFollowingState)
        setList(userType === 'following' ? followingData : followersData)
    }

    const capitalize = (s: string) => (s && s[0].toUpperCase() + s.slice(1)) || ""

    const updateFollow = (key: number, newValue: boolean) => {
        let data = {...followingState}
        if (!data[key]) {
            data[key] = {
                following: newValue,
                follower: false
            }
        } else {
            data[key].following = newValue
        }
        setFollowingState(data)
    }

    const toggleFollowing = (followingUser: User, isFollowing: boolean) => {
        if (isFollowing) {
            userService.deleteFollowing(currentUser.id, followingUser.id)
                .then(result => updateFollow(followingUser.id, result))
                .catch(err => {
                    console.log('error delete Following')
                    console.log(err)
                })
        } else {
            userService.addFollowing(currentUser.id, followingUser.id)
                .then(result => updateFollow(followingUser.id, result))
                .catch(err => {
                    console.log('error add Following')
                    console.log(err)
                })
        }
    }

    const goToProfile = (userToVisit: User) => {
        navigation.navigate('ProfileViewer', {email: userToVisit.email})
    }

    return (
        <View style={styles.container}>
            <HeaderComponent
                title={capitalize(userType)}
                leftAction={{
                    image: "arrow-left",
                    onPress: () => goBack()
                }}
            />
            {
                list && list.length > 0 &&
                <ScrollView style={styles.followingFollowersList}>
                    {
                        list.map((user, index) =>
                            <UserItemComponent
                                key={index}
                                user={user}
                                onFollowUpdate={toggleFollowing}
                                onUserSelected={goToProfile}
                                following={followingState[user.id]?.following}
                                follower={followingState[user.id]?.follower}
                            />
                        )
                    }
                </ScrollView>
            }
            {
                list && list.length === 0 &&
                <View style={styles.followingFollowersEmpty}>
                    <Text style={styles.followingFollowersEmptyText}>
                        {userType === 'following' ? 'You do not follow anyone' : 'You have no followers yet'}
                    </Text>
                    <Image width={Dimensions.get('window').width * 0.75} style={styles.image}
                           source={require('../../assets/images/undraw_empty_xct9.png')}/>
                </View>
            }
        </View>
    )
}

export default withTheme(FollowingFollowersListScreen)
