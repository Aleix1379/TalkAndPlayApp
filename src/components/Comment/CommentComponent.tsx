import React, {useEffect, useRef, useState} from 'react'
import {Comment} from "../../types/PostsTypes"
import {Dimensions, StyleSheet, View} from "react-native"
import {Text, withTheme} from 'react-native-paper'
import UserUtils from "../../utils/UserUtils"
import {Theme} from "react-native-paper/lib/typescript/types"
import Time from "../../utils/Time"
// @ts-ignore
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import RoundButtonComponent from "../RoundButtonComponent"
// @ts-ignore
import InView from "react-native-component-inview"
import AvatarComponent from "../AvatarComponent"
import {UserState} from "../../store/user/types"
import {connect, shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import {ModalOption} from "../../screens/PostDetail/PostDetail"
import {closeDialog, openDialog} from "../../store/dialog/actions"
import {DialogOption} from "../../store/dialog/types"
// @ts-ignore
import Markdown from 'react-native-simple-markdown'
import Image from 'react-native-scalable-image'
import YoutubePlayer from "react-native-youtube-iframe"
import CommentUtils from "../../utils/Comment";
import RBSheet from "react-native-raw-bottom-sheet"
import BottomSheetComponent from "../BottomSheetContentComponent";

interface CommentProperties {
    comment: Comment
    theme: Theme
    checkVisible: () => void
    reply: (comment: Comment | null) => void
    onCommentDelete: (id: number | null) => void
    openDialog: (title: string, content: string[], actions: DialogOption[]) => void
    closeDialog: () => void
    editComment: (comment: Comment) => void
    onReport: (id: number) => void
    goToProfile: (email: string) => void
}

const CommentComponent: React.FC<CommentProperties> = ({
                                                           comment,
                                                           theme,
                                                           checkVisible,
                                                           reply,
                                                           onCommentDelete,
                                                           openDialog,
                                                           closeDialog,
                                                           editComment,
                                                           onReport,
                                                           goToProfile
                                                       }) => {
    const refRBSheet = useRef()
    const [options, setOptions] = useState<ModalOption[]>([])
    const imageSize = 35
    let replies: any[] = []
    const [resultReplies, setResultReplies] = useState<any>([])
    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)
    const styles = StyleSheet.create({
        comment: {
            backgroundColor: theme.colors.primary,
            paddingTop: 10,
            paddingBottom: 0,
            paddingHorizontal: 6,
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
            marginBottom: 8
        },
        date: {
            marginLeft: "auto",
            fontSize: 12
        },
        image: {
            height: imageSize,
            width: imageSize,
            borderRadius: imageSize / 2,
            marginRight: 12,
            borderWidth: 0,
        },
        options: {},
        imageContainer: {
            marginTop: 8,
            marginBottom: 6,
            borderRadius: 3,
        },
        option: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 8,
            marginLeft: 8,
            paddingVertical: 4
        },
        optionText: {
            fontSize: 18,
            marginLeft: 16,
            flex: 1,
        }
    })

    const markDownStyles = {
        view: {
            marginTop: 10,
            marginLeft: 6,
            marginBottom: 8,
            backgroundColor: theme.colors.background,
            paddingHorizontal: 4,
            paddingVertical: 4,
            borderLeftWidth: 2,
            borderLeftColor: theme.colors.text,
        },
        text: {
            color: theme.colors.text,
            display: 'flex',
            flexDirection: 'row',
        }
    }

    const sendReport = (): void => {
        if (comment.id) {
            onReport(comment.id)
        }
    }

    useEffect(() => {
        const values: ModalOption[] = []

        if (!!comment.text && user?.id !== comment.author.id && user.id >= 0) {
            values.push({
                id: 'reply',
                action: () => reply(comment),
                icon: 'reply',
                title: 'Reply'
            })
            values.push({
                id: 'report',
                action: () => sendReport(),
                icon: 'alert',
                title: 'Report'
            })
        } else if (!!comment.text && user.id >= 0) {
            values.push({
                id: 'edit',
                action: () => editComment(comment),
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
        for (let i = 0; i < max && i < 1; i++) {
            quotes += '>'
        }
        if (max > 0) {
            quotes = '\n' + quotes
        }
        return quotes
    }

    const buildReplies = (com: Comment) => {
        replies.push({
            author: com.author.name + '  ❱  ' + Time.diff(com.lastUpdate),
            text: com.text
        })
        if (com.reply) {
            displayReplies(com.reply)
        } else {
            return replies
        }
    }

    const buildLine = (content: any, index: number): any => {
        const value = content.map((it: any, i: number) => {
            if (it.type === 'text') {
                return <Text key={index + ' ' + i}>{it.content}</Text>
            }
            return <Text key={index + ' ' + i}>{it.content.map((ct: any) => ct.content)}</Text>
        })
        return <View
            key={index}
            style={{
                backgroundColor: 'rgba(7,90,171,0.32)',
                flex: 1,
                flexDirection: 'row',
                marginTop: index > 0 ? 14 : 0,
                paddingLeft: 4,
                marginBottom: 4,
            }}>
            {value}
        </View>
    }

    const getCustomImage = (width: number) => {
        return {
            react: (node: any, output: any, state: any) => {
                if (node.target.includes("youtube.com") || node.target.includes("youtu.be")) {
                    return (
                        <YoutubePlayer
                            key={node.target}
                            height={0.56 * width}
                            width={width}
                            videoId={CommentUtils.getIdByUrl(node.target)}
                            webViewStyle={{marginTop: 8, marginBottom: 8, opacity: 0.99}}
                        />
                    )

                }
                return <Image
                    key={state.key}
                    source={{uri: node.target}}
                    width={width}
                    resizeMode={'contain'}
                    style={styles.imageContainer}
                />
            }
        }
    }

    const displayReplies = (com?: Comment) => {
        if (com) {
            let result = buildReplies(com)
            if (result) {
                let message = ''
                result.reverse().forEach((rep: Comment, index) => {
                    message += getQuotes(index) + rep.author + ' \n\n' + rep.text + '\n'
                })


                setResultReplies(
                    <Markdown
                        styles={markDownStyles}
                        rules={{
                            blockQuote: {
                                react: (node: any, output: any, state: any) => {
                                    const items: any[] = []
                                    node.content.forEach((item: any) => {
                                        items.push({index: state.key, content: item.content})
                                    })
                                    return items.map((it) => buildLine(it.content, it.index))
                                }
                            },
                            image: getCustomImage(getImageSize() - 15)
                        }}
                    >
                        {CommentUtils.processYoutubeUrl(message) || '💀 _Comment deleted_'}
                    </Markdown>
                )
            }
        }
    }

    const isEmoji = (): boolean => {
        return comment.text.startsWith("![gif](https://media.googleusercontent.com") || comment.text.startsWith("![gif](https://www.gstatic.com")
    }
    const getImageSize = () => {
        if (isEmoji()) {
            return 100
        }
        return Dimensions.get('window').width - 12
    }

    // @ts-ignore
    // @ts-ignore
    return (
        <View style={styles.comment} onLayout={(_) => checkVisible()}>
            <View style={styles.details}>
                <View onTouchEnd={() => goToProfile(comment.author.email)}>
                    <AvatarComponent
                        borderWidth={0}
                        size={imageSize}
                        style={styles.image}
                        uri={UserUtils.getImageUrl(comment.author)}
                    />
                </View>
                <Text
                    style={{
                        color: user.id >= 0 && user.id !== comment.author.id ? '#238cff' : '#959595'
                    }}
                    onPress={() => user.id >= 0 && goToProfile(comment.author.email)}>{comment.author.name}</Text>
                <Text
                    style={[styles.date, {color: '#959595', marginRight: !!comment.text && user.id >= 0 ? 0 : 6}]}>
                    {Time.diff(comment.lastUpdate)}
                </Text>
                {
                    !!comment.text && user.id >= 0 &&
                    <RoundButtonComponent
                        icon="dots-vertical"
                        iconSize={20}
                        containerSize={25}
                        onPress={() => {
                            // @ts-ignore
                            refRBSheet?.current?.open()
                        }}
                    />
                }
            </View>

            {resultReplies}

            <Markdown
                styles={{
                    text: {
                        color: comment.text ? theme.colors.text : '#747474'
                    },
                    view: {
                        marginBottom: 8
                    }
                }}
                rules={{image: getCustomImage(getImageSize())}}
            >
                {CommentUtils.processYoutubeUrl(comment.text) || '💀 _Comment deleted_'}
            </Markdown>

            <RBSheet
                // @ts-ignore
                ref={refRBSheet}
                height={options.length * 70}
                openDuration={250}
                closeOnDragDown={true}
                closeOnPressMask={true}
                closeOnPressBack={true}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(33,33,33,0.25)'
                    },
                    draggableIcon: {
                        backgroundColor: theme.colors.accent
                    },
                    container: {
                        backgroundColor: theme.colors.surface,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        paddingLeft: 12
                    }
                }}
            >
                <BottomSheetComponent options={options} sheet={refRBSheet}/>
            </RBSheet>

        </View>
    )
}

export default connect(null, {
    openDialog: openDialog,
    closeDialog: closeDialog
})(withTheme(CommentComponent))
