import React from 'react'
import {ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import {ProductItem} from "../../types/Product"
import Image from "react-native-scalable-image"
import LinkUtils from "../../utils/LinkUtils"
import {Position} from "../../utils/LinkUtils/LinkUtils";

interface ProductItemProperties {
    theme: Theme
    item: ProductItem
    width?: number
    style?: StyleProp<ViewStyle> | undefined
    bottom?: number
}

const ProductItemComponent: React.FC<ProductItemProperties> = (
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
        productItem: {
            backgroundColor: theme.colors.primary,
            marginHorizontal: 5,
            maxHeight: height,
            width: width,
            paddingHorizontal: 8,
            alignItems: "center",
            justifyContent: "flex-end",
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
        rogueTitleContainer: {
            height: 35,
            paddingTop: 2,
            width: width,
            backgroundColor: theme.colors.backdrop,
            justifyContent: "center"
        },
        rogueTitle: {
            fontSize: 12,
            textAlign: "center"
        },
        price: {
            position: "absolute",
            top: 0,
            right: 0,
            borderBottomLeftRadius: 8,
            padding: 5,
            fontSize: 10,
            color: '#d4af37',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 1,
        },
        rogueImage: {
            maxHeight: height * .7,
            maxWidth: width,
            resizeMode: "center",
            marginBottom: 4,
        }
    })

    const imageSource = {uri: item.image} as ImageSourcePropType

    const updateInitialPosition = (x: number, y: number) => {
        initialPosition.x = x
        initialPosition.y = y
    }

    return (
        <>
            <View
                style={[styles.productItem, style]}
                onTouchStart={(event => updateInitialPosition(event.nativeEvent.locationX, event.nativeEvent.locationY))}
                onTouchEnd={(event) => LinkUtils.open(item.link, initialPosition, event)}
            >
                <Image source={imageSource} style={styles.rogueImage}/>
                <View style={styles.rogueTitleContainer}>
                    <Text style={styles.rogueTitle}>{item.title.replace(/(\(.+\))/g, '')}</Text>
                </View>
            </View>
        </>
    )
}

export default withTheme(ProductItemComponent)
