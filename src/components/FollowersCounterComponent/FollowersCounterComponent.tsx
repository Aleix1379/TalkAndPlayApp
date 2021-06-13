import React, {useEffect, useState} from 'react';
import {NativeModules, Platform, StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {Text, withTheme} from "react-native-paper";

interface FollowersCounterProperties {
    theme: Theme
}

const FollowersCounterComponent: React.FC<FollowersCounterProperties> = ({theme}) => {
    const locale =
        Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale.replace("_", "-")
            : NativeModules.I18nManager.localeIdentifier.replace("_", "-")

    console.log('locale -> ' + locale)

    if (Platform.OS === 'android') { // only android needs polyfill
        require('intl'); // import intl object
        require('intl/locale-data/jsonp/ca-ES'); // load the required locale details
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
    });

    const [following, setFollowing] = useState(0)
    const [followers, setFollowers] = useState(0)

    useEffect(() => {
        setFollowers(Math.floor(Math.random() * 1000))
        setFollowing(Math.floor(Math.random() * 1000))
    }, [])

    return (
        <View style={styles.followersCounter}>
            <Text>
                <Text style={styles.value}>{following.toLocaleString()}</Text>
                <Text style={styles.label}> Following</Text>
            </Text>
            <Text>
                <Text style={styles.value}>{followers.toLocaleString()}</Text>
                <Text style={styles.label}> Followers</Text>
            </Text>
        </View>
    )
}

export default withTheme(FollowersCounterComponent)
