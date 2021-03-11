import React from 'react';
import {StyleSheet, View} from 'react-native';
import {withTheme} from 'react-native-paper';
import {UserState} from "../../store/user/types";
import {login} from "../../store/user/actions";
import {Theme} from "react-native-paper/lib/typescript/types";
import Info from "../../components/Info";
import UserUtils from "../../utils/UserUtils";
import ButtonComponent from "../../components/ButtonComponent";
import {connect, shallowEqual, useSelector} from "react-redux";
import AvatarComponent from "../../components/AvatarComponent";
import HeaderComponent from "../../components/HeaderComponent";
import {ApplicationState} from "../../store";

interface ProfileProperties {
    navigation: any,
    theme: Theme;
}

const ProfileScreen: React.FC<ProfileProperties> = ({navigation, theme}) => {
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
            actions: {
                marginTop: "auto",
                marginBottom: 16,
                display: "flex",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-around",
            },
            button: {
                flex: 1,
                marginHorizontal: 16
            }
        })

        return (
            <>
                <HeaderComponent title={user?.name}/>

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

                    <View style={styles.actions}>
                        <ButtonComponent label="Edit"
                                         icon="account-edit"
                                         onPress={() => navigation.navigate('ProfileEdit')}
                                         style={styles.button}
                        />

                        <ButtonComponent label="Settings"
                                         icon="cog"
                                         onPress={() => navigation.navigate('Settings')}
                                         style={styles.button}
                        />
                    </View>
                </View>}

            </>
        );
    }
;

export default connect(null,
    {
        login: login,
    }
)(withTheme(ProfileScreen))