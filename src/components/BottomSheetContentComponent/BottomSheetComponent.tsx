import React from 'react'
import {StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {Text, withTheme} from "react-native-paper"
import {ModalOption} from "../../screens/PostDetail/PostDetail"

interface BottomSheetProperties {
    theme: Theme
    options: ModalOption[]
    sheet: any
}

const BottomSheetContentComponent: React.FC<BottomSheetProperties> = ({theme, options, sheet}) => {
    const styles = StyleSheet.create({
        option: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 8,
            marginLeft: 8,
            paddingVertical: 4
        },
        optionText: {
            fontSize: 18,
            marginLeft: 16,
            flex: 1,
        }
    })

    return (
        <>
            {options.map((option) => (
                <View key={option.id}
                      onTouchEnd={() => {
                          sheet && sheet.current.close()
                          option.action()
                      }}>
                    <View style={styles.option}>
                        <MaterialCommunityIcons name={option.icon} color={theme.colors.text} size={25}/>
                        <Text style={styles.optionText}>{option.title}</Text>
                    </View>
                </View>
            ))}
        </>
    )
}

export default withTheme(BottomSheetContentComponent)
