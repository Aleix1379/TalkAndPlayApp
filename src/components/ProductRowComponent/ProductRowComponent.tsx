import React from 'react'
import {Dimensions, ScrollView, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import {Game, Product, ProductItem} from "../../types/Product"
import ButtonComponent from "../ButtonComponent";
import ProductItemComponent from "../ProductItemComponent"
import Clipboard from "@react-native-clipboard/clipboard"
import {connect} from "react-redux"
import {openSnackBar} from "../../store/snackBar/actions"
import GameItemComponent from "../GameItemComponent";
import Image from "react-native-scalable-image";

interface ProductRowProperties {
    theme: Theme
    product: Product
    onShowAll: () => void
    openSnackBar: (content: string, color?: string, time?: number) => void
}

const ProductRowComponent: React.FC<ProductRowProperties> = ({theme, product, onShowAll, openSnackBar}) => {
    const styles = StyleSheet.create({
        productRow: {
            marginBottom: 8
        },
        header: {
            backgroundColor: theme.colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",

            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
        },
        title: {
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 2,
            fontSize: 16,
            textTransform: 'uppercase'
        },
        extra: {
            fontSize: 10,
            top: 5,
            fontStyle: "italic",
        },
        button: {
            height: 20,
            paddingHorizontal: 8,
            borderRadius: 2,
        },
        items: {
            marginTop: 8,
        },
        snackBarContainer: {
            backgroundColor: theme.colors.primary,
            position: "absolute",
            bottom: 0
        },
        snackBarWrapper: {
            width: Dimensions.get('window').width,
        },
        icon: {
            maxHeight: 28,
            maxWidth: 28,
            position: "absolute",
            marginRight: 12
        },
        details: {
            paddingLeft: 38,
            // flexDirection: "row",
            // alignItems: "center"
            justifyContent: "center"
        }
    })

    const onExtraPress = () => {
        Clipboard.setString('TALKANDPLAY')
        openSnackBar(
            `TALKANDPLAY copied`,
            theme.colors.primary,
            1000
        )
    }

    const icons = [
        {
            id: 'pc',
            image: require('../../assets/images/pc.png')
        },
        {
            id: 'ps',
            image: require('../../assets/images/playstation.png')
        },
        {
            id: 'xbox',
            image: require('../../assets/images/xboxLogo.png')
        },
        {
            id: 'nintendo',
            image: require('../../assets/images/nintendo.png')
        },
        {
            id: 'Rogue',
            image: require('../../assets/images/rogue.png')
        }
    ]

    const getIcon = (prod: Product) => {
        const icon = icons.find(icon => prod.name.includes(icon.id)) || icons[0]
        return !!icon ? icon.image : icons[0].image
    }

    return (
        <View style={styles.productRow}>
            <View style={styles.header}>
                <View style={styles.details}>
                    <Image style={styles.icon} source={getIcon(product)}/>
                    <Text style={styles.title}>{product.name}</Text>
                    {product.extra && <Text style={styles.extra} onPress={() => onExtraPress()}>{product.extra}</Text>}
                </View>
                <ButtonComponent
                    label={'SHOW ALL'}
                    style={styles.button}
                    onPress={onShowAll}
                    fontSize={12}
                />
            </View>

            <ScrollView horizontal={true} style={styles.items}>
                {
                    product.items
                        .map((item: ProductItem | Game) => {
                                if (product.type === 'game') {
                                    return <GameItemComponent key={item.id} item={item as Game}/>
                                } else {
                                    return <ProductItemComponent key={item.id} item={item as ProductItem}/>
                                }
                            }
                        )
                }
            </ScrollView>
        </View>
    )
}
export default connect(null, {
    openSnackBar: openSnackBar
})(withTheme(ProductRowComponent))
