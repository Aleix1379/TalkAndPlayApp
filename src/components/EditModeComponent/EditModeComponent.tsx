import React from 'react'
import {StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import RoundButtonComponent from "../RoundButtonComponent/RoundButtonComponent"

interface EditModeProperties {
    theme: Theme
    close: () => void
}

const EditModeComponent: React.FC<EditModeProperties> = ({theme, close}) => {
    const styles = StyleSheet.create({
        editMode: {
            backgroundColor: theme.colors.surface,
        },
        header: {
            borderBottomWidth: 2,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            borderBottomColor: theme.colors.text,
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        },
        title: {
            fontSize: 20,
            marginRight: 'auto'
        },
    })

    return (
        <View style={styles.editMode}>
            <View style={styles.header}>
                <Text style={styles.title}>Edit comment</Text>
                <RoundButtonComponent
                    icon={'close'}
                    onPress={() => close()}
                />
            </View>
        </View>
    )
}

export default withTheme(EditModeComponent)
