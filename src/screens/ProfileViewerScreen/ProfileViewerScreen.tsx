import React, {useEffect, useState} from 'react';
import {BackHandler, Dimensions, GestureResponderEvent, ScrollView, StyleSheet} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {Snackbar, Text, withTheme} from "react-native-paper";
import HeaderComponent from "../../components/HeaderComponent";
import AvatarComponent from "../../components/AvatarComponent/AvatarComponent";
import UserUtils from "../../utils/UserUtils";
import Info from "../../components/Info/Info";
import {UserState} from "../../store/user/types";
import UserService from "../../services/User";
import ChannelComponent from "../../components/ChannelComponent/ChannelComponent";
import Clipboard from "@react-native-clipboard/clipboard";

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
            marginBottom: 24,
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
        }
    });
    const [snackbar, setSnackbar] = useState<SnackBar>({
        visible: false,
        content: '',
        color: theme.colors.primary
    })
    const {email, origin} = navigation.state.params
    const [user, setUser] = useState<UserState>()
    const userService = new UserService()

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
                console.log('response[0]:')
                console.log(response[0])
                setUser(response[0])
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

    return (
        <>
            {
                user &&
                <HeaderComponent
                    title={user?.name}
                    leftAction={{
                        image: "arrow-left",
                        onPress: () => navigation.goBack()
                    }}
                />
            }

            {
                user &&
                <ScrollView style={styles.profileViewer}>
                    <AvatarComponent
                        style={styles.avatar} uri={UserUtils.getImageUrl(user)}
                    />

                    <Info label="Languages"
                          value={user.languages.map(language => language.name).join(', ')}
                          style={styles.info}/>
                    <Info label="Platforms"
                          value={user.platforms.map(platform => platform.name).join(', ')}
                          style={styles.info}/>

                    {
                        user?.profiles?.filter(account => account.value).map(account => (
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
