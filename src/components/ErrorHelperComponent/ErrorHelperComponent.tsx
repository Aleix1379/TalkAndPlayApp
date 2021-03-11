import React from 'react';
import {StyleProp, StyleSheet, TextStyle, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {Text, withTheme} from "react-native-paper";

interface ErrorHelperProperties {
    theme: Theme
    visible: boolean
    message: string
    style?: StyleProp<TextStyle>
}

const ErrorHelperComponent: React.FC<ErrorHelperProperties> = ({theme, visible, message, style}) => {
    const styles = StyleSheet.create({
        errorHelper: {},
        error: {
            color: '#fa4848',
            marginHorizontal: 6,
            paddingHorizontal: 6,
            marginBottom: 6,
            paddingVertical: 2,
            backgroundColor: theme.colors.surface,
            fontSize: 12,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.15,
            shadowRadius: 2.20,
            elevation: 1,
        }
    });

    return (
        <View style={styles.errorHelper}>
            {visible && <Text style={{...styles.error, ...style as {}}}>{message}</Text>}
        </View>
    )
}

export default withTheme(ErrorHelperComponent)
