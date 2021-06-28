import React from 'react'
import {Image, ImageStyle, StyleProp, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import ErrorHelperComponent from "../ErrorHelperComponent"
import {REACT_APP_IMAGES_URL} from "@env";
import {ImageSelected} from "../../screens/PictureUploadScreen/PictureUploadScreen";

interface AvatarProperties {
    theme: Theme
    style?: StyleProp<ImageStyle>
    onPress?: () => void
    size?: number
    borderWidth?: number
    error?: string
    path?: string
    name?: string
    image?: ImageSelected
}

const AvatarComponent: React.FC<AvatarProperties> = ({
                                                         theme,
                                                         style,
                                                         onPress,
                                                         size = 120,
                                                         borderWidth = 4,
                                                         error = '',
                                                         path,
                                                         name,
                                                         image
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
            {
                image &&
                <Image
                    style={styles.image}
                    source={{uri: 'data:' + image.mime + ';base64,' + image.base64}}
                />
            }

            {
                path && !image &&
                <Image
                    style={styles.image}
                    source={{uri: path}}
                />
            }

            {
                name?.length! > 0 && !image &&
                <Image
                    style={styles.image}
                    source={{uri: REACT_APP_IMAGES_URL + name}}
                />
            }

            {
                !path && !name && !image &&
                <Image
                    style={styles.image}
                    source={require('../../assets/images/spinner.png')}
                />
            }

            {!error && onPress && <Text style={styles.label}>Choose an image</Text>}
            <ErrorHelperComponent style={{marginTop: 16,}} visible={!!error} message={error}/>
        </View>
    )
}

export default withTheme(AvatarComponent)
