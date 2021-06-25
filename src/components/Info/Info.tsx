import React from 'react'
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native"
import {Text, withTheme} from 'react-native-paper'
import {Theme} from "react-native-paper/lib/typescript/types"

interface InfoProperties {
    label: string | null
    value: string | null
    theme: Theme
    style?: StyleProp<ViewStyle>
    valueAlign?: 'left' | 'center' | 'right'
}

const Info: React.FC<InfoProperties> = ({
                                            style = {},
                                            theme,
                                            label,
                                            value,
                                            valueAlign = 'right'
                                        }) => {
    const styles = StyleSheet.create({
        info: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: theme.colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderRadius: 4,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        text: {
            textAlign: valueAlign,
            flex: 1,
            marginRight: 4
        }
    })

    return (
        <View style={[styles.info, style]}>
            {label && label.length > 0 && <Text>{label}</Text>}
            {value && value.length > 0 && <Text style={styles.text}>{value}</Text>}
        </View>
    )
}

export default withTheme(Info)
