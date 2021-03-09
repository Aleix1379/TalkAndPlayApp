import React from 'react';
import {withTheme} from 'react-native-paper';
import {Theme} from "react-native-paper/lib/typescript/types";
import {StyleSheet, View} from "react-native";
import ButtonComponent from "../../components/ButtonComponent";
import {connect} from "react-redux";
import {logout} from "../../store/user/actions";
import HeaderComponent from "../../components/HeaderComponent";

interface SettingsProperties {
    navigation: any,
    theme: Theme;
    logout: Function
}

const SettingsScreen: React.FC<SettingsProperties> = ({navigation, theme, logout}) => {
    const styles = StyleSheet.create({
        settings: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: 6,
            flex: 1
        },
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 3,
            fontSize: 25,
        },
        actions: {
            marginTop: "auto",
            marginBottom: 24,
            marginHorizontal: 16
        },
    })

    const disconnect = () => {
        logout()
    }

    return (
        <>
            <HeaderComponent
                title="Settings"
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.navigate('Profile')
                }}
            />

            <View style={styles.settings}>

                <View style={styles.actions}>

                    <ButtonComponent label="Sign out" icon="logout" onPress={() => disconnect()}/>

                </View>

            </View>
        </>
    )
}

export default connect(null,
    {
        logout: logout,
    }
)(withTheme(SettingsScreen))
