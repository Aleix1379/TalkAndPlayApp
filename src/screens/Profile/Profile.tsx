import React, {useEffect, useState} from 'react'
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
import {closeModal, openModal} from "../../store/topSheet/actions"
import {SceneMap, TabBar, TabView} from "react-native-tab-view"
import {connect, shallowEqual, useSelector} from 'react-redux'
import {Snackbar, Text, withTheme} from "react-native-paper"
import HeaderComponent from "../../components/HeaderComponent"
import {UserState} from "../../store/user/types"
import {ApplicationState} from "../../store"
import AvatarComponent from "../../components/AvatarComponent/AvatarComponent"
import UserUtils from "../../utils/UserUtils"
import Info from "../../components/Info/Info"
import FollowersCounterComponent from "../../components/FollowersCounterComponent"
import ChannelComponent from "../../components/ChannelComponent";
import Image from "react-native-scalable-image";
import Clipboard from '@react-native-clipboard/clipboard';

interface ProfileProperties {
    navigation: any,
    openModal: (options: ModalOption[], top: number, onChange?: () => void) => void
    closeModal: () => void
    theme: Theme
}

interface SnackBar {
    visible: boolean
    content: string
    color?: string
}

const ProfileScreen: React.FC<ProfileProperties> = ({navigation, theme, openModal, closeModal}) => {
    const [index, setIndex] = useState(0)
    const [snackbar, setSnackbar] = useState<SnackBar>({
        visible: false,
        content: '',
        color: theme.colors.primary
    })
    const oldIndex = navigation.state?.params?.index

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

    const [modalOptions, setModalOptions] = useState<ModalOption[]>([])
    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    useEffect(() => {
        if (oldIndex !== index) {
            setIndex(oldIndex)
        }
    }, [])

    useEffect(() => {
        loadPostOptions()
    }, [index])

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

    const UserScreen = () => (
        <>
            {user &&
            <View style={styles.user}>
                <AvatarComponent
                    style={styles.avatar} uri={UserUtils.getImageUrl(user)}
                />

                <FollowersCounterComponent/>

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
    const SecondRoute = () => {
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
        accounts: SecondRoute,
    })

    const layout = useWindowDimensions()

    const [routes] = React.useState([
        {key: 'info', title: 'Info'},
        {key: 'accounts', title: 'Accounts'},
    ])

    const toggleModal = () => {
        openModal(modalOptions, 0, () => closeModal())
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
        </>
    )
}


export default connect(null,
    {
        openModal: openModal,
        closeModal: closeModal,
        login: login,
    }
)(withTheme(ProfileScreen))
