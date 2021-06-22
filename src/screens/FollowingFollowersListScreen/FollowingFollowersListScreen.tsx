import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {Text, withTheme} from "react-native-paper";
import {UserState} from "../../store/user/types";
import UserService from "../../services/User";
import {shallowEqual, useSelector} from "react-redux";
import {ApplicationState} from "../../store";
import HeaderComponent from "../../components/HeaderComponent";
import UserItemComponent from "../../components/UserItemComponent";
import Image from "react-native-scalable-image";

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
    });

    const {userType} = navigation.state.params
    const [list, setList] = useState<UserState[]>([])
    const userService = new UserService()
    const [followingState, setFollowingState] = useState<{ [id: number]: FollowState }>({})
    const currentUser: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    useEffect(() => {
        loadData().catch(err => {
            console.log('error load data')
            console.log(err)
        })
    }, [])

    const loadData = async () => {
        let followingData: UserState[]
        let followersData: UserState[]

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

    const toggleFollowing = (followingUser: UserState, isFollowing: boolean) => {
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

    return (
        <>
            <HeaderComponent
                title={capitalize(userType)}
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.navigate('Profile')
                }}
            />
            {
                list.length > 0 &&
                <ScrollView style={styles.followingFollowersList}>
                    {
                        list.map((user, index) =>
                            <UserItemComponent
                                key={index}
                                user={user}
                                onFollowUpdate={toggleFollowing}
                                following={followingState[user.id]?.following}
                                follower={followingState[user.id]?.follower}
                            />
                        )
                    }
                </ScrollView>
            }
            {
                list.length === 0 &&
                <View style={styles.followingFollowersEmpty}>
                    <Text style={styles.followingFollowersEmptyText}>
                        {userType === 'following' ? 'You do not follow anyone' : 'You do not have followers yet'}
                    </Text>
                    <Image width={Dimensions.get('window').width * 0.75} style={styles.image}
                           source={require('../../assets/images/undraw_empty_xct9.png')}/>
                </View>
            }
        </>
    )
}

export default withTheme(FollowingFollowersListScreen)
