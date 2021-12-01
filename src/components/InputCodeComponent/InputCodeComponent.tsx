import React from 'react'
import {StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"

interface InputCodeProperties {
    theme: Theme,
    value: string
}

const InputCodeComponent: React.FC<InputCodeProperties> = ({theme, value}) => {
    const styles = StyleSheet.create({
        inputCode: {
            height: 40,
            width: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottomColor: theme.colors.accent,
            borderBottomWidth: 2,
            marginHorizontal: 10
        },
        value: {
            fontSize: 25
        }
    })

    return (
        <View key={value} style={styles.inputCode}>
            <Text style={styles.value}>{value}</Text>
        </View>
    )
}

export default withTheme(InputCodeComponent)
