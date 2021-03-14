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
            color: theme.colors.error,
            marginHorizontal: 3,
            paddingHorizontal: 6,
            marginTop: 3,
            marginBottom: 3,
            paddingVertical: 2,
            backgroundColor: 'rgba(0,0,0, 0.22)',
            fontSize: 12,
        }
    });

    return (
        <View style={styles.errorHelper}>
            {visible && <Text style={{...styles.error, ...style as {}}}>{message}</Text>}
        </View>
    )
}

export default withTheme(ErrorHelperComponent)
