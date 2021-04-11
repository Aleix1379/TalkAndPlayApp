import React from 'react'
import {StyleSheet} from "react-native"
import {Appbar} from "react-native-paper"
import RoundButtonComponent from "../RoundButtonComponent";

interface HeaderAction {
    image: string
    onPress: () => void
}

interface HeaderProperties {
    title?: string
    leftAction?: HeaderAction
    rightAction?: HeaderAction
}

const HeaderComponent: React.FC<HeaderProperties> = ({

                                                         title = '',
                                                         leftAction,
                                                         rightAction
                                                     }) => {
    const styles = StyleSheet.create({
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 2,
        }
    })

    return (
        <Appbar>
            <RoundButtonComponent
                style={{marginLeft: 5}}
                icon={leftAction?.image}
                onPress={() => leftAction && leftAction.onPress()}
            />

            <Appbar.Content title={title} titleStyle={styles.title}/>

            <RoundButtonComponent
                style={{marginRight: 5}}
                icon={rightAction?.image}
                onPress={() => rightAction && rightAction.onPress()}
            />
        </Appbar>
    )
}

export default HeaderComponent
