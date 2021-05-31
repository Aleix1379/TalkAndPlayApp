import React from 'react';
import {Image, NativeModules, StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {Text, withTheme} from "react-native-paper";
import HeaderComponent from "../../components/HeaderComponent";
import ButtonComponent from "../../components/ButtonComponent";

interface ErrorProperties {
    theme: Theme
}

const ErrorScreen: React.FC<ErrorProperties> = ({theme}) => {
    const styles = StyleSheet.create({
        error: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 8
        },
        image: {
            marginTop: 'auto',
        },
        text: {
            color: theme.colors.background,
            marginTop: 32,
            marginBottom: 'auto'
        },
        button: {
            width: '100%',
            marginBottom: 24
        }
    });

    const retry = () => {
        console.log('retry...')
        NativeModules.DevSettings.reload();
    }

    return (
        <>
            <HeaderComponent
                title='Connection failed!'
            />
            <View style={styles.error}>
                <Image style={styles.image} source={require('../../assets/images/undraw_server_down_s4lk.png')}/>

                <Text style={styles.text}>I tried my best but it looks like there is no connectivity. Please check your
                    internet connection and i'll be alive again.</Text>

                <ButtonComponent label='Retry' style={styles.button} onPress={() => retry()}/>
            </View>
        </>
    )
}

export default withTheme(ErrorScreen)
