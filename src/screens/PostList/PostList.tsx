import React, {useEffect, useState} from 'react'
import {FAB, withTheme} from 'react-native-paper'
import {ScrollView, StyleSheet, View} from 'react-native'
import {Theme} from 'react-native-paper/lib/typescript/types'
import PostsService from '../../services/Posts'
import {PostsResponse} from '../../types/PostsTypes'
import PostComponent from "../../components/PostComponent"
import {UserState} from "../../store/user/types"
import {shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import HeaderComponent from "../../components/HeaderComponent";

interface PostListProperties {
    navigation: any,
    theme: Theme
}

const PostListScreen: React.FC<PostListProperties> = ({navigation, theme}) => {

    const styles = StyleSheet.create({
        postList: {
            flex: 1,
            backgroundColor: theme.colors.background
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
        }
    })

    const [data, setData] = useState<PostsResponse>()
    const postService = new PostsService()
    const [unreadMessages, setUnreadMessages] = useState<any>({})
    const [totalMessages, setTotalMessages] = useState<any>({})

    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    useEffect(() => {
        postService.get().then((response: PostsResponse) => {
            setData(response)
        })
    }, [])

    useEffect(() => {
        postService.get().then((response: PostsResponse) => {
            setData(response)
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

    useEffect(() => {
        if (user.id >= 0) {
            setUnreadMessages(
                data?.content.reduce(
                    (result, item) => {
                        // @ts-ignore
                        result[item.id] = Math.floor(Math.random() * totalMessages[item.id])
                        return result
                    },
                    {}
                )
            )
        }
    }, [totalMessages])

    const goToDetail = (id: number, title: string) => {
        navigation.navigate('Detail', {title, id})
    }

    return (
        <>
            <HeaderComponent
                title="Posts"
                rightAction={{
                    image: "magnify",
                    onPress: () => console.log('searching.....')
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
                                unreadMessages={unreadMessages ? unreadMessages[post.id] : -1}
                                totalMessages={totalMessages[post.id]}
                                onClick={goToDetail}
                            />
                        </View>)}
                </ScrollView>

                {user.id >= 0 && <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => navigation.navigate('PostCreate')}
                />}
            </View>
        </>
    )
}


export default withTheme(PostListScreen)
