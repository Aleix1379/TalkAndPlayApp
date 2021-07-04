import React, {useEffect} from 'react'
import {View} from "react-native"
import Container from "./Container"
import ContainerAnonymous from "./ContainerAnonymous"
import {connect, shallowEqual, useSelector} from "react-redux"
import {withTheme} from "react-native-paper"
import {Theme} from "react-native-paper/lib/typescript/types"
import {ApplicationState} from "../store"
import LocalStorage from "../utils/LocalStorage/LocalStorage"
import {login} from "../store/user/actions"
import LoadingComponent from "../components/LoadingComponent"
import TopSheetComponent from "../components/TopSheetComponent/TopSheetComponent"
import {TopSheetState} from "../store/topSheet/types"
import DialogComponent from "../components/DialogComponent/DialogComponent"
import {DialogState} from "../store/dialog/types"
import {closeDialog} from "../store/dialog/actions"
import {setTheme} from "../store/theme/actions"
import UserService from "../services/User"
import {User} from "../types/PostsTypes"
import UiUtils from "../utils/UiUtils"

interface ContentProperties {
    theme: Theme
    login: Function
    closeDialog: Function
    setTheme: (theme: 'dark' | 'light') => void
}

const content: React.FC<ContentProperties> = ({theme, login, closeDialog, setTheme}) => {
    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const topSheet: TopSheetState = useSelector((state: ApplicationState) => {
        return state.topSheet
    }, shallowEqual)

    const isLoadingVisible: boolean = useSelector((state: ApplicationState) => {
        return state.loading.visible
    }, shallowEqual)

    const dialog: DialogState = useSelector((state: ApplicationState) => {
        return state.dialog
    }, shallowEqual)

    const isDarkTheme: boolean = useSelector((state: ApplicationState) => {
        return state.theme.isDarkTheme
    }, shallowEqual)

    const userService = new UserService()

    const loadCustomTheme = () => {
        theme = {...UiUtils.getTheme(isDarkTheme)}
    }

    useEffect(() => {
        LocalStorage.getUser()
            .then(userSaved => {
                login(userSaved)
            })
            .catch(err => {
                console.log('error getUser')
                console.log(err)
            })
        LocalStorage.getTheme()
            .then(newTheme => {
                if (!newTheme) {
                    setTheme('dark')
                } else {
                    setTheme(newTheme)
                }
            })
            .finally(() => setTheme('dark'))
        LocalStorage.getAuthToken()
            .then(tokenSaved => {
                if (tokenSaved) {
                    userService.getProfile()
                        .then(userData => {
                            login(userData)
                        })
                        .catch(err => {
                            console.log('error get Profile')
                            console.log(err)
                        })
                }
            })
    }, [])

    useEffect(() => {
        loadCustomTheme()
    }, [isDarkTheme])

    // useEffect(() => {
    // }, [user])

    return (
        <View style={{flex: 1, backgroundColor: theme.colors.background}}>
            <LoadingComponent visible={isLoadingVisible}/>
            <DialogComponent
                visible={dialog.visible}
                onDismiss={() => closeDialog()}
                title={dialog.title}
                content={dialog.content}
                actions={dialog.actions}
            />
            <TopSheetComponent
                visible={topSheet.visible}
                onChange={topSheet.onChange}
                options={topSheet.options}
                top={topSheet.top}
            />
            {user.id >= 0 ? <Container/> : <ContainerAnonymous/>}

        </View>
    )
}

export default connect(null, {
    login: login,
    closeDialog: closeDialog,
    setTheme: setTheme
})(withTheme(content))
