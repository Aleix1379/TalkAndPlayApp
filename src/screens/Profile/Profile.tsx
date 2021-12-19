import React, {useEffect, useRef, useState} from 'react'
import {Dimensions, GestureResponderEvent, StyleSheet, useWindowDimensions, View} from 'react-native'
import {logout} from "../../store/user/actions"
import {Theme} from "react-native-paper/lib/typescript/types"
import {ModalOption} from "../PostDetail/PostDetail"
import {NavigationState, SceneMap, TabBar, TabView} from "react-native-tab-view"
import {connect, shallowEqual, useSelector} from 'react-redux'
import {Text, withTheme} from "react-native-paper"
import HeaderComponent from "../../components/HeaderComponent"
import {ApplicationState} from "../../store"
import AvatarComponent from "../../components/AvatarComponent/AvatarComponent"
import Info from "../../components/Info/Info"
import FollowersCounterComponent from "../../components/FollowersCounterComponent"
import ChannelComponent from "../../components/ChannelComponent"
import Image from "react-native-scalable-image"
import Clipboard from '@react-native-clipboard/clipboard'
import RBSheet from "react-native-raw-bottom-sheet"
import BottomSheetComponent from "../../components/BottomSheetContentComponent/BottomSheetComponent"
import {FollowCounter} from "../../types/FollowCounter"
import UserService from "../../services/User"
import {User} from "../../types/PostsTypes"
import {openSnackBar} from "../../store/snackBar/actions"

interface ProfileProperties {
    navigation: any,
    theme: Theme,
    logout: Function
    openSnackBar: (content: string, color?: string, time?: number) => void
}

interface RouteItem {
    key: string
    title: string
}

const ProfileScreen: React.FC<ProfileProperties> = ({navigation, theme, logout, openSnackBar}) => {
    const refRBSheet = useRef()
    const [navigationState, setNavigationState] = useState<NavigationState<RouteItem>>({
        index: 0,
        routes: [
            {key: 'info', title: 'Info'},
            {key: 'accounts', title: 'Accounts'}
        ]
    })
    const [followCounter, setFollowCounter] = useState<FollowCounter>({
        following: 0,
        followers: 0
    })

    let unsubscribe: Function | null = null
    const styles = StyleSheet.create({
        tab: {
            backgroundColor: theme.colors.primary
        },
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 3,
            fontSize: 25
        },
        user: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: 8,
            paddingTop: 8,
            display: "flex",
            flex: 1,
        },
        avatar: {
            marginTop: 16,
            marginBottom: 24,
        },
        info: {
            marginVertical: 16,
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
        noDataContainer: {
            display: "flex",
            alignItems: 'center',
            justifyContent: "center",
            height: Dimensions.get('screen').height

        },
        noDataText: {
            fontSize: 22,
        },
        image: {
            marginTop: 50,
            marginBottom: 100,
        },
    })
    const userService = new UserService()
    const [modalOptions, setModalOptions] = useState<ModalOption[]>([])
    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    useEffect(() => {
        loadFollowCounter()
        unsubscribe = navigation.addListener('didFocus', async () => {
            loadFollowCounter()
        })

        return () => {
            !!unsubscribe && typeof unsubscribe === "function" && unsubscribe()
        }

    }, [])

    useEffect(() => {
        loadPostOptions()
    }, [navigationState.index])

    const loadFollowCounter = () => {
        userService.getFollowCounter(user.id)
            .then(response => setFollowCounter(response))
            .catch(err => {
                console.log('error getFollowCounter')
                console.log(err)
                if (err.message === "Request failed with status code 403") {
                    logout()
                }
            })
    }

    const goToEdit = () => {
        console.log('Go to edit index => ' + navigationState.index)
        if (navigationState.index === 0) {
            navigation.navigate('ProfileEdit')
        } else if (navigationState.index === 1) {
            navigation.navigate('UserAccountsEdit')
        }
    }

    const loadPostOptions = () => {
        const options: ModalOption[] = []

        if (user.id >= 0) {
            options.push({
                id: 'edit',
                icon: 'account-edit',
                title: 'Edit',
                action: () => goToEdit()
            })

            options.push({
                id: 'settings',
                icon: 'cog',
                title: 'Settings',
                action: () => navigation.navigate('Settings')
            })
        }

        setModalOptions(options)
    }

    const goToFollowingFollowersList = (userType: 'following' | 'followers') => {
        navigation.navigate('FollowingFollowersList', {userType})
    }

    const UserScreen = () => (
        <View style={{flex: 1}}>
            {
                user &&
                <View style={styles.user}>

                    <AvatarComponent
                        style={styles.avatar} name={user.avatar}
                    />

                    <FollowersCounterComponent followCounter={followCounter} onPress={goToFollowingFollowersList}/>

                    <Info label="Email" value={user.email} style={styles.info}/>
                    <Info label="Languages"
                          value={user.languages.map(language => language.name).join(', ') || null}
                          style={styles.info}
                    />
                    <Info label="Platforms"
                          value={user.platforms.map(platform => platform.name).join(', ') || null}
                          style={styles.info}
                    />
                </View>
            }
        </View>
    )
    const AccountsRoute = () => {
        let startX = 0

        const onTouchStart = (event: GestureResponderEvent) => {
            startX = event.nativeEvent.locationX
        }

        const onTouchEnd = (event: GestureResponderEvent, value: string, color?: string) => {
            if (startX === event.nativeEvent.locationX) {
                Clipboard.setString(value)
                openSnackBar(`${value} copied`, color)
            }
        }

        return <View style={styles.user}>
            {
                user?.profiles?.filter(account => account.value).map(account => (
                    <ChannelComponent
                        key={account.name}
                        style={styles.channel}
                        account={account}
                        onTouchStart={onTouchStart}
                        onTouchEnd={((event, color?: string) => onTouchEnd(event, account.value, color))}
                    />
                ))
            }

            {
                user?.profiles?.filter(account => account.value).length < 1 &&
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>Edit to add an account.</Text>
                    <Image width={Dimensions.get('window').width * 0.75} style={styles.image}
                           source={require('../../assets/images/undraw_empty_xct9.png')}/>
                </View>
            }

        </View>
    }

    const renderScene = SceneMap({
        info: UserScreen,
        accounts: AccountsRoute,
    })

    const layout = useWindowDimensions()

    const toggleModal = () => {
        // @ts-ignore
        refRBSheet.current?.open()
    }

    return (
        <>
            <HeaderComponent
                title={user?.name}
                navigation={navigation}
                rightAction={user.id >= 0 ? {
                    image: "dots-vertical",
                    onPress: () => toggleModal()
                } : undefined}
            />
            <TabView
                lazy={false}
                navigationState={navigationState}
                renderScene={renderScene}
                onIndexChange={
                    (index) => {
                        console.log('new index: ' + index)
                        setNavigationState(
                            {...navigationState, ...{index}}
                        )
                    }
                }
                initialLayout={{height: layout.height, width: layout.width}}
                renderTabBar={props => (
                    <TabBar
                        indicatorStyle={{backgroundColor: theme.colors.text}}
                        style={styles.tab} {...props}
                    />
                )}
            />

            <RBSheet
                // @ts-ignore
                ref={refRBSheet}
                height={modalOptions.length === 1 ? modalOptions.length * 90 : modalOptions.length * 70}
                openDuration={250}
                closeOnDragDown={true}
                closeOnPressMask={true}
                closeOnPressBack={true}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(33,33,33,0.25)'
                    },
                    draggableIcon: {
                        backgroundColor: theme.colors.accent
                    },
                    container: {
                        backgroundColor: theme.colors.surface,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingLeft: 12
                    }
                }}
            >
                <BottomSheetComponent options={modalOptions} sheet={refRBSheet}/>
            </RBSheet>
        </>
    )
}


export default connect(null,
    {
        logout: logout,
        openSnackBar: openSnackBar
    }
)(withTheme(ProfileScreen))
