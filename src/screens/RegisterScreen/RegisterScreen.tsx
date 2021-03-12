import React, {useState} from 'react';
import {StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {withTheme} from "react-native-paper";
import HeaderComponent from "../../components/HeaderComponent";
import {UserState} from "../../store/user/types";
import AvatarComponent from "../../components/AvatarComponent/AvatarComponent";
import UserUtils from "../../utils/UserUtils";

interface RegisterProperties {
    theme: Theme
}

const RegisterScreen: React.FC<RegisterProperties> = ({theme}) => {
    const [form, setForm] = useState<UserState>({
        id: -1,
        name: '',
        email: '',
        imageVersion: 0,
        platforms: [],
        languages: []
    })

    const styles = StyleSheet.create({
        register: {
            flex: 1,
            backgroundColor: theme.colors.background
        },
        avatar: {
            marginTop: 8,
            marginBottom: 24,
        }
    })

    return (
        <>
            <HeaderComponent title="Create your account"/>
            <View style={styles.register}>
                <AvatarComponent
                    style={styles.avatar}
                    uri={UserUtils.getImageUrl(form)}
                />

            </View>
        </>
    )
}

export default withTheme(RegisterScreen)
