import React, {useEffect, useState} from 'react'
import {BackHandler, Dimensions, ScrollView, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import HeaderComponent from "../../components/HeaderComponent"
import {User} from "../../types/PostsTypes";
import {connect, shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import UserService from "../../services/User"
import Image from "react-native-scalable-image"
import BlockedUserComponent from "../../components/BlockedUserComponent"
import {closeDialog, openDialog} from "../../store/dialog/actions"
import {DialogOption} from "../../store/dialog/types"
import {login} from "../../store/user/actions"
import {setLoading} from "../../store/loading/actions";

interface BlockedUsersProperties {
    navigation: any
    theme: Theme
    openDialog: (title: string, content: string[], actions: DialogOption[]) => void
    closeDialog: () => void
    login: (user: User, token?: string) => void
    setLoading: Function
}

const BlockedUsersScreen: React.FC<BlockedUsersProperties> = ({
                                                                  theme,
                                                                  navigation,
                                                                  openDialog,
                                                                  closeDialog,
                                                                  login,
                                                                  setLoading
                                                              }) => {
    const styles = StyleSheet.create({
        blockedUsers: {
            flex: 1,
            backgroundColor: theme.colors.background
        },
        blockedUsersEmpty: {
            backgroundColor: theme.colors.background,
            flex: 1,
            alignItems: "center"
        },
        blockedUsersEmptyText: {
            marginTop: 'auto',
            fontSize: 22
        },
        image: {
            marginTop: 50,
            marginBottom: 100,
        },
        blockedUsersList: {
            backgroundColor: theme.colors.background,
            flex: 1
        },
    })

    const goBack = () => {
        navigation.goBack()
    }

    const handleBackButtonClick = (): boolean => {
        goBack()
        return true
    }

    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const [users, setUsers] = useState<User[]>([])

    const userService = new UserService()

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        userService.findByIds(user.blocked)
            .then(result => {
                setUsers(result)
            })
            .catch(err => {
                console.log('error: ', err)
            })
            .finally(() => setLoading(false))
    }, [user])

    const unblockUser = (userToBlock: User) => {
        openDialog(
            "Unblock user",
            [`You will see comments or receive messages from @${userToBlock.name}`],
            [
                {
                    label: 'Cancel',
                    onPress: () => closeDialog()
                },
                {
                    label: 'Unblock',
                    backgroundColor: theme.colors.error,
                    onPress: () => {
                        userService.unblockUser(user.id, userToBlock.id)
                            .then(result => login({...user, blocked: result}))
                        closeDialog()
                    }
                }
            ]
        )
    }

    return (
        <View style={{flex: 1}}>
            <HeaderComponent
                navigation={navigation}
                title="Blocked accounts"
                leftAction={{
                    image: "arrow-left",
                    onPress: () => goBack()
                }}
            />

            <View style={styles.blockedUsers}>
                {
                    users && users.length > 0 &&
                    <ScrollView style={styles.blockedUsersList}>
                        {
                            users.map((user, index) =>
                                <BlockedUserComponent key={index} user={user} onUserUnblocked={unblockUser}/>
                            )
                        }
                    </ScrollView>
                }

                {
                    users && users.length === 0 &&
                    <View style={styles.blockedUsersEmpty}>
                        <Text style={styles.blockedUsersEmptyText}>
                            You have no blocked users 😉
                        </Text>
                        <Image width={Dimensions.get('window').width * 0.75} style={styles.image}
                               source={require('../../assets/images/undraw_beer_celebration_re_0iqw.png')}/>
                    </View>
                }
            </View>
        </View>
    )
}

export default connect(null,
    {
        openDialog: openDialog,
        closeDialog: closeDialog,
        login: login,
        setLoading: setLoading
    }
)
(withTheme(BlockedUsersScreen))
