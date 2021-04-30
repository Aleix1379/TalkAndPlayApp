import React, {useEffect} from 'react';
import {View} from "react-native";
import Container from "./Container";
import ContainerAnonymous from "./ContainerAnonymous";
import {connect, shallowEqual, useSelector} from "react-redux";
import {withTheme} from "react-native-paper";
import {Theme} from "react-native-paper/lib/typescript/types";
import {ApplicationState} from "../store";
import {UserState} from "../store/user/types";
import LocalStorage from "../utils/LocalStorage/LocalStorage";
import {login} from "../store/user/actions";
import LoadingComponent from "../components/LoadingComponent";
import TopSheetComponent from "../components/TopSheetComponent/TopSheetComponent";
import {TopSheetState} from "../store/topSheet/types";
import DialogComponent from "../components/DialogComponent/DialogComponent";
import {DialogState} from "../store/dialog/types";
import {closeDialog} from "../store/dialog/actions";

interface ContentProperties {
    theme: Theme;
    login: Function
    closeDialog: Function
}

const Content: React.FC<ContentProperties> = ({theme, login, closeDialog}) => {
    const user: UserState = useSelector((state: ApplicationState) => {
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

    useEffect(() => {
        setTimeout(() =>
            LocalStorage.getUser()
                .then(userSaved => {
                    if (userSaved) {
                        login(userSaved)
                    }
                }), 100)
    }, [])

    return (
        <View style={{flex: 1, backgroundColor: theme.colors.background}}>
            <LoadingComponent visible={isLoadingVisible}/>
            <DialogComponent
                visible={dialog.visible} onDismiss={() => closeDialog()}
                title={dialog.title}
                content={dialog.content}
                actions={dialog.actions}
            />
            <TopSheetComponent
                visible={topSheet.visible}
                onChange={topSheet.onChange}
                options={topSheet.options}/>
            {user.id >= 0 ? <Container/> : <ContainerAnonymous/>}

        </View>
    )
}

export default connect(null, {
    login: login,
    closeDialog: closeDialog
})(withTheme(Content))
