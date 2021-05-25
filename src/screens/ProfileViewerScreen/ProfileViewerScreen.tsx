import React, {useEffect, useState} from 'react';
import {BackHandler, StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {Text, withTheme} from "react-native-paper";
import HeaderComponent from "../../components/HeaderComponent";
import AvatarComponent from "../../components/AvatarComponent/AvatarComponent";
import UserUtils from "../../utils/UserUtils";
import Info from "../../components/Info/Info";
import {UserState} from "../../store/user/types";
import UserService from "../../services/User";
import {Origin} from "../../types/Origin";

interface ProfileViewerProperties {
    navigation: any,
    theme: Theme
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
    const {email, origin} = navigation.state.params
    const [user, setUser] = useState<UserState>()
    const userService = new UserService()

    const goBack = () => {
        navigation.navigate(origin.screen, {id: origin.id})
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
                <View style={styles.profileViewer}>
                    <AvatarComponent
                        style={styles.avatar} uri={UserUtils.getImageUrl(user)}
                    />

                    <Text>{JSON.stringify(origin, null, 2)}</Text>

                    <Info label="Name" value={user.name} style={styles.info}/>
                    <Info label="Languages"
                          value={user.languages.map(language => language.name).join(', ')}
                          style={styles.info}/>
                    <Info label="Platforms"
                          value={user.platforms.map(platform => platform.name).join(', ')}
                          style={styles.info}/>

                </View>
            }
        </>
    )
}

export default withTheme(ProfileViewerScreen)
