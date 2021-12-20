import React, {useEffect, useState} from 'react'
import {BackHandler, Dimensions, FlatList, ScrollView, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {withTheme} from "react-native-paper"
import HeaderComponent from "../../components/HeaderComponent"
import {Game, Product, ProductItem, ProductItemRender} from "../../types/Product"
import ProductItemComponent from "../../components/ProductItemComponent"
import GameItemComponent from "../../components/GameItemComponent/GameItemComponent"
import ProductService from "../../services/ProductService"

interface ProductsGridProperties {
    theme: Theme
    navigation: any
}

const ProductsGridScreen: React.FC<ProductsGridProperties> = ({theme, navigation}) => {
    const productService = new ProductService(21)

    const columns = 3
    const width = (Dimensions.get('window').width / columns) - 10

    const styles = StyleSheet.create({
        productsGridContainer: {
            flex: 1,
            backgroundColor: theme.colors.background
        },
        productsGrid: {
            backgroundColor: theme.colors.background
        },
        list: {
            paddingTop: 8
        },
        item: {
            marginVertical: 6
        }
    })

    // const product: Product = navigation.state.params.product
    const platform: string = navigation.state.params.platform

    const [product, setProduct] = useState<Product>()

    const goBack = () => navigation.navigate('Products')


    const handleBackButtonClick = (): boolean => {
        goBack()
        return true
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)

        if (platform) {
            setProduct(productService.getLocalProductByName(platform))

            productService.getGames(platform, 0, 200)
                .then(response => {
                    const value = {...navigation.state.params.product}
                    value.items = response.content
                    setProduct(value)
                })
                .catch(err => {
                    console.log('error getting games:')
                    console.log(err)
                })
        } else {
            setProduct(navigation.state.params.product)
        }

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
        }

    }, [])

    const renderItem = (row: ProductItemRender) => {
        if (product?.type === 'game') {
            return <GameItemComponent key={row.index} item={row.item as Game} width={width} bottom={10}/>
        } else {
            return <ProductItemComponent key={row.index} item={row.item as ProductItem} width={width} bottom={10}/>
        }
    }

    return (
        <View style={styles.productsGridContainer}>
            {
                product &&
                <>
                    <HeaderComponent
                        navigation={navigation}
                        title={product.name.toUpperCase()}
                        leftAction={{
                            image: 'arrow-left',
                            onPress: () => goBack()
                        }}
                    />
                    <ScrollView
                        style={styles.productsGrid}
                        horizontal
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            flexDirection: 'column',
                            flexWrap: 'wrap',
                        }}>
                        <FlatList
                            style={styles.list}
                            data={product.items as Game[]}
                            renderItem={renderItem}
                            keyExtractor={item => `${item.id}`}
                            showsHorizontalScrollIndicator={false}
                            numColumns={columns}
                        />
                    </ScrollView>
                </>
            }
        </View>
    )
}

export default withTheme(ProductsGridScreen)
