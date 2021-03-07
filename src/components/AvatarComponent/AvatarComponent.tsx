import React from 'react';
import {Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";

interface AvatarProperties {
    theme: Theme
    style?: StyleProp<ImageStyle>
    uri: string
}

const AvatarComponent: React.FC<AvatarProperties> = ({theme, uri, style}) => {
    const styles = StyleSheet.create({
        image: {
            borderRadius: 60,
            width: 120,
            height: 120,
            borderWidth: 4,
            borderColor: theme.colors.primary,
        }
    });

    return (
        <Image
            style={{...styles.image, ...style as {}}}
            source={{uri}}/>
    )
}

export default AvatarComponent
