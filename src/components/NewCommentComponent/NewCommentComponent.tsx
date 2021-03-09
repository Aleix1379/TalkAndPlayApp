import React, {useEffect, useState} from 'react'
import {Animated, StyleSheet, View} from "react-native"
import TextInputComponent from "../TextInputComponent"
import {Theme} from "react-native-paper/lib/typescript/types"
import AvatarComponent from "../AvatarComponent"
import {UserState} from "../../store/user/types"
import {shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import ImageUtils from "../../utils/UserUtils"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Validator from "../../utils/Validator/Validator"
import {ErrorType} from "../../utils/Validator/types"
import {withTheme} from "react-native-paper"

interface Errors {
    message: ErrorType
}

interface NewCommentProperties {
    theme: Theme
    send: (message: string) => void
    message: string
    onChange: (message: string) => void

}

const NewCommentComponent: React.FC<NewCommentProperties> = ({theme, send, message, onChange}) => {
    const [upperAnimation] = useState(new Animated.Value(0))
    const [colorAnimation] = useState(new Animated.Value(0))

    const startAnimation = () => {
        Animated.timing(upperAnimation, {
            useNativeDriver: true,
            toValue: isMessageValid() ? 1 : 0,
            duration: 600
        }).start()

        Animated.timing(colorAnimation, {
            useNativeDriver: false,
            toValue: isMessageValid() ? 1 : 0,
            duration: 1000
        }).start();

    }

    const spin = upperAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['-45deg', '0deg']
    })

    const isMessageValid = (): boolean => message.trim().length > 0 && message.trim().length <= 5000

    const animatedStyles = {
        upper: {
            transform: [{rotate: spin}]
        }
    }

    const color = colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.colors.text, theme.colors.accent]
    });

    const [errors, setFormErrors] = useState<Errors>({
        message: {
            message: '',
            touched: false,
            label: 'Message',
            validations: [
                {
                    key: 'MAX_LENGTH',
                    value: 5000
                }
            ]
        }
    })

    const validator = new Validator(errors, setFormErrors)

    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const styles = StyleSheet.create({
        newComment: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.colors.background,
            paddingVertical: 6,
            paddingHorizontal: 12,
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
            marginHorizontal: 12
        },
        button: {
            shadowColor: '#FF00AA',
            shadowOffset: {
                width: 10,
                height: 10,
            },
            shadowOpacity: 1,
            shadowRadius: 5,
            elevation: 25
        }
    })


    const update = (id: string, text: string) => {
        onChange(text)
    }

    useEffect(() => {
        startAnimation()
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

    return (
        <View style={styles.newComment}>

            <AvatarComponent
                style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    borderWidth: 0
                }}
                uri={ImageUtils.getImageUrl(user)}/>
            <TextInputComponent
                id="new-comment"
                value={message}
                onChange={update}
                onBlur={onMessageBlur}
                multiLine={true}
                maxLength={5000}
                style={styles.textInput}
                error={errors.message}
                placeholder="Write a comment..."
            />

            <View onTouchEnd={() => sendComment()}>
                <Animated.View style={[styles.button, animatedStyles.upper]}>
                    <Animated.Text style={{color: color}}>
                        <MaterialCommunityIcons name="send"
                                                size={26}
                        />
                    </Animated.Text>
                </Animated.View>
            </View>
        </View>
    )
}

export default withTheme(NewCommentComponent)
