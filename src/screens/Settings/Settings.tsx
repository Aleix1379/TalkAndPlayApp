import React, {useState} from 'react'
import {withTheme} from 'react-native-paper'
import {Theme} from "react-native-paper/lib/typescript/types"
import {StyleSheet, View} from "react-native"
import ButtonComponent from "../../components/ButtonComponent"
import {connect, shallowEqual, useSelector} from "react-redux"
import {logout} from "../../store/user/actions"
import HeaderComponent from "../../components/HeaderComponent"
import DialogComponent from "../../components/DialogComponent/DialogComponent"
import UserService from "../../services/User"
import {ApplicationState} from "../../store"
import {setTheme} from "../../store/theme/actions"
import {User} from "../../types/PostsTypes"

interface SettingsProperties {
    navigation: any
    theme: Theme
    logout: Function
    setTheme: (theme: 'dark' | 'light') => void
}

const SettingsScreen: React.FC<SettingsProperties> = ({navigation, theme, logout,}) => {
    const userService = new UserService()
    const [showDialog, setShowDialog] = useState(false)
    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    // const isDarkTheme: boolean = useSelector((state: ApplicationState) => {
    //     return state.theme.isDarkTheme
    // }, shallowEqual)

    const styles = StyleSheet.create({
        settings: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: 6,
            flex: 1
        },
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 3,
            fontSize: 25,
        },
        actions: {
            marginTop: "auto",
            marginBottom: 24,
            marginHorizontal: 16
        },
        action: {
            marginTop: 24
        }
    })

    const deleteUser = () => {
        userService.delete(user.id)
            .then(() => {
                logout()
            })
            .catch(e => {
                console.log('error remove user')
                console.log(e)
            })
            .finally(() => {
                setShowDialog(false)
            })
    }

    const disconnect = () => {
        logout()
    }

    // const updateTheme = () => {
    //     setTheme(isDarkTheme ? 'light' : 'dark')
    //     LocalStorage.setTheme(isDarkTheme ? 'light' : 'dark')
    //         .then(() => DevSettings.reload())
    //         .catch(err => console.log(err))
    // }

    return (
        <>
            <HeaderComponent
                title="Settings"
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.navigate('Profile')
                }}
            />

            <View style={styles.settings}>


                <View style={styles.actions}>

                    {/*<ThemeToggleComponent value={isDarkTheme} onPress={updateTheme} />*/}

                    <ButtonComponent style={{...styles.action, backgroundColor: theme.colors.error}}
                                     label="Delete account"
                                     icon="delete-forever"
                                     onPress={() => setShowDialog(true)}
                    />

                    <ButtonComponent label="Change password"
                                     icon="lock"
                                     onPress={() => navigation.navigate('PasswordEdit')}
                                     style={{marginTop: 24}}
                    />

                    <ButtonComponent style={styles.action} label="Sign out" icon="logout" onPress={() => disconnect()}/>

                </View>

            </View>

            <DialogComponent
                visible={showDialog} onDismiss={() => setShowDialog(false)}
                title="Delete user"
                content={["Permanently delete user and all its posts and comments?", "You can't undo this"]}
                actions={[
                    {
                        label: "Cancel",
                        onPress: () => setShowDialog(false)
                    },
                    {
                        label: "Delete",
                        backgroundColor: theme.colors.error,
                        onPress: () => deleteUser()
                    }
                ]}
            />

        </>
    )
}

export default connect(null,
    {
        logout: logout,
        setTheme: setTheme
    }
)(withTheme(SettingsScreen))
