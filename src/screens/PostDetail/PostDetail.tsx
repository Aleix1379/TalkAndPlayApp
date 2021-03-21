import React, {MutableRefObject, useEffect, useRef, useState} from 'react'
import {withTheme} from 'react-native-paper'
import {Theme} from "react-native-paper/lib/typescript/types"
import {ScrollView, StyleSheet, View, BackHandler} from "react-native"
import {Comment, CommentResponse, Option, PostInfo} from "../../types/PostsTypes"
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
import DialogComponent from "../../components/DialogComponent";
import {setLoading} from "../../store/loading/actions";

interface PostDetailProperties {
    navigation: any
    theme: Theme
    openModal: (options: ModalOption[], onChange?: () => void) => void
    closeModal: () => void
    setLoading: (visible: boolean) => void
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

const PostDetailScreen: React.FC<PostDetailProperties> = ({navigation, theme, openModal, closeModal, setLoading}) => {
    const {title, id} = navigation.state.params
    const [post, setPost] = useState<PostInfo>(navigation.state.params.post)
    const [comments, setComments] = useState<Comment[]>()
    const postService = new PostsService()
    const [elementsPerPage, setElementsPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [page, setPage] = useState<InfoPage>()
    const scrollRef: MutableRefObject<any> = useRef()
    const postsService = new PostsService()
    const sheetRef = React.useRef(null)
    const [isModalOpened, setIsModalOpened] = useState(true)
    const [modalOptions, setModalOptions] = useState<ModalOption[]>([])
    const [message, setMessage] = useState('')
    const [showDialog, setShowDialog] = useState(false)
    const [lastCommentSeen, setLastCommentSeen] = useState<number>(-1)
    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const styles = StyleSheet.create({
        post: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: 6
        },

        postDetail: {
            marginTop: 12
        },
        ads: {
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around"
        },
        comments: {
            marginTop: 2,
            marginBottom: 8
        }
    })

    const handleBackButtonClick = (): boolean => {
/*        LocalStorage.getMessagesSeen()
            .then(commentsSeen => {
                console.log('Last ID => ' + lastCommentSeen)
                console.log('comments seen')
                console.log(commentsSeen)
                console.log('lastCommentSeen: ' + lastCommentSeen + ' | ' + commentsSeen[id])
                if (lastCommentSeen < commentsSeen[id]) {
                    console.log('update last comments seen....')
                    console.log(commentsSeen)
                }
            })*/
        navigation.navigate('App')
        return true
    }

    useEffect(() => {
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)

            LocalStorage.getMessagesSeen()
                .then(data => {
                    let lastId = data[id]
                    if (lastId) {
                        setLastCommentSeen(lastId)
                    }
                })
                .catch(error => {
                    console.log('ERROR GET messages seen')
                    console.log(error)
                })

            LocalStorage.getCommentsPerPage()
                .then(value => setElementsPerPage(value))
                .catch(error => console.error(error))

            if (!post) {
                postService.getPostById(id).then(response => {
                    setPost(response)
                })
            }
            postService.getCommentsByPost(id).then((response: CommentResponse) => {

                setPage({
                    number: response.number,
                    totalOfElements: response.totalElements,
                    totalPages: response.totalPages
                })
                setComments(response.content)
            })

            return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)

        }, []
    )

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

    const editPost = () => console.log('click.... editPost ......................')

    const reportPost = () => console.log('click.... reportPost ......................')

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
                action: () => setShowDialog(true)
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

    const fetchComments = (
        scrollTo: 'top' | 'bottom' = 'top',
        newPage?: number
    ) => {
        // setShowDummy(true)
        if (post) {
            if (scrollTo === 'top') {
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
                    if (scrollTo === 'bottom') {
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
            id: null,
            text: message,
            author: user
        }
        postsService.addComment(post.id, comment)
            .then(() => fetchComments('bottom'))
            .catch((error) => {
                console.log('Error creating comment')
                console.error(error)
            })
    }

    const toggleModal = () => {
        openModal(modalOptions, () => closeModal())
        setIsModalOpened(!isModalOpened)
    }

    const deletePost = () => {
        setLoading(true)
        postService.delete(post.id)
            .then(() => navigation.navigate('App'))
            .catch(error => console.log(error))
            .finally(() => {
                setLoading(false)
            })
    }

    const loadComment = async (commentSeen: Comment) => {
        await LocalStorage.addCommentSeen(post.id, commentSeen.id)
    }

    return (
        <>
            <HeaderComponent
                title={title}
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.navigate('App')
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

                        <Info style={styles.postDetail} label={'🎮'} value={post.game}/>

                        {/*<View style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>*/}
                        {/*          <View style={{marginRight: 5}}>*/}
                        <Info style={{...styles.postDetail, marginTop: 8}}
                              valueAlign={'right'}
                              label={post.language.name}
                              value={post.platforms.map((platform: Option) => platform.name).join(', ')}
                        />
                        {/*       </View>*/}
                        {/*     <View style={{marginLeft: 5}}>
                                <Info style={styles.postDetail} textAlign='right' value={post.language.name}/>
                            </View>*/}
                        {/*</View>*/}

                        {/*                        <View style={styles.ads}>
                            <AdButton image="instant-gaming.png"
                                      url={`https://www.instant-gaming.com/en/search/?q=${post.game}&igr=TalkAndPlay`}
                            />

                            <AdButton image="eneba.png"
                                      url={`https://www.eneba.com/marketplace?text=${post?.game}&aff=602c24685aea7&sortBy=RELEVANCE_DESC`}
                            />

                        </View>*/}

                    </View>
                }

                {
                    comments &&
                    <View style={styles.comments}>

                        {
                            page && page.totalPages > 1 &&
                            <PaginationComponent
                                number={currentPage}
                                totalPages={page?.totalPages}
                                onPageChange={(newPage: number) => fetchComments('top', newPage)}

                            />
                        }

                        {comments.map((comment, index) =>
                            <View key={comment.id}
                                  style={{
                                      marginTop: index === 0 ? 10 : 8,
                                      marginBottom: index === comments.length - 1 ? 10 : 2
                                  }}>
                                <CommentComponent
                                    key={comment.id}
                                    comment={comment}
                                    checkVisible={(visible => visible && loadComment(comment))}
                                />
                            </View>)}

                        {
                            page && page.totalPages > 1 && comments.length > 5 &&
                            <PaginationComponent
                                number={currentPage}
                                totalPages={page?.totalPages}
                                onPageChange={(newPage: number) => fetchComments('top', newPage)}
                            />
                        }
                    </View>
                }
            </ScrollView>

            {user.id >= 0 &&
            <NewCommentComponent
                send={sendComment}
                message={message}
                onChange={(value: string) => setMessage(value)}
            />}

            <DialogComponent
                visible={showDialog} onDismiss={() => setShowDialog(false)}
                title="Delete post"
                content={["Permanently delete this post and all the comments?", "You can't undo this"]}
                actions={[
                    {
                        label: "Cancel",
                        onPress: () => setShowDialog(false)
                    },
                    {
                        label: "Delete",
                        backgroundColor: theme.colors.error,
                        onPress: () => deletePost()
                    }
                ]}
            />

        </>
    )
}

export default connect(null,
    {
        openModal: openModal,
        closeModal: closeModal,
        setLoading: setLoading
    }
)
(withTheme(PostDetailScreen))