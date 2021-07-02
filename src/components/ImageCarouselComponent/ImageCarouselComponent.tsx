import React, {useRef, useState} from 'react'
import {FlatList, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from "react-native"
import FastImage from 'react-native-fast-image'
import {REACT_APP_IMAGES_URL} from "@env"

interface ImageCarouselProperties {
    dataImages: any
    width: number
    height: number
    style?: StyleProp<ViewStyle>
    bottomThumbList?: number
}

const ImageCarouselComponent: React.FC<ImageCarouselProperties> = ({
                                                                       dataImages,
                                                                       width,
                                                                       height,
                                                                       style = {},
                                                                       bottomThumbList = 70
                                                                   }) => {
    const [activeIndex, setActiveIndex] = useState(0)
    const topRef: any = useRef()
    const bottomRef: any = useRef()
    const IMAGE_SIZE = 60
    const SPACING = 10

    const scrollToActiveIndex = (index: number) => {
        let newPosition = 0
        setActiveIndex(index)
        topRef.current.scrollToOffset({
            offset: index * width,
            animated: true
        })

        if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
            newPosition = index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2
        }

        if (dataImages.length > 1) {
            bottomRef.current.scrollToOffset({
                offset: newPosition,
                animated: true
            })
        }
    }

    const getUri = (image: any) => {
        if (image.base64) {
            return 'data:' + image.mime + ';base64,' + image.base64
        } else {
            return `${REACT_APP_IMAGES_URL}${image.name}`
        }
    }


    return (
        <View style={style}>
            <FlatList
                ref={topRef}
                data={dataImages}
                keyExtractor={(item => item.id.toString())}
                horizontal={true}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={ev => {
                    scrollToActiveIndex(Math.round(ev.nativeEvent.contentOffset.x / width))
                }}
                // contentContainerStyle={{alignSelf: "flex-end"}}
                renderItem={({item}) =>
                    <View style={{height, width}}>
                        <FastImage
                            source={{uri: getUri(item)}}
                            style={StyleSheet.absoluteFillObject}
                        />
                    </View>
                }
            />

            {
                dataImages.length > 1 &&
                <FlatList
                    ref={bottomRef}
                    data={dataImages}
                    keyExtractor={(item => item.id.toString())}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{
                        position: "absolute",
                        bottom: bottomThumbList,
                    }}
                    contentContainerStyle={{paddingHorizontal: SPACING}}
                    renderItem={({item, index}) =>
                        <TouchableOpacity onPress={() => scrollToActiveIndex(index)}>
                            <FastImage
                                source={{uri: getUri(item)}}
                                style={{
                                    width: IMAGE_SIZE,
                                    height: IMAGE_SIZE,
                                    borderRadius: 12,
                                    marginRight: SPACING,
                                    borderWidth: 2,
                                    borderColor: activeIndex === index ? '#fff' : 'transparent'
                                }}
                            />
                        </TouchableOpacity>
                    }
                />
            }
        </View>
    )
}

export default ImageCarouselComponent
