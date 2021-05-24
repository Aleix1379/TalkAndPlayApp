import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {withTheme} from 'react-native-paper';
import {UserState} from "../../store/user/types";
import {login} from "../../store/user/actions";
import {Theme} from "react-native-paper/lib/typescript/types";
import Info from "../../components/Info";
import UserUtils from "../../utils/UserUtils";
import {connect, shallowEqual, useSelector} from "react-redux";
import AvatarComponent from "../../components/AvatarComponent";
import HeaderComponent from "../../components/HeaderComponent";
import {ApplicationState} from "../../store";
import {ModalOption} from "../PostDetail/PostDetail";
import {closeModal, openModal} from "../../store/topSheet/actions";

interface ProfileProperties {
    navigation: any,
    openModal: (options: ModalOption[], onChange?: () => void) => void
    closeModal: () => void
    theme: Theme;
}

const ProfileScreen: React.FC<ProfileProperties> = ({navigation, theme, openModal, closeModal}) => {
    const [modalOptions, setModalOptions] = useState<ModalOption[]>([])
    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const styles = StyleSheet.create({
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 3,
            fontSize: 25
        },
        profile: {
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
    })

    useEffect(() => {
        loadPostOptions()
    }, [])

    const loadPostOptions = () => {
        const options: ModalOption[] = []

        if (user.id >= 0) {
            options.push({
                id: 'edit',
                icon: 'account-edit',
                title: 'Edit',
                action: () => navigation.navigate('ProfileEdit')
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

    const toggleModal = () => {
        openModal(modalOptions, () => closeModal())
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

            {user &&
            <View style={styles.profile}>
                <AvatarComponent
                    style={styles.avatar} uri={UserUtils.getImageUrl(user)}
                />

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
)(withTheme(ProfileScreen))
