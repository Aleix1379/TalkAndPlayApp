import React, {useState} from 'react';
import {StyleSheet, View} from "react-native";
import TextInputComponent from "../TextInputComponent";
import {Theme} from "react-native-paper/lib/typescript/types";
import AvatarComponent from "../AvatarComponent";
import {UserState} from "../../store/user/types";
import {shallowEqual, useSelector} from "react-redux";
import {ApplicationState} from "../../store";
import ImageUtils from "../../utils/UserUtils";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Validator from "../../utils/Validator/Validator";
import {ErrorType} from "../../utils/Validator/types";

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
    // const [editComment, setEditComment] = useState(false)

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
        }
    })

    const isMessageValid = (): boolean => message.trim().length > 0 && message.trim().length <= 5000

    const update = (id: string, text: string) => {
        onChange(text)
    }

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

    const getSendStyles = () => {
        const style = {
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 10,
                height: 10,
            },
            shadowOpacity: 1,
            shadowRadius: 5,
            elevation: 25,
            transform: [{rotateZ: "-45deg"}]
        };

        if (isMessageValid()) {
            style.transform = [{rotateZ: "0deg"}]
        }

        return style
    }

    return (
        <View style={styles.newComment}>

            <AvatarComponent theme={theme}
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
                theme={theme}
                style={styles.textInput}
                error={errors.message}
                placeholder="Write a comment..."
            />

            <View onTouchEnd={() => sendComment()}>
                <MaterialCommunityIcons style={getSendStyles()}
                                        name="send"
                                        color={isMessageValid() ? theme.colors.accent : theme.colors.text}
                                        size={26}
                />
            </View>
        </View>
    )
}

export default NewCommentComponent
