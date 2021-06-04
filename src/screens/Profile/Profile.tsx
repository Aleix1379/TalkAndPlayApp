import React, {useEffect, useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {login} from "../../store/user/actions";
import {Theme} from "react-native-paper/lib/typescript/types";
import {ModalOption} from "../PostDetail/PostDetail";
import {closeModal, openModal} from "../../store/topSheet/actions";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import {connect, shallowEqual, useSelector} from 'react-redux';
import {withTheme} from "react-native-paper";
import HeaderComponent from "../../components/HeaderComponent";
import {UserState} from "../../store/user/types";
import {ApplicationState} from "../../store";
import AvatarComponent from "../../components/AvatarComponent/AvatarComponent";
import UserUtils from "../../utils/UserUtils";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import Info from "../../components/Info/Info";
import FollowersCounterComponent from "../../components/FollowersCounterComponent";

interface ProfileProperties {
    navigation: any,
    openModal: (options: ModalOption[], onChange?: () => void) => void
    closeModal: () => void
    theme: Theme;
}

const ProfileScreen: React.FC<ProfileProperties> = ({navigation, theme, openModal, closeModal}) => {
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

    const [modalOptions, setModalOptions] = useState<ModalOption[]>([])
    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

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

    const UserScreen = () => (
        <>
            {user &&
            <View style={styles.user}>
                <AvatarComponent
                    style={styles.avatar} uri={UserUtils.getImageUrl(user)}
                />

                <FollowersCounterComponent />

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
    const SecondRoute = () => (
        <View style={{flex: 1, backgroundColor: theme.colors.background}}/>
    );

    const renderScene = SceneMap({
        data: UserScreen,
        accounts: SecondRoute,
    });

    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: 'data', title: 'User'},
        {key: 'accounts', title: 'Accounts'},
    ]);

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
            <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
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
