import React, {useEffect, useState} from 'react'
import {ScrollView, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import {Game, Product} from "../../types/Product"
import ProductRowComponent from "../../components/ProductRowComponent"
import ButtonComponent from "../../components/ButtonComponent"
import LocalStorage from "../../utils/LocalStorage/LocalStorage"
import {User} from "../../types/PostsTypes"
import {connect, shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import ProductService from "../../services/ProductService"

interface ProductsProperties {
    theme: Theme
    navigation: any
}

const ProductsScreen: React.FC<ProductsProperties> = ({theme, navigation}) => {
    const productService = new ProductService()

    const styles = StyleSheet.create({
        products: {},
        disclaimer: {
            padding: 8,
            marginBottom: 8,
            backgroundColor: theme.colors.backdrop
        },
        controls: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 16,
            marginBottom: 8
        },
        button: {
            height: 24,
            width: 120,
            borderRadius: 4
        }
    })

    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false)

    useEffect(() => {
        downloadGames().catch(err => console.log(err))
        LocalStorage.getShowDisclaimer().then(result => {
            setShowDisclaimer(result || !user.id)
        })
    }, [])

    const downloadGames = async () => {
        const platforms = [
            'pc',
            'ps 5',
            'xbox series',
            'nintendo switch',
            'ps 4',
            'xbox one',
        ]

        const gameProducts: Product[] = []
        let index = 2
        for (const platform of platforms) {
            const {content} = await productService.getGames(platform)
            gameProducts.push({
                id: index++,
                name: platform,
                items: content,
                type: 'game'
            })
        }

        setProducts(mergeGames(products, gameProducts))
    }

    const [products, setProducts] = useState<Product[]>(productService.getLocalProducts())

    const showAll = (product: Product) => {
        const game = product.items[0] as Game
        navigation.navigate('ProductsGrid', {product, platform: game.platform})
    }

    const mergeGames = (oldGame: Product[], newGames: Product[]) => {
        return oldGame.map(product => {
            const data = {...product}
            const gameProduct = newGames.find(item => item.id === data.id)

            if (gameProduct) {
                data.items = gameProduct.items
            }

            return data
        })
    }

    return (
        <ScrollView style={styles.products}>
            {
                showDisclaimer &&
                <View style={styles.disclaimer}>
                    <Text>
                        {'Links below are affiliate links, meaning, at no additional cost to you, I will earn a commission ' +
                            'if you click through and make a purchase.\n\n' +
                            'All images, names and logos belong to their respective owners'}
                    </Text>
                    <View style={styles.controls}>
                        <ButtonComponent
                            style={styles.button}
                            fontSize={12}
                            label={'Close'}
                            onPress={() => setShowDisclaimer(false)}
                        />
                        <ButtonComponent
                            style={styles.button}
                            fontSize={12}
                            label={"Don't show it again"}
                            onPress={() => {
                                setShowDisclaimer(false)
                                LocalStorage.setShowDisclaimer(false).catch(err => console.log(err))
                            }}
                        />
                    </View>
                </View>
            }
            {
                products.map((product) =>
                    <ProductRowComponent key={product.id} product={product} onShowAll={() => showAll(product)}/>
                )
            }
        </ScrollView>
    )
}

export default connect(null,
    {}
)(withTheme(ProductsScreen))
