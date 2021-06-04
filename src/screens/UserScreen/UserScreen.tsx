import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import HeaderComponent from "../../components/HeaderComponent";
import {ModalOption} from "../PostDetail/PostDetail";
import {UserState} from "../../store/user/types";
import {connect, shallowEqual, useSelector} from "react-redux";
import {ApplicationState} from "../../store";
import AvatarComponent from "../../components/AvatarComponent";
import UserUtils from "../../utils/UserUtils";
import Info from "../../components/Info";
import {withTheme} from "react-native-paper";
import {closeModal, openModal} from "../../store/topSheet/actions";
import {login} from "../../store/user/actions";
import ButtonComponent from "../../components/ButtonComponent";

interface UserProperties {
    navigation: any,
    openModal: (options: ModalOption[], onChange?: () => void) => void
    closeModal: () => void
    theme: Theme;
}

const UserScreen: React.FC<UserProperties> = ({navigation, theme, openModal, closeModal}) => {
    const styles = StyleSheet.create({
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
            alignItems: "center"
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
        }
    });

    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    return (
        <>
            {user &&
            <View style={styles.user}>
                <AvatarComponent
                    style={styles.avatar} uri={UserUtils.getImageUrl(user)}
                />

                <ButtonComponent label={'go'} onPress={() => navigation.navigate('Error')}/>


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
}

export default connect(null,
    {
        openModal: openModal,
        closeModal: closeModal,
        login: login,
    }
)(withTheme(UserScreen))
