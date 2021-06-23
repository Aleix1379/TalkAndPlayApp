import React from 'react'
import {StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {withTheme} from "react-native-paper"
import KeyComponent from "../KeyComponent"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

interface KeyboardProperties {
    theme: Theme,
    onPress: (value: string | number) => void,
}

const KeyboardComponent: React.FC<KeyboardProperties> = ({theme, onPress}) => {
    const styles = StyleSheet.create({
        keyboard: {
            display: "flex",
            flexDirection: "row",
            flexWrap: 'wrap',
            justifyContent: 'space-around'
        },
        row: {
            display: "flex",
            flexDirection: "row",
            width: '100%',
            marginVertical: 12,
            justifyContent: "space-around"
        }
    })

    return (
        <View style={styles.keyboard}>
            <View style={styles.row}>
                <KeyComponent key={1} value={1} onPress={(value => onPress(value))}/>
                <KeyComponent key={2} value={2} onPress={(value => onPress(value))}/>
                <KeyComponent key={3} value={3} onPress={(value => onPress(value))}/>
            </View>

            <View style={styles.row}>
                <KeyComponent key={4} value={4} onPress={(value => onPress(value))}/>
                <KeyComponent key={5} value={5} onPress={(value => onPress(value))}/>
                <KeyComponent key={6} value={6} onPress={(value => onPress(value))}/>
            </View>

            <View style={styles.row}>
                <KeyComponent key={7} value={7} onPress={(value => onPress(value))}/>
                <KeyComponent key={8} value={8} onPress={(value => onPress(value))}/>
                <KeyComponent key={9} value={9} onPress={(value => onPress(value))}/>
            </View>

            <View style={styles.row}>
                <View key={-1} style={{width: 35}}/>
                <KeyComponent key={0} value={0} onPress={(value => onPress(value))}/>
                <View key={'delete'} onTouchEnd={() => onPress('delete')}>
                    <MaterialCommunityIcons name="backspace" color={theme.colors.primary} size={36}/>
                </View>
            </View>
        </View>
    )
}

export default withTheme(KeyboardComponent)
