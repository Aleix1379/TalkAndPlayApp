import React, {useEffect, useState} from 'react'
import {Animated, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Game} from "../../types/Product"
import {withTheme} from "react-native-paper"
import LinkUtils from "../../utils/LinkUtils"
import Image from "react-native-scalable-image"
import ProductUtils from "../../utils/ProductUtils"
import {REACT_APP_GAMES_URL} from "@env"
import {Position} from "../../utils/LinkUtils/LinkUtils"

interface GameItemProperties {
    theme: Theme
    item: Game
    width?: number
    style?: StyleProp<ViewStyle> | undefined
    bottom?: number
}

const GameItemComponent: React.FC<GameItemProperties> = (
    {
        theme,
        item,
        width = 100,
        style,
        bottom = 0
    }
) => {
    const height = width * 1.466666667
    let initialPosition: Position = {
        x: 0,
        y: 0
    }

    const styles = StyleSheet.create({
        price: {
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: 'rgba(20, 20, 20, 0.75)',
            borderBottomLeftRadius: 8,
            padding: 5,
            fontSize: 12,
            color: '#d4af37',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 1,
        },
        instantGamingImage: {
            maxWidth: ProductUtils.getInstantGamingSize(width).width,
            maxHeight: ProductUtils.getInstantGamingSize(width).height
        },
        productGame: {
            height: ProductUtils.getInstantGamingSize(width).height,
            backgroundColor: theme.colors.primary,
            marginHorizontal: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            borderBottomLeftRadius: 3,
            borderBottomRightRadius: 3,
            overflow: "hidden",
            marginBottom: bottom,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
        },
        placeholder: {
            height: height,
            width: width,
        }
    })

    const imageSource = {uri: encodeURI(REACT_APP_GAMES_URL + item.imageName)} as ImageSourcePropType
    const [colorAnimation] = useState(new Animated.Value(0))

    const color = colorAnimation.interpolate({
        inputRange: [0, 1, 2, 3, 4, 5, 6],
        outputRange: ["#202020", "#303030", "#404040", "#505050", "#404040", "#303030", "#202020"]

    })

    const startAnimation = () => {
        colorAnimation.setValue(0)
        Animated.timing(colorAnimation, {
            useNativeDriver: false,
            toValue: 6,
            duration: 3000
        }).start(() => startAnimation())
    }

    useEffect(() => {
        startAnimation()
    }, [])

    const updateInitialPosition = (x: number, y: number) => {
        initialPosition.x = x
        initialPosition.y = y
    }

    return (
        <>
            <View
                style={[styles.productGame, style]}
                onTouchStart={(event => updateInitialPosition(event.nativeEvent.locationX, event.nativeEvent.locationY))}
                onTouchEnd={(event => LinkUtils.open(item.link, initialPosition, event))}
            >
                {item.imageName?.length > 0 && <Image source={imageSource} style={styles.instantGamingImage}/>}
                {!item.imageName && <Animated.View style={[styles.placeholder, {backgroundColor: color}]}/>}
            </View>
        </>
    )
}

export default withTheme(GameItemComponent)
