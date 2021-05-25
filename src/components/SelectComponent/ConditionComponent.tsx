import React from 'react';
import {StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {Button, Checkbox, Text, withTheme} from "react-native-paper";

interface SelectProperties {
    theme: Theme
    id: string
    value: boolean
    onChangeValue: (newValue: boolean) => void
    text: string
    show: (id: string) => void
}

const ConditionComponent: React.FC<SelectProperties> = ({theme, id, value, onChangeValue, text, show}) => {
    const styles = StyleSheet.create({
        select: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        text: {
          flex: 1
        },
        button: {
            marginLeft: 'auto',
        }
    });

    return (
        <View style={styles.select}>
            <Checkbox
                status={value ? 'checked' : 'unchecked'}
                onPress={() => onChangeValue(!value)}
            />

            <Text style={styles.text} onPress={() => onChangeValue(!value)}>{text}</Text>

            <Button style={styles.button} onPress={() => show(id)} color={theme.colors.surface}>
                Show
            </Button>
        </View>
    )
}

export default withTheme(ConditionComponent)
