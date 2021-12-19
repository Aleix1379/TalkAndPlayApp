import React, {useEffect, useRef, useState} from 'react'
import {Comment, User} from "../../types/PostsTypes"
import {Dimensions, StyleSheet, View} from "react-native"
import {Text, withTheme} from 'react-native-paper'
import {Theme} from "react-native-paper/lib/typescript/types"
import Time from "../../utils/Time"
// @ts-ignore
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
// @ts-ignore
import InView from "react-native-component-inview"
import AvatarComponent from "../AvatarComponent"
import {connect, shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import {ModalOption} from "../../screens/PostDetail/PostDetail"
import {DialogOption} from "../../store/dialog/types"
// @ts-ignore
import Markdown from 'react-native-simple-markdown'
import YoutubePlayer from "react-native-youtube-iframe"
import CommentUtils from "../../utils/Comment"
import Image from "react-native-scalable-image"
import RoundButtonComponent from "../RoundButtonComponent"
import ImageCarouselComponent from "../ImageCarouselComponent"
import BottomSheetComponent from "../BottomSheetContentComponent"
import {closeDialog, openDialog} from "../../store/dialog/actions"
import RBSheet from "react-native-raw-bottom-sheet"
import {REACT_APP_IMAGES_URL} from "@env"
import ButtonComponent from "../ButtonComponent"

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
    blocked?: number[]
    onBlockUser: (userToBlock: number) => void
    onUnblockUser: (userToBlock: number) => void
}

const CommentComponent: React.FC<CommentProperties> = (
    {
        comment,
        theme,
        checkVisible,
        reply,
        onCommentDelete,
        openDialog,
        closeDialog,
        editComment,
        onReport,
        goToProfile,
        blocked = [],
        onBlockUser,
        onUnblockUser
    }
) => {
    const refRBSheet = useRef()
    const [options, setOptions] = useState<ModalOption[]>([])
    const imageSize = 40
    let replies: any[] = []
    const [resultReplies, setResultReplies] = useState<any>([])
    const {height, width} = Dimensions.get('screen')
    const [userBlocked, setUserBlocked] = useState<boolean>(blocked.some(id => id === comment.author?.id))

    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const styles = StyleSheet.create({
        comment: {
            backgroundColor: theme.colors.primary,
            paddingTop: 10,
            paddingBottom: 0,
            paddingHorizontal: 0,
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
            marginLeft: "auto",
            fontSize: 10
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
            borderRadius: 3,
            marginLeft: 0
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
        },
        unavailable: {
            color: '#747474'
        }
    })

    const markDownStyles = {
        view: {
            marginTop: 8,
            marginLeft: 6,
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

    const blockUser = () => {
        openDialog(
            "Block user",
            [`You will not see comments or receive messages from @${comment.author?.name}`],
            [
                {
                    label: 'Cancel',
                    onPress: () => closeDialog()
                },
                {
                    label: 'Block',
                    backgroundColor: theme.colors.error,
                    onPress: () => {
                        onBlockUser(comment.author?.id || -1)
                        closeDialog()
                    }
                }
            ]
        )
    }

    const unblockUser = () => {
        openDialog(
            "Unblock user",
            [`You will see comments or receive messages from @${comment.author?.name}`],
            [
                {
                    label: 'Cancel',
                    onPress: () => closeDialog()
                },
                {
                    label: 'Unblock',
                    backgroundColor: theme.colors.error,
                    onPress: () => {
                        onUnblockUser(comment.author?.id || -1)
                        closeDialog()
                    }
                }
            ]
        )
    }

    const showExtraOptions = (): boolean => (!!comment.text || comment.images.length > 0) && user.id >= 0

    function updateModalOptions() {
        const values: ModalOption[] = []

        if ((!!comment.text || comment.images.length > 0) && user?.id !== comment.author?.id && user.id >= 0) {
            values.push({
                id: 'reply',
                action: () => reply(comment),
                icon: 'reply',
                title: 'Reply comment'
            })
            values.push({
                id: 'report',
                action: () => sendReport(),
                icon: 'alert',
                title: 'Report comment'
            })

            if (userBlocked) {
                values.push({
                    id: 'unblock',
                    action: () => unblockUser(),
                    icon: 'account',
                    title: 'Unblock user'
                })
            } else {
                values.push({
                    id: 'block',
                    action: () => blockUser(),
                    icon: 'account-cancel',
                    title: 'Block user'
                })
            }
        } else if (showExtraOptions()) {
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
    }

    useEffect(() => {
        updateModalOptions()
        displayReplies(comment.reply)
    }, [])

    useEffect(() => {
        setUserBlocked(blocked.some(id => id === comment.author?.id))
    }, [blocked])

    useEffect(() => updateModalOptions(), [userBlocked])

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
            author: !com.author ? 'user deleted' : com.author.name + '  ❱  ' + Time.diff(com.lastUpdate),
            avatar: com.author?.avatar,
            text: com.text,
            images: com.images
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
                return <Text key={index + ' ' + i} style={{alignSelf: 'center'}}>{it.content}</Text>
            } else if (it.type === 'image') {
                return <AvatarComponent
                    key={i}
                    path={it.target}
                    borderWidth={0}
                    size={32}
                    style={{marginVertical: 3, marginRight: 6}}
                />
            } else if (it.type === 'paragraph') {
                return buildLine(it.content, 0)
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

    const isSmallImage = (text: string): boolean => text.startsWith("https://media.googleusercontent.com") || text.startsWith("https://www.gstatic.com")

    const getCustomImage = (width: number, diff: number = 0) => {
        return {
            react: (node: any, output: any, state: any) => {
                if (node.target.includes("youtube.com") || node.target.includes("youtu.be")) {
                    return (
                        <View key={node.target} style={{right: diff === 16 ? 0 : 8}}>
                            <YoutubePlayer
                                key={node.target}
                                height={0.56 * width}
                                width={width - diff}
                                videoId={CommentUtils.getIdByUrl(node.target)}
                                webViewStyle={{opacity: 0.99, marginVertical: node.target === comment.text ? 0 : 8}}
                            />
                        </View>
                    )

                }
                console.log('node.target: ', node.target)
                return <Image
                    key={state.key}
                    source={{uri: node.target}}
                    width={isSmallImage(node.target) ? 100 : width - diff}
                    resizeMode={'contain'}
                    style={
                        [styles.imageContainer,
                            {
                                marginLeft: isSmallImage(node.target) ? 8 : 0,
                                right: isSmallImage(node.target) ? 0 : diff == 0 ? 8 : 0,
                                marginBottom: isSmallImage(node.target) ? 0 : 8
                            }
                        ]
                    }
                />
            }
        }
    }

    const displayReplies = (com?: Comment) => {
        console.log('displayReplies...........................')
        if (com && com.author) {

            console.log('com: ', com)
            let result = buildReplies(com)
            console.log('result: ', JSON.stringify(result))
            if (result) {
                let message = ''
                result.reverse().forEach((rep: any, index) => {
                    message += getQuotes(index) + ' ![](' + REACT_APP_IMAGES_URL + rep.avatar + ') ' + rep.author + ' \n\n' + rep.text + '\n'
                })


                console.log('setResultReplies......................')
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
                            image: getCustomImage(getImageSize(), 16)
                        }}
                    >
                        {getTextToShow(message)}
                    </Markdown>
                )
            }
        }
    }

    // const isEmoji = (value: string): boolean => {
    //     return false // value.startsWith("![gif](https://media.googleusercontent.com") || comment.text.startsWith("![gif](https://www.gstatic.com")
    // }
    const getImageSize = () => {
        // if (isEmoji(value || comment.text)) {
        //     return 100
        // }
        return Dimensions.get('window').width
    }

    const getTextToShow = (value: string) => {
        if (comment.images.length > 0) {
            return CommentUtils.processYoutubeUrl(value)
        } else {
            return CommentUtils.processYoutubeUrl(value) || '💀 _Comment deleted_'
        }
    }

    return (
        <View style={styles.comment} onLayout={(_) => checkVisible()}>
            <View style={styles.details}>
                {
                    !comment.author &&
                    <Text style={[{marginLeft: 8}, styles.unavailable]}>💀 User deleted</Text>
                }
                {
                    comment.author &&
                    <>
                        <View onTouchEnd={() => goToProfile(comment.author!.email)}>
                            <AvatarComponent
                                borderWidth={0}
                                size={imageSize}
                                style={[styles.image, {marginLeft: 8}]}
                                name={comment.author.avatar}
                            />
                        </View>
                        <Text onPress={() => user.id >= 0 && goToProfile(comment.author!.email)}>
                            {comment.author.name}
                        </Text>
                        <Text
                            style={[styles.date, {color: '#959595', marginRight: showExtraOptions() ? 0 : 6}]}>
                            {Time.diff(comment.lastUpdate)}
                        </Text>
                        {
                            showExtraOptions() &&
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
                    </>
                }
            </View>

            {resultReplies}

            {
                !userBlocked &&
                <ImageCarouselComponent
                    dataImages={comment.images}
                    height={height - 230}
                    width={width}
                    style={{
                        position: 'relative',
                        marginTop: 8,
                        marginBottom: comment.text.length === 0 && comment.images.length > 0 ? 0 : 8
                    }}
                    bottomThumbList={10}
                />
            }

            {
                userBlocked &&
                <View style={{marginLeft: 8, marginBottom: 8}}>
                    <Text style={[{
                        fontWeight: 'bold',
                        marginTop: 12,
                        marginBottom: 6
                    }, styles.unavailable]}>@{comment.author?.name} is blocked</Text>
                    <Text style={styles.unavailable}>
                        Are you sure you want to view this comment? Viewing this comment
                        won't unblock {comment.author?.name}
                    </Text>

                    <ButtonComponent
                        label="View comment"
                        fontSize={12}
                        onPress={() => setUserBlocked(false)}
                        style={{
                            backgroundColor: theme.colors.background,
                            height: 20,
                            width: 100,
                            marginTop: 16,
                            marginBottom: 8,
                            alignSelf: 'center'
                        }}
                    />
                </View>
            }

            {
                !userBlocked && comment.author && (comment.text.length > 0 || comment.text.length === 0 && comment.images.length === 0) &&
                <Markdown
                    styles={{
                        text: {
                            color: comment.text ? theme.colors.text : '#747474',
                        },
                        view: {
                            marginBottom: 8,
                            paddingLeft: 8,
                        }
                    }}
                    rules={{image: getCustomImage(getImageSize())}}
                >
                    {getTextToShow(comment.text)}
                </Markdown>
            }

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
                        backgroundColor: 'rgba(10, 10, 10, 0.95)',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 26,
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
