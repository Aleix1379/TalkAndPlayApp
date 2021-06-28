import React from 'react'
import {StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import AvatarComponent from "../../components/AvatarComponent"
import Info from "../../components/Info"
import {withTheme} from "react-native-paper"
import ButtonComponent from "../../components/ButtonComponent"
import {User} from "../../types/PostsTypes"

interface UserProperties {
    navigation: any
    theme: Theme
}

const UserScreen: React.FC<UserProperties> = ({navigation, theme}) => {
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
    })

    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    return (
        <>
            {user &&
            <View style={styles.user}>
                <AvatarComponent
                    style={styles.avatar} name={user.avatar}
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

export default withTheme(UserScreen)
