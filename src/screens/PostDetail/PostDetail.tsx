import React, {MutableRefObject, useEffect, useRef, useState} from 'react'
import {Text, withTheme} from 'react-native-paper'
import {Theme} from "react-native-paper/lib/typescript/types"
import {BackHandler, Dimensions, ScrollView, StyleSheet, View} from "react-native"
import {Channel, Comment, CommentResponse, Option, PostInfo, PostType} from "../../types/PostsTypes"
import PostsService from "../../services/Posts"
import Info from "../../components/Info"
import CommentComponent from "../../components/Comment"
import PaginationComponent from "../../components/PaginationComponent"
import LocalStorage from "../../utils/LocalStorage/LocalStorage"
import NewCommentComponent from "../../components/NewCommentComponent"
import {UserState} from "../../store/user/types"
import {connect, shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import HeaderComponent from "../../components/HeaderComponent";
import {closeModal, openModal} from "../../store/topSheet/actions";
import {setLoading} from "../../store/loading/actions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ReplyToComponent from "../../components/ReplyToComponent";
import {closeDialog, openDialog} from "../../store/dialog/actions";
import {DialogOption} from "../../store/dialog/types";
import {ImagePickerResponse} from "react-native-image-picker";
import {BannerAd, BannerAdSize, TestIds} from "@react-native-firebase/admob";

interface PostDetailProperties {
    navigation: any
    theme: Theme
    openModal: (options: ModalOption[], top: number, onChange?: () => void) => void
    closeModal: () => void
    setLoading: (visible: boolean) => void
    openDialog: (title: string, content: string[], actions: DialogOption[]) => void
    closeDialog: () => void
}

interface InfoPage {
    number: number
    totalOfElements: number
    totalPages: number
}

export interface ModalOption {
    id: string
    icon: string
    title: string
    action: Function
}

const PostDetailScreen: React.FC<PostDetailProperties> = ({
                                                              navigation,
                                                              theme,
                                                              openModal,
                                                              closeModal,
                                                              setLoading,
                                                              openDialog,
                                                              closeDialog
                                                          }) => {
    const {title, id} = navigation.state.params
    const postType: PostType = navigation.state.params.postType
    const [post, setPost] = useState<PostInfo | null>(navigation.state.params.post)
    const lastIndex = navigation.state.params.lastIndex
    const [comments, setComments] = useState<Comment[]>()
    const postService = new PostsService()
    const [elementsPerPage, setElementsPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [page, setPage] = useState<InfoPage>()
    const scrollRef: MutableRefObject<any> = useRef()
    const sheetRef = React.useRef(null)
    const [isModalOpened, setIsModalOpened] = useState(true)
    const [modalOptions, setModalOptions] = useState<ModalOption[]>([])
    const [message, setMessage] = useState('')
    const [unseenMessages, setUnseenMessages] = useState(0)
    const [pageFirstUnseenComment, setPageFirstUnseenComment] = useState(0)
    const [lastCommentId, setLastCommentId] = useState(0)
    const [dataSourceCords, setDataSourceCords] = useState<any>([])
    const [manualScrollEnabled, setManualScrollEnabled] = useState(false)
    const [optionsVisible, setOptionsVisible] = useState<any>({})
    const [commentToReply, setCommentToReply] = useState<Comment | null>(null)
    const [editModeEnabled, setEditModeEnabled] = useState(false)
    const [commentId, setCommentId] = useState<number | null>(null)
    const [comment, setComment] = useState<Comment | null>()
    let inputRef: any = null
    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const styles = StyleSheet.create({
        post: {
            backgroundColor: theme.colors.background,
            // paddingHorizontal: 4
        },

        postDetail: {
            marginTop: 4
        },
        ads: {
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around"
        },
        comments: {
            marginBottom: 0
        },
        pagination: {
            display: "flex",
            flexDirection: "row",
            marginTop: 8,
            marginBottom: 4
        },
        goToFirstUnSeen: {
            backgroundColor: theme.colors.accent,
            marginLeft: 6,
            marginTop: 4,
            marginRight: 'auto',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 28,
            width: 28,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            borderRadius: 4,
            marginHorizontal: 10,
        },
    })

    const handleBackButtonClick = (): boolean => {
        goBack()
        return true
    }

    useEffect(() => {
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)

            LocalStorage.getMessagesSeen()
                .then(data => {
                    postService.getCommentsUnseen(data).then(values => {
                        let lastId = data[id]
                        setLastCommentId(lastId)
                        if (id && lastId) {
                            postService.getPageFirstUnseenComment(id, lastId, 10)
                                .then(newPage => {
                                    setPageFirstUnseenComment(newPage)
                                })
                                .catch(err => {
                                    console.log('postService.getPageFirstUnseenComment')
                                    console.log(err)
                                })
                            if (values[id] > 0) {
                                setUnseenMessages(values[id])
                            }
                        }
                    })
                        .catch(err => {
                            console.log('postService.getCommentsUnseen')
                            console.log(err)
                        })
                })

            LocalStorage.getCommentsPerPage()
                .then(value => setElementsPerPage(value))
                .catch(error => {
                    console.log('LocalStorage.getCommentsPerPage')
                    console.error(error)
                })

            if (!post) {
                postService.getPostById(id)
                    .then(response => {
                        setPost(response)
                    })
                    .catch(err => {
                        console.log('postService.getPostById(')
                        console.log(err)
                    })
            }
            postService.getCommentsByPost(id)
                .then((response: CommentResponse) => {
                    setPage({
                        number: response.number,
                        totalOfElements: response.totalElements,
                        totalPages: response.totalPages
                    })
                    setComments(response.content)
                })
                .catch(err => {
                    console.log('postService.getCommentsByPost')
                    console.log(err)
                })

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
            }

        }, []
    )

    useEffect(() => {
        if (manualScrollEnabled && dataSourceCords[lastCommentId] && lastCommentId) {
            scrollToElement(lastCommentId)
        }
    }, [dataSourceCords])

    useEffect(() => {
        loadPostOptions()
    }, [post])

    useEffect(() => {
        // @ts-ignore
        isModalOpened ? sheetRef.current?.snapTo(0) : sheetRef.current?.snapTo(1)
    }, [isModalOpened])

    const isOwner = (usr: UserState | null): boolean => {
        return usr?.id === user.id
    }

    const editPost = () => navigation.navigate('PostEdit', {title, id, updatePost: setPost, postType})

    const reportPost = () => navigation.navigate('Report', {id, type: 'post'})

    const loadPostOptions = () => {
        const options: ModalOption[] = []
        if (post && isOwner(post.user)) {
            options.push({
                id: 'edit',
                icon: 'pencil-outline',
                title: 'Edit',
                action: editPost
            })

            options.push({
                id: 'delete',
                icon: 'trash-can-outline',
                title: 'Delete',
                action: () => openDialog(
                    "Delete post",
                    ["Permanently delete this post and all the comments?", "You can't undo this"],
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
                                deletePost()
                            }
                        }
                    ])
            })
        } else if (user.id >= 0) {
            options.push({
                id: 'report',
                icon: 'alert',
                title: 'Report',
                action: reportPost
            })
        }
        setModalOptions(options)
    }

    const scrollToTop = (scrollTo: 'top' | 'bottom' = 'top') => {
        setTimeout(() => {
            if (scrollTo === 'top') {
                scrollRef.current?.scrollTo({
                    y: 0,
                    animated: true,
                })
            } else {
                scrollRef.current?.scrollToEnd({animated: true})
            }
        }, 50)
    }

    const scrollToElement = (commentId: number): void => {
        const index = comments?.findIndex(comment => comment.id === commentId)
        console.log('INDEX: ' + index)
        // @ts-ignore
        const y = dataSourceCords[commentId]
        console.log('Y')
        console.log(y)
        if (index && index >= 0) {
            // @ts-ignore
            scrollRef.current?.scrollTo({
                x: 0,
                y,
                animated: true,
            })
        }
        setUnseenMessages(0)
    }

    const fetchComments = (
        scrollTo: 'top' | 'bottom' = 'top',
        newPage?: number,
        commentId?: number
    ) => {
        // setShowDummy(true)
        if (post) {
            if (!commentId && scrollTo === 'top') {
                scrollToTop()
            }

            let size = elementsPerPage

            postService
                .getCommentsByPost(
                    post.id,
                    scrollTo === 'bottom' && page
                        ? page.totalOfElements < page.totalPages * size
                        ? page.totalPages - 1
                        : page.totalPages
                        : newPage! >= 0
                        ? newPage
                        : currentPage,
                    size
                )
                .then((data) => {
                    setPage({
                        number: data.number,
                        totalOfElements: data.totalElements,
                        totalPages: data.totalPages
                    })
                    setComments(data.content)
                    if (!commentId && scrollTo === 'bottom') {
                        setCurrentPage(data.totalPages - 1)
                        scrollToTop(scrollTo)
                    } else {
                        if (newPage! >= 0) {
                            setCurrentPage(newPage!)
                        }
                    }
                })
                .finally(() => {
                    //setShowNoData(true)
                    //setShowDummy(false)
                })
        }
    }

    const sendComment = (message: string) => {
        const comment: Comment = {
            id: commentId,
            text: message,
            author: user
        }
        if (commentToReply) {
            comment.reply = commentToReply
        }
        if (post && !editModeEnabled) {
            postService.addComment(post.id, comment)
                .then(() => {
                    setMessage('')
                    setCommentToReply(null)
                    inputRef.blur()
                    fetchComments('bottom')
                })
                .catch((error) => {
                    console.log('Error creating comment')
                    console.error(error)
                })
        } else if (post && editModeEnabled) {
            postService.editComment(post.id, comment)
                .then(() => {
                    setMessage('')
                    setCommentToReply(null)
                    inputRef.blur()
                    setComments([])
                    fetchComments('bottom')
                    setEditModeEnabled(false)
                    setCommentId(null)
                })
                .catch((error) => {
                    console.log('Error updating comment')
                    console.error(error)
                })
        }
    }

    const toggleModal = () => {
        openModal(modalOptions, 0, () => closeModal())
        setIsModalOpened(!isModalOpened)
    }

    const deletePost = () => {
        setLoading(true)
        if (post) {
            postService.delete(post.id)
                .then(() => navigation.navigate('App'))
                .catch(error => {
                    console.log('error post delete')
                    console.log(error)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    const loadComment = (commentSeen: Comment) => {
        if (post && (commentSeen.id && commentSeen.id >= lastCommentId || !lastCommentId)) {
            LocalStorage.addCommentSeen(post.id, commentSeen.id).catch(err => {
                console.log('error addCommentSeen')
                console.log(err)
            })
        }
    }

    const gotoFirstUnseenMessage = () => {
        setManualScrollEnabled(true)
        setUnseenMessages(0)
        console.log('lastCommentId ===> ' + lastCommentId)
        fetchComments('top', pageFirstUnseenComment, lastCommentId)
    }

    const reply = (comment: Comment | null): void => {
        console.log('author: ' + comment?.author.name)
        console.log('TEXT: ' + comment?.text)

        if (comment) {
            setCommentToReply(comment)
            inputRef.focus()
        }
    }

    const setModalVisible = (com: Comment, id: number | null) => {
        setComment(com)
        let values = {}
        comments?.forEach(c => {
            // @ts-ignore
            values[c.id] = false
        })

        if (id) {
            // @ts-ignore
            values[id] = true
        }

        setOptionsVisible(values)
    }

    const refreshComments = (commentId: number): void => {
        if (comments) {
            let values: Comment[] = [...comments]
            let index = values.findIndex(c => c.id === commentId)
            if (index >= 0) {
                values[index].text = ''
                setComments(values)
            }
        }
    }

    const deleteComment = (commentId: number | null): void => {
        if (post && commentId) {
            postService.deleteComment(post.id, commentId)
                .then(() => refreshComments(commentId))
                .catch(err => {
                    console.log('Error deleting postId: ' + post.id + ' commentID: ' + commentId)
                    console.log(err)
                })
        }
    }

    const onSendImage = (value: string): void => {
        sendComment(value)
    }

    const onImageChange = (event: any) => {
        const {linkUri} = event.nativeEvent
        if (linkUri.endsWith('.gif')) {
            navigation.navigate('PicturePreview', {image: linkUri, title, id, onSendImage})
        } else {
            sendComment('![gif](' + linkUri + ')')
        }
    }

    const onSendPicture = (value: string): void => {
        sendComment(value)
    }

    const uploadPicture = (image: ImagePickerResponse): void => {
        navigation.navigate('PictureUpload', {image, title, id, onSendPicture})
        /*
        if (image.fileName) {
            pictureService.fileUpload(image, image.fileName)
                .then(() => {
                    sendComment('![gif](' + REACT_APP_IMAGES_URL + '/' + user.id + '_' + image.fileName + ')')
                })
                .catch(err => {
                    console.log('error uploading image')
                    console.log(err)
                })
        }
        */
    }

    const editComment = (comment: Comment): void => {
        let values: Comment[] = []
        let index = -1

        if (comments) {
            values = [...comments]
            index = comments.findIndex(c => c.id === comment.id)
            if (index >= 0) {
                values[index] = {...comment}
                setComments(values)
            }
        }

        console.log('comment.text => ' + comment.text)

        setEditModeEnabled(true)
        setMessage(comment.text)
        setCommentId(comment.id)
        if (inputRef) {
            inputRef.focus()
        }
    }

    const reportComment = (id: number): void => {
        navigation.navigate('Report', {id, type: 'comment'})
    }

    const goBack = () => {
        navigation.navigate('Posts', {lastIndex})
    }

    return (
        <>
            <HeaderComponent
                title={post?.title}
                leftAction={{
                    image: "arrow-left",
                    onPress: () => goBack()
                }}
                rightAction={user.id >= 0 ? {
                    image: "dots-vertical",
                    onPress: () => toggleModal()
                } : undefined}
            />

            <ScrollView style={styles.post} ref={scrollRef}>

                {
                    post &&
                    <View>

                        {post.game.length > 0 && <Info style={styles.postDetail} label={'🎮'} value={post.game}/>}

                        <Info style={{...styles.postDetail, marginTop: 4}}
                              valueAlign={'right'}
                              label={post.platforms.map((platform: Option) => platform.name).join(', ')}
                              value={post.language.name}
                        />

                        {
                            post.channels.length > 0 &&
                            <Info
                                style={{...styles.postDetail, marginTop: 4}}
                                label='Channels'
                                value={post.channels.map((channel: Channel) => channel.name).join(', ')}
                            />
                        }

                    </View>
                }

                {
                    // comments &&
                    <View style={styles.comments}>

                        {
                            page && page.totalPages > 1 &&
                            <View style={styles.pagination}>

                                {
                                    unseenMessages > 0 &&
                                    <View
                                        style={styles.goToFirstUnSeen}
                                        onTouchEnd={() => gotoFirstUnseenMessage()}
                                    >
                                        <MaterialCommunityIcons name="email-mark-as-unread"
                                                                color={theme.colors.text}
                                                                size={15}
                                        />
                                    </View>
                                }

                                <View style={{marginLeft: 'auto'}}>
                                    <PaginationComponent
                                        number={currentPage}
                                        totalPages={page?.totalPages}
                                        onPageChange={(newPage: number) => fetchComments('top', newPage)}
                                        marginTop={3}
                                    />
                                </View>
                            </View>
                        }

                        {comments?.map((comment, index) =>
                            <View key={comment.id}
                                  style={{
                                      marginTop: index === 0 ? 4 : 0,
                                      marginBottom: index === comments.length - 1 ? 10 : 2
                                  }}
                                  onLayout={(event) => {
                                      const layout = event.nativeEvent.layout;
                                      let data = {...dataSourceCords}
                                      // @ts-ignore
                                      data[comment.id] = layout.y;
                                      setDataSourceCords(data);
                                  }}
                            >
                                <CommentComponent
                                    key={comment.id}
                                    comment={comment}
                                    checkVisible={() => loadComment(comment)}
                                    optionsVisible={optionsVisible[comment.id!]}
                                    reply={(comment) => reply(comment)}
                                    setModalVisible={(id: number | null) => setModalVisible(comment, id)}
                                    onCommentDelete={(id: number | null) => deleteComment(id)}
                                    editComment={(comment) => editComment(comment)}
                                    onReport={(id) => reportComment(id)}
                                    goToProfile={(email) => {
                                        if (user.id >= 0 && user.id !== comment.author.id) {
                                            navigation.navigate('ProfileViewer', {
                                                email,
                                                origin: {
                                                    screen: 'Detail',
                                                    id: post?.user?.id
                                                }
                                            })
                                        }
                                    }}
                                />

                                {
                                    index === comments.length || index % 5 === 0 &&
                                    <View style={{marginTop: 4, marginBottom: 1}}>
                                        <BannerAd
                                            unitId={TestIds.BANNER}
                                            size={BannerAdSize.ADAPTIVE_BANNER}
                                            onAdLoaded={() => {
                                            }}
                                            onAdFailedToLoad={(error) => {
                                                console.error('Advert failed to load: ', error);
                                            }}
                                            onAdClosed={() => console.log('onAdClosed')}
                                            onAdLeftApplication={() => console.log('onAdLeftApplication')}
                                            onAdOpened={() => console.log('onAdOpened')}
                                        />
                                    </View>
                                }

                            </View>)}

                        {
                            page && page.totalPages > 1 &&
                            <PaginationComponent
                                number={currentPage}
                                totalPages={page?.totalPages}
                                marginBottom={10}
                                onPageChange={(newPage: number) => fetchComments('top', newPage)}
                            />
                        }
                    </View>
                }
            </ScrollView>

            {commentToReply &&
            <ReplyToComponent
                comment={commentToReply}
                close={() => {
                    setCommentToReply(null)
                    inputRef.blur()
                }}
            />}

            {user.id >= 0 &&
            <NewCommentComponent
                send={sendComment}
                message={message}
                onChange={(value: string) => setMessage(value)}
                setRef={ref => {
                    if (ref) {
                        inputRef = ref
                    }
                }}
                onImageChange={onImageChange}
                uploadPicture={uploadPicture}
            />}

            {
                comment && optionsVisible[comment.id!] &&
                <View
                    style={{
                        backgroundColor: 'rgba(66,66,66,1)',
                        zIndex: 100,
                        flex: 1,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: Dimensions.get('window').height,
                        width: Dimensions.get('window').width
                    }}
                    onTouchEnd={() => setModalVisible(comment, null)}>
                    <Text/>
                </View>
            }
        </>
    )
}

export default connect(null, {
        openModal: openModal,
        closeModal: closeModal,
        setLoading: setLoading,
        openDialog: openDialog,
        closeDialog: closeDialog
    }
)
(withTheme(PostDetailScreen))
