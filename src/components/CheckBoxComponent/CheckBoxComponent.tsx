import React from 'react'
import {Image, StyleSheet, View} from "react-native"
import {Text, withTheme} from 'react-native-paper'
import {Theme} from "react-native-paper/lib/typescript/types"
import CheckBox from "@react-native-community/checkbox"


interface CheckBoxProperties {
    theme: Theme
    name: string
    label: string
    value: boolean
    imageName?: string
    onChange: (id: string, value: boolean) => void
}

const CheckBoxComponent: React.FC<CheckBoxProperties> = ({theme, name, label, imageName, onChange, value}) => {
    const styles = StyleSheet.create({
        checkbox: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 2,
            paddingHorizontal: 8
        },
        label: {
            fontSize: 16,
            marginRight: 8,
            paddingHorizontal: 8,
            borderRadius: 2,
            backgroundColor: value ? theme.colors.accent : theme.colors.background,
            flex: 1,
            paddingVertical: 2
        },
        image: {
            height: 20,
            width: 20,
            marginLeft: 0,
            marginRight: 8
        }
    })

    const images = [
        {
            id: 'android',
            image: require('../../assets/images/android.png'),
        },
        {
            id: 'gamepad',
            image: require('../../assets/images/gamepad.png'),
        },
        {
            id: 'iphone',
            image: require('../../assets/images/iphone.png'),
        },
        {
            id: 'nintendo',
            image: require('../../assets/images/nintendo-switch.png'),
        },
        {
            id: 'pc',
            image: require('../../assets/images/pc.png'),
        },
        {
            id: 'ps4',
            image: require('../../assets/images/ps4.png'),
        },
        {
            id: 'xbox',
            image: require('../../assets/images/xbox.png'),
        },
        {
            id: 'language',
            image: require('../../assets/images/language.png'),
        }
    ]

    return (
        <View
            style={styles.checkbox}
            onTouchEnd={() => onChange(name, !value)}
        >
            {imageName &&
            <Image
                style={styles.image}
                source={images.find(img => img.id === imageName)?.image}
            />}

            <Text style={styles.label}>{label}</Text>
            <CheckBox
                value={value}
                tintColors={{true: theme.colors.accent, false: theme.colors.text}}
            />
        </View>
    )
}

export default withTheme(CheckBoxComponent)
