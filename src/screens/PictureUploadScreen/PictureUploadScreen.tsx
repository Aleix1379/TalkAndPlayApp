import React, {useEffect, useState} from 'react'
import {Dimensions, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import HeaderComponent from "../../components/HeaderComponent"
import {withTheme} from "react-native-paper"
import PictureService from "../../services/PictureService"
import NewCommentComponent from "../../components/NewCommentComponent/NewCommentComponent"
// @ts-ignore
import ImgToBase64 from 'react-native-image-base64'
import {User} from "../../types/PostsTypes";
import {shallowEqual, useSelector} from "react-redux";
import {ApplicationState} from "../../store";
import ImageCarouselComponent from "../../components/ImageCarouselComponent";

interface PictureUploadProperties {
    navigation: any
    theme: Theme
}

export interface ImageSelected {
    id?: number
    base64: string
    mime: string
    name: string
}

const PictureUploadScreen: React.FC<PictureUploadProperties> = ({theme, navigation}) => {
    const {images, title, id, onSendPicture} = navigation.state.params
    const [message, setMessage] = useState('')
    const pictureService = new PictureService()
    const [dataImages, setDataImages] = useState<ImageSelected[]>([])
    const {height, width} = Dimensions.get('screen')

    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const getImageName = (path: string): string => `${user.id}_${new Date().getTime()}_${path.split("/").pop() || ''}`

    const uploadPicture = () => {
        pictureService.fileUpload(dataImages.map((it) => ({
            base64: it.base64,
            name: it.name,
        })))
            .then((response) => {
                onSendPicture(message, response)
                navigation.navigate('Detail', {title, id})
            })
            .catch(err => {
                console.log('fileUpload')
                console.log(JSON.stringify(err.message))
            })
    }

    const convertImages = async () => {
        let values: ImageSelected[] = []
        let base64String = null
        let i = 0
        for (const image of images) {
            try {
                base64String = await ImgToBase64.getBase64String(image.path)
                values.push({
                    id: i++,
                    base64: base64String,
                    mime: image.mime,
                    name: getImageName(image.path),
                })
            } catch (err) {
                console.log('Error getBase64String => ' + JSON.stringify(images[0]))
                console.log(err)
            }
        }
        setDataImages(values)
    }

    useEffect(() => {
        convertImages().catch(err => {
            console.log('error convertImages')
            console.log(err)
        })
    }, [images])


    return (
        <>
            <HeaderComponent
                title={title}
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.goBack()
                }}
            />
            <View style={{
                flex: 1,
                backgroundColor: theme.colors.background
            }}>

                <ImageCarouselComponent
                    height={height}
                    width={width}
                    dataImages={dataImages}
                    // bottomThumbList={10}
                />

                <View style={{marginTop: 'auto'}}>
                    <NewCommentComponent
                        send={uploadPicture}
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

export default withTheme(PictureUploadScreen)
