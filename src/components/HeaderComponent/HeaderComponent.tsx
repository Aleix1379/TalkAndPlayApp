import React from 'react'
import {StyleSheet} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Appbar, withTheme} from "react-native-paper"

interface HeaderAction {
    image: string
    onPress: () => void
}

interface HeaderProperties {
    theme: Theme
    title?: string
    leftAction?: HeaderAction
    rightAction?: HeaderAction

}

const HeaderComponent: React.FC<HeaderProperties> = ({
                                                         theme,
                                                         title = '',
                                                         leftAction,
                                                         rightAction
                                                     }) => {
    const styles = StyleSheet.create({
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 3,
            fontSize: 25,
        }
    })

    return (
        <Appbar>
            <Appbar.Action color={leftAction ? theme.colors.accent : theme.colors.primary}
                           icon="arrow-left"
                           style={{backgroundColor: leftAction ? theme.colors.surface : theme.colors.primary}}
                           onPress={() => leftAction && leftAction.onPress()}
            />

            <Appbar.Content title={title} titleStyle={styles.title}/>

            <Appbar.Action color={rightAction ? theme.colors.accent : theme.colors.primary}
                           icon="dots-vertical"
                           style={{backgroundColor: rightAction ? theme.colors.surface : theme.colors.primary}}
                           onPress={() => rightAction && rightAction.onPress()}
            />
        </Appbar>
    )
}

export default withTheme(HeaderComponent)
