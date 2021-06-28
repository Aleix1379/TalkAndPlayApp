import React, {useEffect, useState} from 'react'
import {Animated, Easing, StyleSheet, TextInput, View} from "react-native"
import TextInputComponent from "../TextInputComponent"
import {Theme} from "react-native-paper/lib/typescript/types"
import {connect} from "react-redux"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {withTheme} from "react-native-paper"
import {closeDialog, openDialog} from "../../store/dialog/actions"
import {DialogOption} from "../../store/dialog/types"
import ImagePicker from 'react-native-image-crop-picker'

interface NewCommentProperties {
    theme: Theme
    send: (message: string) => void
    message: string
    onChange: (message: string) => void
    setRef?: (ref: TextInput | null) => void
    onImageChange?: (event: any) => void
    minLength?: number
    label?: string
    openDialog: (title: string, content: string[], actions: DialogOption[]) => void
    closeDialog: () => void
    uploadPicture?: (image: any[]) => void
}

const NewCommentComponent: React.FC<NewCommentProperties> = ({
                                                                 theme,
                                                                 send,
                                                                 message,
                                                                 onChange,
                                                                 setRef,
                                                                 onImageChange,
                                                                 minLength = 1,
                                                                 label = "Write a comment...",
                                                                 uploadPicture
                                                             }) => {
    const [rotationAnimation] = useState(new Animated.Value(0))
    const [colorAnimation] = useState(new Animated.Value(0))
    const [animationStarted, setAnimationStarted] = useState(false)

    const startAnimation = () => {
        Animated.timing(rotationAnimation, {
            useNativeDriver: true,
            toValue: isMessageValid() ? 1 : 0,
            easing: Easing.in(Easing.bounce),
            duration: 1000
        }).start()

        Animated.timing(colorAnimation, {
            useNativeDriver: false,
            toValue: isMessageValid() ? 1 : 0,
            duration: 1000
        }).start()

    }

    const spin = rotationAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['-90deg', '0deg']
    })

    const isMessageValid = (): boolean => message.trim().length >= minLength && message.trim().length <= 5000

    const animatedStyles = {
        rotation: {
            transform: [{rotate: spin}]
        }
    }

    const color = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.text, theme.colors.accent]
    })

    const styles = StyleSheet.create({
        newComment: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.background,
            paddingVertical: 6,
            paddingHorizontal: 6,
            borderTopColor: theme.colors.primary,
            borderTopWidth: 1,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: -10,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        textInput: {
            flex: 1,
            backgroundColor: theme.colors.primary,
            borderRadius: 0,
            marginLeft: 6
        },
        imageIcon: {},
        button: {
            marginLeft: 12,
            right: 5,
            shadowOffset: {
                width: 10,
                height: 10,
            },
            shadowOpacity: 1,
            shadowRadius: 5,
            elevation: 25
        }
    })


    const update = (id: string, text: string) => onChange(text)

    useEffect(() => {
        if (!animationStarted && message.length >= minLength) {
            startAnimation()
            setAnimationStarted(true)
        } else if (animationStarted && message.length < minLength) {
            startAnimation()
            setAnimationStarted(false)
        }
    }, [message])

    const onMessageBlur = () => {
        /*
            if (editComment && message.length === 0) {
                setEditComment(false)
            }
        }*/
    }

    const sendComment = () => {
        if (isMessageValid()) {
            send(message)
            onChange('')
        }
    }

    const choosePicture = (): void => {
        ImagePicker.openPicker({
            cropping: true,
            multiple: true,
            maxFiles: 10,
            showsSelectedCount: true
        })
            .then(response => {
                let images: any[]
                if (Array.isArray(response)) {
                    images = response
                } else {
                    images = [response]
                }
                console.log(images)
                uploadPicture && uploadPicture(images)
            })
            .catch(err => {
                console.log('Error image picker')
                console.log(err)
            })
        /*
        launchImageLibrary(
            {
                mediaType: "photo",
                // @ts-ignore
                allowsMultiple: true

            },
            (result) => {
                if (!result.didCancel) {
                    if (result.fileSize && result.fileSize >= 26214400) {
                        openDialog(
                            "Error",
                            ["'Maximum upload file size: 25MB'"],
                            [
                                {
                                    label: "Close",
                                    onPress: () => closeDialog()
                                }
                            ])
                    } else {
//                        setImage(result)
                        uploadPicture && uploadPicture(result)
                    }
                }
            }
        )
        */
    }

    return (
        <View style={styles.newComment}>

            {/*<AvatarComponent
                borderWidth={0}
                style={{marginLeft: -6}}
                size={40}
                uri={UserUtils.getImageUrl(user)}
            />*/}

            {
                uploadPicture &&
                <View style={styles.imageIcon} onTouchEnd={() => choosePicture()}>
                    <MaterialCommunityIcons
                        name="image-plus"
                        size={26}
                        color={theme.colors.accent}
                    />
                </View>
            }

            <TextInputComponent
                id="new-comment"
                setRef={ref => {
                    setRef && setRef(ref)
                }}
                value={message}
                onChange={update}
                onBlur={onMessageBlur}
                multiLine={true}
                maxLength={5000}
                style={styles.textInput}
                placeholder={label}
                onImageChange={onImageChange}
            />

            <View onTouchEnd={() => sendComment()}>
                <Animated.View style={[styles.button, animatedStyles.rotation]}>
                    <Animated.Text style={{color: color}}>
                        <MaterialCommunityIcons name="send" size={26}/>
                    </Animated.Text>
                </Animated.View>
            </View>
        </View>
    )
}

export default connect(null,
    {
        openDialog: openDialog,
        closeDialog: closeDialog
    }
)
(withTheme(NewCommentComponent))
