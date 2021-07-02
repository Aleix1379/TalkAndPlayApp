import React, {useEffect, useState} from 'react'
import {BackHandler, Dimensions, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import Image from "react-native-scalable-image"
import {withTheme} from "react-native-paper"
import HeaderComponent from "../../components/HeaderComponent"
import NewCommentComponent from "../../components/NewCommentComponent"

interface PicturePreviewProperties {
    navigation: any
    theme: Theme
}

const PicturePreviewScreen: React.FC<PicturePreviewProperties> = ({theme, navigation}) => {
    const {image, title, id, onSendImage} = navigation.state.params

    const [message, setMessage] = useState('')

    const styles = StyleSheet.create({
        picturePreview: {
            backgroundColor: theme.colors.background,
            flex: 1,

        },
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
        }
    })

    const handleBackButtonClick = (): boolean => {
        console.log('PICTURE PREVIEW')
        console.log('title: ' + title)
        console.log('id: ' + id)
        navigation.navigate('Detail', {title, id})
        return true
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
        }

    }, [])

    const sendGif = (): void => {
        onSendImage('![gif](' + image + ')\n\n' + message)
        navigation.navigate('Detail', {title, id, image})
    }


    return (
        <>
            <HeaderComponent
                title={title}
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.goBack()
                }}
            />
            <View style={styles.picturePreview}>
                <Image
                    source={{uri: image}}
                    width={Dimensions.get('window').width}
                    resizeMode={'contain'}
                    style={{alignSelf: "center", marginTop: 'auto'}}
                />

                <View style={{marginTop: 'auto'}}>
                    <NewCommentComponent
                        send={sendGif}
                        message={message}
                        onChange={(value: string) => setMessage(value)}
                        minLength={0}
                        label="Add a caption..."
                    />
                </View>

            </View>
        </>
    )
}

export default withTheme(PicturePreviewScreen)
