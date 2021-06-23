import React, {useState} from 'react'
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {withTheme} from "react-native-paper"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import TextInputComponent from "../TextInputComponent/TextInputComponent"
import {Account} from "../../types/PostsTypes"
import AccountUtil from "../../utils/Account"

interface AccountEditProperties {
    theme: Theme
    account: Account
    onChange?: (id: string, value: string) => void
    style?: StyleProp<ViewStyle>
}

const AccountEditComponent: React.FC<AccountEditProperties> = ({theme, account, onChange, style}) => {
    const {id, name, value} = account
    const {icon, color} = AccountUtil.getChannel(name)
    const defaultIconColor = theme.colors.text
    const [iconColor, setIconColor] = useState(defaultIconColor)

    const styles = StyleSheet.create({
        accountEdit: {
            flexDirection: "row",
            alignItems: "center",
        },
        input: {
            flex: 1,
            color: color
        },
        icon: {
            alignSelf: "flex-end",
            marginBottom: 4,
            marginRight: 6,
        }
    })

    const onFocusChange = (focused: boolean) => {
        if (focused || value.length > 0) {
            setIconColor(color)
        } else {
            setIconColor(defaultIconColor)
        }
    }

    return (
        <View key={id} style={[styles.accountEdit, style]}>
            <View style={styles.icon}>
                <MaterialCommunityIcons name={icon} color={value.length > 0 ? color : iconColor} size={35}/>
            </View>
            <TextInputComponent
                id={name}
                label={name}
                value={value}
                onChange={onChange}
                style={styles.input}
                borderColor={color}
                labelColor={value.length > 0 ? color : iconColor}
                textColor={color}
                onBlur={() => onFocusChange(false)}
                onFocus={() => onFocusChange(true)}
            />
        </View>
    )
}

export default withTheme(AccountEditComponent)
