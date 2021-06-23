import React from 'react'
import {StyleSheet, View} from "react-native"
import {Text, withTheme} from 'react-native-paper'
import {Theme} from "react-native-paper/lib/typescript/types"

interface KeyProperties {
    theme: Theme,
    value: number,
    onPress: (value: number) => void
}

const KeyComponent: React.FC<KeyProperties> = ({theme, value, onPress}) => {
    const styles = StyleSheet.create({
        key: {
            backgroundColor: theme.colors.primary,
            height: 35,
            width: 35,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        value: {
            fontSize: 18,
            color: theme.colors.text
        }
    })

    return (
        <View style={styles.key} onTouchEnd={() => onPress(value)}>
            <Text style={styles.value}>{value}</Text>
        </View>
    )
}

export default withTheme(KeyComponent)
