import React from 'react'
import {Image, StyleSheet, View} from "react-native"
import UserUtils from "../../utils/UserUtils"
import {Theme} from "react-native-paper/lib/typescript/types"
import {withTheme} from "react-native-paper"

interface AdButtonProperties {
    image: string
    url: string
    theme: Theme
}

const AdButtons: React.FC<AdButtonProperties> = ({image, url, theme}) => {
    const imageSize = 45
    const styles = StyleSheet.create({
        adButton: {
            padding: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
        },
        image: {
            height: imageSize,
            width: imageSize,
            borderRadius: imageSize / 2
        }
    })

    return (
        <View style={styles.adButton}>
            <Image style={styles.image} source={{uri: UserUtils.getImageByName(image)}}/>
        </View>
    )
}

export default withTheme(AdButtons)
