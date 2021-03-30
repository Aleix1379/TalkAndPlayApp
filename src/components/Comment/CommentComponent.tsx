import React, {useEffect, useState} from 'react'
import {Comment} from "../../types/PostsTypes"
import {StyleSheet, View} from "react-native"
import {Text, withTheme} from 'react-native-paper'
import UserUtils from "../../utils/UserUtils"
import {Theme} from "react-native-paper/lib/typescript/types"
import Time from "../../utils/Time"
// @ts-ignore
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import RoundButtonComponent from "../RoundButtonComponent";
// @ts-ignore
import InView from "react-native-component-inview";
import Markdown, {MarkdownIt} from "react-native-markdown-display";
import AvatarComponent from "../AvatarComponent";
import TopSheetComponent from "../TopSheetComponent/TopSheetComponent";
import {UserState} from "../../store/user/types";
import {connect, shallowEqual, useSelector} from "react-redux";
import {ApplicationState} from "../../store";
import {ModalOption} from "../../screens/PostDetail/PostDetail";
import {closeDialog, openDialog} from "../../store/dialog/actions";
import {DialogOption} from "../../store/dialog/types";

interface CommentProperties {
    comment: Comment
    theme: Theme
    checkVisible: () => void
    reply: (comment: Comment | null) => void
    optionsVisible: boolean,
    setModalVisible: (id: number | null) => void
    onCommentDelete: (id: number | null) => void
    openDialog: (title: string, content: string[], actions: DialogOption[]) => void
    closeDialog: () => void
}

const CommentComponent: React.FC<CommentProperties> = ({
                                                           comment,
                                                           theme,
                                                           checkVisible,
                                                           reply,
                                                           optionsVisible = false,
                                                           setModalVisible,
                                                           onCommentDelete,
                                                           openDialog,
                                                           closeDialog
                                                       }) => {
    const [options, setOptions] = useState<ModalOption[]>([])
    const imageSize = 50
    let replies: any[] = []
    const [resultReplies, setResultReplies] = useState<any>([])
    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)
    const styles = StyleSheet.create({
        comment: {
            backgroundColor: theme.colors.primary,
            paddingTop: 12,
            paddingBottom: 0,
            paddingHorizontal: 8,
            borderRadius: 4,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        details: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 0
        },
        date: {
            marginLeft: "auto"
        },
        image: {
            height: imageSize,
            width: imageSize,
            borderRadius: imageSize / 2,
            marginRight: 12,
            borderWidth: 0,
        },
        options: {}
    })

    const markDownStyles = {
        body: {
            color: theme.colors.text,
            backgroundColor: comment.text ? theme.colors.primary : theme.colors.background,
            marginTop: comment.text ? 4 : 8,
            marginBottom: comment.text ? 4 : 8,
            paddingLeft: comment.text ? 0 : 8
        },
        blockquote: {
            backgroundColor: theme.colors.background,
            marginTop: 12,
            paddingTop: 0
        }
    }

    useEffect(() => {
        const values: ModalOption[] = []

        if (!!comment.text && user?.id !== comment.author.id) {
            values.push({
                id: 'reply',
                action: () => reply(comment),
                icon: 'reply',
                title: 'Reply'
            })
        } else if (!!comment.text && user) {
            values.push({
                id: 'edit',
                action: () => console.log('edit comment....'),
                icon: 'pencil',
                title: 'Edit'
            })
            values.push({
                id: 'delete',
                action: () => openDialog(
                    "Delete comment",
                    ["Permanently delete this comment?", "You can't undo this"],
                    [
                        {
                            label: "Cancel",
                            onPress: () => closeDialog()
                        },
                        {
                            label: "Delete",
                            backgroundColor: theme.colors.error,
                            onPress: () => {
                                closeDialog()
                                onCommentDelete(comment.id)
                            }
                        }
                    ]),
                icon: 'chat-remove',
                title: 'Delete'
            })
        }

        setOptions(values)

        displayReplies(comment.reply)
    }, [])

    const getQuotes = (max: number): string => {
        let quotes = '>'
        for (let i = 0; i < max; i++) {
            quotes += '>'
        }
        return quotes
    }

    const buildReplies = (com: Comment) => {
        replies.push({
            author: com.author.name + '  |  ' + Time.diff(com.lastUpdate),
            text: com.text
        })
        if (com.reply) {
            displayReplies(com.reply)
        } else {
            return replies
        }
    }

    const displayReplies = (com?: Comment) => {
        if (com) {
            let result = buildReplies(com)
            if (result) {
                let message = ''
                result.reverse().forEach((rep: Comment, index) => {
                    message += getQuotes(index) + ' ' + rep.author + '\n' + rep.text + '\n'
                })


                setResultReplies(<Markdown
                    markdownit={
                        MarkdownIt({typographer: true}).disable(['link', 'image'])
                    }
                    mergeStyle={true}
                    style={markDownStyles}
                >
                    {message || '_Comment deleted_'}
                </Markdown>)
            }
        }
    }

    return (
        <View style={styles.comment} onLayout={(_) => checkVisible()}>
            <View style={styles.details}>
                <AvatarComponent
                    borderWidth={0}
                    size={imageSize}
                    style={styles.image}
                    uri={UserUtils.getImageUrl(comment.author)}
                />
                <Text style={{fontSize: 18}}>{comment.author.name}</Text>
                <Text style={styles.date}>{Time.diff(comment.lastUpdate)}</Text>
                {
                    !!comment.text &&
                    <RoundButtonComponent
                        icon="dots-vertical"
                        style={{marginLeft: 6}}
                        iconSize={20}
                        containerSize={25}
                        onPress={() => setModalVisible(comment.id)}
                    />
                }
            </View>

            {resultReplies}

            <Markdown
                markdownit={
                    MarkdownIt({typographer: true}).disable(['link', 'image'])
                }
                mergeStyle={true}
                style={markDownStyles}
            >
                {comment.text || '_Comment deleted_'}
            </Markdown>

            <TopSheetComponent
                visible={optionsVisible}
                onChange={() => setModalVisible(null)}
                options={options}
            />

        </View>
    )
}

export default connect(null, {
    openDialog: openDialog,
    closeDialog: closeDialog
})(withTheme(CommentComponent))
