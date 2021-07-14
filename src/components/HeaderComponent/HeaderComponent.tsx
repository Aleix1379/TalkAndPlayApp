import React from 'react'
import {StyleSheet} from "react-native"
import {Appbar} from "react-native-paper"
import RoundButtonComponent from "../RoundButtonComponent"
import NotificationBellComponent from "../NotificationBellComponent"

interface HeaderAction {
    image: string
    onPress: () => void
}

interface HeaderProperties {
    title?: string
    leftAction?: HeaderAction
    rightAction?: HeaderAction
    navigation: any
    originalScreen?: string
}

const HeaderComponent: React.FC<HeaderProperties> = ({
                                                         title = '',
                                                         leftAction,
                                                         rightAction,
                                                         navigation,
                                                         originalScreen
                                                     }) => {
    const styles = StyleSheet.create({
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 2,
            fontSize: 16
        },
        bell: {
            position: "absolute",
            right: !!rightAction ? 50 : 16
        }
    })

    const bellNavigation = () => {
        if (!!navigation && navigation.state.routeName === 'NotificationsList') {
            navigation.goBack()
        } else if (!!navigation) {
            navigation.navigate('NotificationsList', {originalScreen})
        }
    }

    return (
        <Appbar>
            <RoundButtonComponent
                style={{marginLeft: 5}}
                icon={leftAction?.image}
                onPress={() => leftAction && leftAction.onPress()}
            />

            <Appbar.Content title={title} titleStyle={styles.title}/>

            <NotificationBellComponent
                style={styles.bell}
                onPress={bellNavigation}
            />

            <RoundButtonComponent
                style={{marginRight: 5}}
                icon={rightAction?.image}
                onPress={() => rightAction && rightAction.onPress()}
            />
        </Appbar>
    )
}

export default HeaderComponent
