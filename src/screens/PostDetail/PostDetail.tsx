import React, {MutableRefObject, useEffect, useRef, useState} from 'react'
import {Appbar, Text, withTheme} from 'react-native-paper'
import {Theme} from "react-native-paper/lib/typescript/types"
import {ScrollView, StyleSheet, View} from "react-native"
import {Comment, CommentResponse, Option, PostInfo} from "../../types/PostsTypes"
import PostsService from "../../services/Posts"
import Info from "../../components/Info"
import AdButton from "../../components/AdButton"
import CommentComponent from "../../components/Comment"
import PaginationComponent from "../../components/PaginationComponent"
import LocalStorage from "../../utils/LocalStorage/LocalStorage"
import NewCommentComponent from "../../components/NewCommentComponent"
import {UserState} from "../../store/user/types"
import {shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TopSheetComponent from "../../components/TopSheetComponent";

interface PostDetailProperties {
    navigation: any,
    theme: Theme
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

const PostDetailScreen: React.FC<PostDetailProperties> = ({navigation, theme}) => {
    const optionModalHeight = 40 + 2 * 8
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
    const [isModalEnabled, setIsModalEnabled] = useState(false)
    const [message, setMessage] = useState('')

    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const styles = StyleSheet.create({
        post: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: 6
        },
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 3,
            fontSize: 25,

        },
        postDetail: {
            marginTop: 8
        },
        ads: {
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around"
        },
        comments: {
            marginTop: 3,
            marginBottom: 8
        }
    })

    useEffect(() => {
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
    }, [])

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

    const deletepost = () => console.log('click.... deletepost ......................')

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
                action: deletepost
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
        if (!isModalEnabled) {
            setIsModalEnabled(true)
        }
        console.log('toggleModal:::: current value :::: ' + isModalOpened)
        console.log('toggleModal:::: new value :::: ' + !isModalOpened)
        setIsModalOpened(!isModalOpened)
    }

    return (
        <>
            <Appbar>
                <Appbar.Action color={theme.colors.accent} icon="arrow-left"
                               style={{backgroundColor: theme.colors.surface}}
                               onPress={() => navigation.navigate('App')}/>
                <Appbar.Content title={title} titleStyle={styles.title}/>
                <Appbar.Action color={theme.colors.accent} icon="dots-vertical"
                               style={{backgroundColor: theme.colors.surface}}
                               onPress={() => toggleModal()}/>
            </Appbar>

            <ScrollView style={styles.post} ref={scrollRef}>

                {
                    post &&
                    <View>
                        <Info style={styles.postDetail} label="Game" value={post.game}/>
                        <Info style={styles.postDetail} label="Language" value={post.language.name}/>
                        <Info style={styles.postDetail} label="Platforms"
                              value={post.platforms.map((platform: Option) => platform.name).join(' ')}/>
                        <Info style={styles.postDetail} label="User" value={post.user!.name}/>

                        <View style={styles.ads}>
                            <AdButton image="instant-gaming.png"
                                      url={`https://www.instant-gaming.com/en/search/?q=${post.game}&igr=TalkAndPlay`}
                            />

                            <AdButton image="eneba.png"
                                      url={`https://www.eneba.com/marketplace?text=${post?.game}&aff=602c24685aea7&sortBy=RELEVANCE_DESC`}
                            />

                        </View>

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
                                <CommentComponent key={comment.id} comment={comment}/>
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

            <TopSheetComponent visible={isModalOpened} options={modalOptions}/>
        </>
    )
};

export default withTheme(PostDetailScreen)
