import React from 'react'
import {StyleProp, StyleSheet, TextStyle, View} from "react-native"
import InputCodeComponent from "../InputCodeComponent"

interface ValidationCodeProperties {
    length: number,
    values: string[]
    style?: StyleProp<TextStyle>
}

const ValidationCodeComponent: React.FC<ValidationCodeProperties> = ({
                                                                         length,
                                                                         values,
                                                                         style = {}
                                                                     }) => {
    const items = Array.from(Array(length).keys())

    const styles = StyleSheet.create({
        validationCode: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around"
        }
    })

    return (
        <View style={[styles.validationCode, style]}>

            {
                items.map((val) => (
                    <InputCodeComponent key={val} value={values[val]}/>
                ))
            }

        </View>
    )
}

export default ValidationCodeComponent
