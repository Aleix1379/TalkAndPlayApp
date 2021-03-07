import React, {useEffect} from 'react';
import {StatusBar, View} from "react-native";
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

interface ContentProperties {
    theme: Theme;
    login: Function
}

const Content: React.FC<ContentProperties> = ({theme, login}) => {
    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const isLoadingVisible: boolean = useSelector((state: ApplicationState) => {
        return state.loading.visible
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
            <StatusBar barStyle="dark-content"/>
            <LoadingComponent visible={isLoadingVisible}/>
            {user.id >= 0 ? <Container/> : <ContainerAnonymous/>}
        </View>
    )
}

export default connect(null, {
    login: login
})(withTheme(Content))
