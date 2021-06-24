import React from 'react'
import {Image, ImageStyle, StyleProp, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import ErrorHelperComponent from "../ErrorHelperComponent"

interface AvatarProperties {
    theme: Theme
    style?: StyleProp<ImageStyle>
    uri: string
    onPress?: () => void
    size?: number
    borderWidth?: number
    error?: string
}

const AvatarComponent: React.FC<AvatarProperties> = ({
                                                         theme,
                                                         uri,
                                                         style,
                                                         onPress,
                                                         size = 120,
                                                         borderWidth = 4,
                                                         error = ''
                                                     }) => {
    const styles = StyleSheet.create({
        container: {
            display: "flex",
            alignItems: "center"
        },
        image: {
            borderRadius: size / 2,
            width: size,
            height: size,
            borderWidth: borderWidth,
            borderColor: theme.colors.primary,
        },
        label: {
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 4,
            paddingVertical: 4,
            borderRadius: 2,
            marginTop: 16,
            fontSize: 10,
            textAlign: "center",
            width: 90
        }
    })

    return (
        <View style={[styles.container, style]} onTouchEnd={() => onPress && onPress()}>
            {uri !== '-1' && uri.length > 0 && <Image
                style={styles.image}
                source={{uri}}
            />}

            {(!uri || uri === '-1') && <Image
                style={styles.image}
                source={require('../../assets/images/spinner.png')}
            />}

            {!error && onPress && <Text style={styles.label}>Choose an image</Text>}
            <ErrorHelperComponent style={{marginTop: 16,}} visible={!!error} message={error}/>
        </View>
    )
}

export default withTheme(AvatarComponent)
