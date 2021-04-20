import React, {useEffect, useState} from 'react'
import {Dimensions, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import HeaderComponent from "../../components/HeaderComponent"
import {withTheme} from "react-native-paper"
import PictureService from "../../services/PictureService";
import {UserState} from "../../store/user/types";
import {shallowEqual, useSelector} from "react-redux";
import {ApplicationState} from "../../store";
import {REACT_APP_IMAGES_URL} from "@env"
import Image from "react-native-scalable-image"
import NewCommentComponent from "../../components/NewCommentComponent/NewCommentComponent";

interface PictureUploadProperties {
    navigation: any
    theme: Theme
}

const PictureUploadScreen: React.FC<PictureUploadProperties> = ({theme, navigation}) => {
    const {image, title, id, onSendPicture} = navigation.state.params
    const [message, setMessage] = useState('')
    const pictureService = new PictureService()
    const [uri, setUri] = useState<string | null>(null)
    const styles = StyleSheet.create({
        pictureUpload: {
            flex: 1,
            backgroundColor: theme.colors.background
        }
    });

    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const uploadPicture = () => {
        onSendPicture('![gif](' + REACT_APP_IMAGES_URL + '/' + user.id + '_' + image.fileName + ')\n\n' + message)
        navigation.navigate('Detail', {title, id})
    }

    const getPictureUrl = () => {
        // return '![gif](' + REACT_APP_IMAGES_URL + '/' + user.id + '_' + image.fileName + ')'
        return REACT_APP_IMAGES_URL + '/' + user.id + '_' + image.fileName
    }

    useEffect(() => {
        if (image.fileName) {
            pictureService.fileUpload(image, image.fileName)
                .then(() => {
                    setUri(getPictureUrl)
                    // sendComment('![gif](' + REACT_APP_IMAGES_URL + '/' + user.id + '_' + image.fileName + ')')
                })
                .catch(err => {
                    console.log('error uploading image')
                    console.log(err)
                })
        }
    }, [])

    return (
        <>
            <HeaderComponent
                title={title}
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.goBack()
                }}
            />
            <View style={styles.pictureUpload}>
                {
                    uri &&
                    <Image
                        source={{uri}}
                        width={Dimensions.get('window').width}
                        resizeMode={'contain'}
                        style={{alignSelf: "center", marginTop: 'auto'}}
                    />
                }

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
