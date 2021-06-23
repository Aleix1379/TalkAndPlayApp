import React, {useEffect, useRef, useState} from 'react'
import {
    Dimensions,
    GestureResponderEvent,
    StyleSheet,
    useWindowDimensions,
    View
} from 'react-native'
import {login} from "../../store/user/actions"
import {Theme} from "react-native-paper/lib/typescript/types"
import {ModalOption} from "../PostDetail/PostDetail"
import {SceneMap, TabBar, TabView} from "react-native-tab-view"
import {connect, shallowEqual, useSelector} from 'react-redux'
import {Snackbar, Text, withTheme} from "react-native-paper"
import HeaderComponent from "../../components/HeaderComponent"
import {ApplicationState} from "../../store"
import AvatarComponent from "../../components/AvatarComponent/AvatarComponent"
import UserUtils from "../../utils/UserUtils"
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

interface ProfileProperties {
    navigation: any,
    theme: Theme
}

interface SnackBar {
    visible: boolean
    content: string
    color?: string
}

const ProfileScreen: React.FC<ProfileProperties> = ({navigation, theme}) => {
    const refRBSheet = useRef()
    const [index, setIndex] = useState(0)
    const [followCounter, setFollowCounter] = useState<FollowCounter>({
        following: 0,
        followers: 0
    })
    const [snackbar, setSnackbar] = useState<SnackBar>({
        visible: false,
        content: '',
        color: theme.colors.primary
    })
    const oldIndex = navigation.state?.params?.index
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
            // alignItems: "center"
        },
        avatar: {
            marginTop: 8,
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
        snackBarContainer: {
            backgroundColor: theme.colors.primary,
        },
        snackBarWrapper: {
            width: Dimensions.get('window').width,
        }
    })
    const userService = new UserService()
    const [modalOptions, setModalOptions] = useState<ModalOption[]>([])
    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    useEffect(() => {
        if (oldIndex !== index) {
            setIndex(oldIndex)
        }

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
    }, [index])

    const loadFollowCounter = () => {
        userService.getFollowCounter(user.id)
            .then(response => setFollowCounter(response))
            .catch(err => {
                console.log('error getFollowCounter')
                console.log(err)
            })
    }

    const goToEdit = () => {
        console.log('Go to edit index => ' + index)
        if (index === 0) {
            navigation.navigate('ProfileEdit')
        } else if (index === 1) {
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
        <>
            {user &&
            <View style={styles.user}>
                <AvatarComponent
                    style={styles.avatar} uri={UserUtils.getImageUrl(user)}
                />

                <FollowersCounterComponent followCounter={followCounter} onPress={goToFollowingFollowersList}/>

                <Info label="Email" value={user.email} style={styles.info}/>
                <Info label="Languages"
                      value={user.languages.map(language => language.name).join(', ')}
                      style={styles.info}/>
                <Info label="Platforms"
                      value={user.platforms.map(platform => platform.name).join(', ')}
                      style={styles.info}/>
            </View>}
        </>
    )
    const AccountsRoute = () => {
        let startX = 0

        const onTouchStart = (event: GestureResponderEvent) => {
            startX = event.nativeEvent.locationX
        }

        const onTouchEnd = (event: GestureResponderEvent, value: string, color?: string) => {
            if (startX === event.nativeEvent.locationX) {
                Clipboard.setString(value)
                setSnackbar({
                    visible: true,
                    content: `${value} copied`,
                    color
                })
            }
        }

        return <View style={styles.user}>
            <Snackbar
                visible={snackbar.visible}
                duration={1000}
                onDismiss={() => setSnackbar({visible: false, content: ''})}
                wrapperStyle={styles.snackBarWrapper}
                style={[styles.snackBarContainer, {backgroundColor: snackbar.color}]}
            >
                <Text>{snackbar.content}</Text>
            </Snackbar>

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

    const [routes] = React.useState([
        {key: 'info', title: 'Info'},
        {key: 'accounts', title: 'Accounts'},
    ])

    const toggleModal = () => {
        // @ts-ignore
        refRBSheet.current?.open()
    }

    return (
        <>
            <HeaderComponent
                title={user?.name}
                rightAction={user.id >= 0 ? {
                    image: "dots-vertical",
                    onPress: () => toggleModal()
                } : undefined}
            />
            <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={(num => setIndex(num))}
                initialLayout={{width: layout.width}}
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
        login: login,
    }
)(withTheme(ProfileScreen))
