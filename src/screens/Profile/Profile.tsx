import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Appbar, withTheme} from 'react-native-paper';
import {UserState} from "../../store/user/types";
import UserService from "../../services/User";
import {login} from "../../store/user/actions";
import {Theme} from "react-native-paper/lib/typescript/types";
import Info from "../../components/Info";
import ImageUtils from "../../utils/UserUtils";
import ButtonComponent from "../../components/ButtonComponent";
import {connect} from "react-redux";
import AvatarComponent from "../../components/AvatarComponent";

interface ProfileProperties {
    navigation: any,
    theme: Theme;
}

const ProfileScreen: React.FC<ProfileProperties> = ({navigation, theme}) => {
        const userService = new UserService()
        const [user, setUser] = useState<UserState>()

        useEffect(() => {
            console.log('downloading user...')
            userService.getProfile().then((user) => {
                if (user) {
                    setUser(user)
                    login(user)
                }
            })
        }, [])

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
            info: {
                marginVertical: 8,
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
                <Appbar>
                    <Appbar.Content title={user?.name} titleStyle={styles.title}/>
                </Appbar>


                {user &&
                <View style={styles.profile}>
                    <AvatarComponent theme={theme}
                                     style={{
                                         marginTop: 8,
                                         marginBottom: 12,
                                     }} uri={ImageUtils.getImageUrl(user)}
                    />

                    <Info label="Email" value={user.email} theme={theme} style={styles.info}/>
                    <Info label="Languages"
                          value={user.languages.map(language => language.name).join(', ')}
                          theme={theme}
                          style={styles.info}/>
                    <Info label="Platforms"
                          value={user.platforms.map(platform => platform.name).join(', ')}
                          theme={theme}
                          style={styles.info}/>

                    <View style={styles.actions}>
                        <ButtonComponent label="Edit"
                                         icon="account-edit"
                                         onPress={() => navigation.navigate('EditProfile')}
                                         style={styles.button}
                                         theme={theme}/>

                        <ButtonComponent label="Settings"
                                         icon="cog"
                                         onPress={() => navigation.navigate('Settings')}
                                         style={styles.button}
                                         theme={theme}/>
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