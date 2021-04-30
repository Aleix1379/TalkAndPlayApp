import React, {useEffect, useState} from 'react'
import {FAB, Modal, Text, withTheme} from 'react-native-paper'
import {ScrollView, StyleSheet, View} from 'react-native'
import {Theme} from 'react-native-paper/lib/typescript/types'
import PostsService from '../../services/Posts'
import {availablePlatforms, Filter, Option, PostsResponse, SelectItem} from '../../types/PostsTypes'
import PostComponent from "../../components/PostComponent"
import {UserState} from "../../store/user/types"
import {shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import HeaderComponent from "../../components/HeaderComponent";
import LocalStorage from "../../utils/LocalStorage/LocalStorage";
import TextInputComponent from "../../components/TextInputComponent/TextInputComponent";
import CheckBoxListComponent from "../../components/CheckBoxListComponent/CheckBoxListComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import languages from "../../store/languages.json";
import {BannerAd, BannerAdSize, TestIds} from "@react-native-firebase/admob";

//import {AdMobBanner, AdMobInterstitial, AdMobRewarded, PublisherBanner,} from 'react-native-admob';

interface PostListProperties {
    navigation: any,
    theme: Theme
}

interface Form {
    title: string
    game: string
    languages: Option[]
    platforms: Option[]
}

const PostListScreen: React.FC<PostListProperties> = ({navigation, theme}) => {
    const postsService = new PostsService()
    const styles = StyleSheet.create({
        postList: {
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingHorizontal: 4
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
        },
        search: {
            backgroundColor: theme.colors.background,
            flex: 1,
            paddingTop: 16,
            marginTop: 32,
            paddingHorizontal: 16
        },
        input: {
            marginTop: 32
        },
        accordion: {
            marginTop: 32
        },
        button: {
            marginTop: 16,
            marginBottom: 24
        },
        modal: {
            flex: 1
        }
    })

    const [commentsUnSeen, setCommentsUnSeen] = useState<[n: number]>()
    const [data, setData] = useState<PostsResponse>()
    const postService = new PostsService()
    const [totalMessages, setTotalMessages] = useState<any>({})
    const [isLast, setIsLast] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [untouched, setUntouched] = useState(true)

    const [form, setForm] = useState<Form>({
        title: '',
        game: '',
        languages: [],
        platforms: []
    })

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
        LocalStorage.getFilter()
            .then(filter => {
                if (filter) {
                    setForm(filter)
                    fetchData(0, filter)
                } else {
                    fetchData()
                }
            })
    }, [])

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
            setIsLast(response.last)
        })
    }

    const goToDetail = (id: number, title: string) => {
        navigation.navigate('Detail', {title, id})
    }

    const search = (filter: Filter) => {
        postsService.get(0, filter)
            .then(data => {
                setData(data)
                setIsLast(data.last)
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

    const update = (id: string, value: string | Option | Option[]): void => {
        let data: any
        if (untouched) {
            setUntouched(false)
        }
        data = {...form}
        data[id] = value
        setForm(data)
    }

    const handleChange = (value: SelectItem[], field: string): void => {
        const result = value.filter((item) => item.value)
        update(field, result)
    }

    const getLanguages = () => {
        let values = user.languages.map(lang => ({
            ...lang,
            image: 'language'
        }))

        if (values.length === 0) {
            return languages.map(lang => ({
                ...lang,
                image: 'language'
            }))
        }

        return values
    }

    return (
        <>
            <HeaderComponent
                title="Posts"
                rightAction={{
                    image: "magnify",
                    onPress: () => setShowModal(true)
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
                            {
                                index === data?.content.length - 1 || index % 5 === 0 &&
                                <View style={{marginTop: 8}}>
                                    <BannerAd
                                        unitId={TestIds.BANNER}
                                        size={BannerAdSize.ADAPTIVE_BANNER}
                                        onAdLoaded={() => {
                                            console.log('Advert loaded');
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

            <Modal
                visible={showModal}
                contentContainerStyle={styles.modal}
                dismissable={false}
            >
                <View style={styles.search}>
                    <ScrollView>
                        <TextInputComponent
                            id="title"
                            label="Title"
                            value={form.title}
                            onChange={update}
                            style={styles.input}
                        />

                        <TextInputComponent
                            id="game"
                            label="Game"
                            value={form.game}
                            onChange={update}
                            style={styles.input}
                        />

                        <CheckBoxListComponent
                            id="languages"
                            label="Language"
                            values={getLanguages()}
                            initialValues={form.languages}
                            onChange={(items) => handleChange(items, 'languages')}
                            style={styles.accordion}
                        />

                        <CheckBoxListComponent
                            id="platforms"
                            label="Platforms"
                            values={availablePlatforms}
                            initialValues={form.platforms}
                            onChange={(items) => handleChange(items, 'platforms')}
                            style={styles.accordion}
                        />

                    </ScrollView>
                    <ButtonComponent
                        label="Search"
                        icon="magnify"
                        onPress={() => {
                            let filter = {
                                title: form.title,
                                game: form.game,
                                languages: form.languages,
                                platforms: form.platforms
                            }
                            LocalStorage.addFilter(filter)
                                .then(() => {
                                    search(filter)
                                    setShowModal(false)
                                })
                                .catch(err => {
                                    console.log('Error saving filter')
                                    console.log(err)
                                })
                        }}
                        style={styles.button}
                    />

                    {/*
                    <AdMobBanner
                        adSize="fullBanner"
                        adUnitID="ca-app-pub-3339437277990541/5847363447"
                        testDevices={[AdMobBanner.simulatorId]}
                        onAdFailedToLoad={(error: any) => console.error(error)}
                    />
                    */}
                </View>
            </Modal>

        </>
    )
}


export default withTheme(PostListScreen)
