import React, {useEffect, useState} from 'react'
import {FAB, Text, withTheme} from 'react-native-paper'
import {ScrollView, StyleSheet, View} from 'react-native'
import {Theme} from 'react-native-paper/lib/typescript/types'
import PostsService from '../../services/Posts'
import {Filter, PostsResponse} from '../../types/PostsTypes'
import PostComponent from "../../components/PostComponent"
import {UserState} from "../../store/user/types"
import {shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import HeaderComponent from "../../components/HeaderComponent";
import LocalStorage from "../../utils/LocalStorage/LocalStorage";

interface PostListProperties {
    navigation: any,
    theme: Theme
}

const PostListScreen: React.FC<PostListProperties> = ({navigation, theme}) => {
    const postsService = new PostsService()
    const styles = StyleSheet.create({
        postList: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 3,
            fontSize: 25,
        },
        fab: {
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
        },
        loadMore: {
            display: "flex",
            alignItems: "center",
            marginTop: 8,
            marginBottom: 16
        },
        loadMoreText: {
            fontSize: 15,
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 10,
            paddingVertical: 6,
            shadowColor: theme.colors.surface,
            shadowOffset: {
                width: 2.5,
                height: 2.5,
            },
            shadowOpacity: 0.75,
            shadowRadius: 1,
            elevation: 5,
        }
    })

    const [commentsUnSeen, setCommentsUnSeen] = useState<[n: number]>()
    const [data, setData] = useState<PostsResponse>()
    const postService = new PostsService()
    const [totalMessages, setTotalMessages] = useState<any>({})
    const [isLast, setIsLast] = useState(false)

    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    useEffect(() => {
        LocalStorage.getMessagesSeen()
            .then(data => {
                postService.getCommentsUnseen(data).then(values => {
                    setCommentsUnSeen(values)
                })
            })

        fetchData()
    }, [])

    useEffect(() => {
        LocalStorage.getFilter()
            .then(filter => {
                if (filter) {
                    fetchData(0, filter)
                } else {
                    fetchData()
                }
            })
    }, [user])

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        const ids = data?.content.map(item => item.id)
        if (ids) {
            postService.getNumberOfCommentsByPost(ids)
                .then(numberOfCommentsByPost => {
                    if (isMounted) {
                        setTotalMessages(numberOfCommentsByPost)
                    }
                })
                .catch(err => console.log(err))
        }
        return () => {
            isMounted = false
        }; // use effect cleanup to set flag false, if unmounted
    }, [data])

    const fetchData = (page: number = 0, filter?: Filter) => {
        postService.get(page, filter).then((response: PostsResponse) => {
            setData(response)
        })
    }

    const goToDetail = (id: number, title: string) => {
        navigation.navigate('Detail', {title, id})
    }

    const search = (filter: Filter) => {
        postsService.get(0, filter)
            .then(data => {
                setData(data)
            })
            .catch(err => {
                console.log('Error searching')
                console.log(err)
            })
    }

    const loadMore = () => {
        if (data) {
            postService.get(data.number + 1).then((response: PostsResponse) => {
                let newValue = {...response}
                newValue.content = data.content.concat(response.content)
                setData(newValue)
                setIsLast(response.last)
            })
        }
    }

    return (
        <>
            <HeaderComponent
                title="Posts"
                rightAction={{
                    image: "magnify",
                    onPress: () => navigation.navigate('Search', {search})
                }}
            />

            <View style={styles.postList}>
                <ScrollView>
                    {data?.content.map((post, index) =>
                        <View key={post.id}
                              style={{
                                  marginTop: index === 0 ? 10 : 8,
                                  marginBottom: index === data?.content.length - 1 ? 10 : 2
                              }}>
                            <PostComponent
                                key={post.id}
                                post={post}
                                unreadMessages={(commentsUnSeen && commentsUnSeen[post.id] >= 0) ? commentsUnSeen[post.id] : totalMessages[post.id]}
                                totalMessages={totalMessages[post.id]}
                                onClick={goToDetail}
                            />
                        </View>)}

                    {!isLast &&
                    <View style={styles.loadMore} onTouchEnd={() => loadMore()}>
                        <Text style={styles.loadMoreText}>Load more...</Text>
                    </View>}

                </ScrollView>

                {
                    user.id >= 0 &&
                    <FAB
                        style={styles.fab}
                        icon="plus"
                        onPress={() => navigation.navigate('PostCreate')}
                    />
                }
            </View>
        </>
    )
}


export default withTheme(PostListScreen)
