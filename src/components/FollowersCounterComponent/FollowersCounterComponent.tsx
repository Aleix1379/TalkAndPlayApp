import React from 'react'
import {NativeModules, Platform, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import {FollowCounter} from "../../types/FollowCounter"

interface FollowersCounterProperties {
    theme: Theme
    followCounter: FollowCounter
    onPress: (userType: 'following' | 'followers') => void
}

const FollowersCounterComponent: React.FC<FollowersCounterProperties> = ({
                                                                             theme,
                                                                             followCounter,
                                                                             onPress
                                                                         }) => {
    const locale =
        Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale.replace("_", "-")
            : NativeModules.I18nManager.localeIdentifier.replace("_", "-")

    console.log('locale -> ' + locale)

    if (Platform.OS === 'android') { // only android needs polyfill
        require('intl') // import intl object
        require('intl/locale-data/jsonp/ca-ES') // load the required locale details
    }

    const styles = StyleSheet.create({
        followersCounter: {
            display: "flex",
            flexDirection: "row",
            width: '100%',
            justifyContent: "space-around",
            marginBottom: 8
        },
        value: {
            fontWeight: "bold",
            color: theme.colors.accent
        },
        label: {
            color: '#c4c4c4'
        }
    })

    return (
        <View style={styles.followersCounter}>
            <Text onPress={() => onPress('following')}>
                <Text style={styles.value}>{followCounter.following}</Text>
                <Text style={styles.label}> Following</Text>
            </Text>
            <Text onPress={() => onPress('followers')}>
                <Text style={styles.value}>{followCounter.followers}</Text>
                <Text style={styles.label}> Followers</Text>
            </Text>
        </View>
    )
}

export default withTheme(FollowersCounterComponent)
