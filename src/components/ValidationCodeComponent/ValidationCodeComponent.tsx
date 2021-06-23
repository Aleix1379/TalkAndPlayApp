import React from 'react'
import {StyleSheet, View} from "react-native"
import {withTheme} from 'react-native-paper'
import {Theme} from "react-native-paper/lib/typescript/types"
import InputCodeComponent from "../InputCodeComponent"

interface ValidationCodeProperties {
    theme: Theme,
    length: number,
    values: string[]
}

const ValidationCodeComponent: React.FC<ValidationCodeProperties> = ({theme, length, values}) => {
    const items = Array.from(Array(length).keys())

    const styles = StyleSheet.create({
        validationCode: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 24
        }
    })

    return (
        <View style={styles.validationCode}>

            {items.map((val) => (
                <InputCodeComponent key={val} value={values[val]}/>
            ))}

        </View>
    )
}

export default withTheme(ValidationCodeComponent)
