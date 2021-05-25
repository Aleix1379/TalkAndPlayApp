import React from 'react'
import {FAB, Modal, Text} from 'react-native-paper'
import {ScrollView, StyleSheet, View} from 'react-native'
import {Theme} from 'react-native-paper/lib/typescript/types'
import PostsService from '../../services/Posts'
import {availablePlatforms, Filter, Option, PostsResponse, PostType, SelectItem, User} from '../../types/PostsTypes'
import PostComponent from "../../components/PostComponent"
import HeaderComponent from "../../components/HeaderComponent";
import LocalStorage from "../../utils/LocalStorage/LocalStorage";
import TextInputComponent from "../../components/TextInputComponent/TextInputComponent";
import CheckBoxListComponent from "../../components/CheckBoxListComponent/CheckBoxListComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import languages from "../../store/languages.json";
import {BannerAd, BannerAdSize, TestIds} from "@react-native-firebase/admob";

export interface PostListProperties {
    navigation: any,
    theme: Theme,
    user: User
    postType: PostType
}

interface Form {
    title: string
    game: string
    languages: Option[]
    platforms: Option[]
    user: string
}

export interface PostListState {
    commentsUnSeen: [n: number] | null
    data: PostsResponse | null
    totalMessages: any
    isLast: boolean
    showModal: boolean
    untouched: boolean
    form: Form
}

class PostListScreen extends React.Component<PostListProperties, PostListState> {
    readonly postService = new PostsService()
    readonly postsService = new PostsService()

    readonly styles = StyleSheet.create({
        postList: {
            flex: 1,
            backgroundColor: this.props.theme.colors.background,
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
            backgroundColor: this.props.theme.colors.primary,
            paddingHorizontal: 10,
            paddingVertical: 6,
            shadowColor: this.props.theme.colors.surface,
            shadowOffset: {
                width: 2.5,
                height: 2.5,
            },
            shadowOpacity: 0.75,
            shadowRadius: 1,
            elevation: 5,
        },
        search: {
            backgroundColor: this.props.theme.colors.background,
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
        },
        noDataContainer: {
            flex: 1,

        },
        noDataText: {
            alignSelf: "center",
            marginTop: 'auto',
            fontSize: 22
        }
    })

    state: PostListState = {
        commentsUnSeen: null,
        data: null,
        totalMessages: [],
        isLast: false,
        showModal: false,
        untouched: true,
        form: {
            title: '',
            game: '',
            languages: [],
            platforms: [],
            user: ''
        },
    }

    componentDidMount() {
        LocalStorage.getMessagesSeen()
            .then(data => {
                this.postService.getCommentsUnseen(data).then(values => {
                    this.setState({commentsUnSeen: values})
                })
            })
        LocalStorage.getFilter()
            .then(filter => {
                if (filter) {
                    this.setState({form: filter})
                    this.fetchData(0, filter)
                } else {
                    this.fetchData()
                }
            })
    }

    componentDidUpdate(prevProps: Readonly<PostListProperties>, prevState: Readonly<PostListState>, snapshot?: any) {
        if (JSON.stringify(prevState.data) !== JSON.stringify(this.state.data)) {
            const ids = this.state.data?.content.map(item => item.id)
            if (ids) {
                this.postService.getNumberOfCommentsByPost(ids)
                    .then(numberOfCommentsByPost => {
                        this.setState({totalMessages: numberOfCommentsByPost})
                    })
                    .catch(err => console.log(err))
            }
        }
    }

    fetchData = (page: number = 0, filter?: Filter) => {
        this.postService.get(page, this.props.postType, filter).then((response: PostsResponse) => {
            this.setState({
                data: response,
                isLast: response.last
            })
        })
    }

    goToDetail = (id: number, title: string) => {
        this.props.navigation.navigate('Detail', {title, id, postType: this.props.postType})
    }

    search = (filter: Filter) => {
        this.postsService.get(0, this.props.postType, filter)
            .then(data => {
                this.setState({
                    data: data,
                    isLast: data.last
                })
            })
            .catch(err => {
                console.log('Error searching')
                console.log(err)
            })
    }

    loadMore = () => {
        if (this.state.data) {
            this.postService.get(this.state.data.number + 1, this.props.postType).then((response: PostsResponse) => {
                let newValue: PostsResponse | null = {...response}
                if (this.state.data) {
                    newValue.content = this.state.data.content.concat(response.content)
                    this.setState({
                        data: newValue,
                        isLast: response.last
                    })
                }
            })
        }
    }

    update = (id: string, value: string | Option | Option[]): void => {
        let data: any
        if (this.state.untouched) {
            this.setState({untouched: false})
        }
        data = {...this.state.form}
        data[id] = value
        this.setState({
            form: data
        })
    }

    handleChange = (value: SelectItem[], field: string): void => {
        const result = value.filter((item) => item.value)
        this.update(field, result)
    }

    getLanguages = () => {
        let values = this.props.user.languages.map(lang => ({
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

    getMarginBottom = (index: number): number => {
        if (!this.state.data) {
            return 2
        }
        if (index === this.state.data?.content.length - 1) {
            return 10
        }
        return 2
    }

    getTitle = () => {
        if (this.props.postType === PostType.ONLINE) {
            return 'Talk about play online'
        } else if (this.props.postType === PostType.GAMES) {
            return 'Talk about games'
        } else {
            return 'Talk about streamers'
        }
    }

    render() {
        return (
            <>
                <HeaderComponent
                    title={this.getTitle()}
                    rightAction={{
                        image: "magnify",
                        onPress: () => this.setState({showModal: true})
                    }}
                />

                <View style={this.styles.postList}>

                    {
                        this.state.data?.content.length === 0 &&
                        <View style={this.styles.noDataContainer}>
                            <Text style={this.styles.noDataText}>No posts found with this filter.</Text>
                        </View>
                    }


                    <ScrollView>
                        {this.state.data?.content.map((post, index) =>
                            <View key={post.id}
                                  style={{
                                      marginTop: index === 0 ? 10 : 8,
                                      marginBottom: this.getMarginBottom(index)
                                  }}>
                                <PostComponent
                                    key={post.id}
                                    post={post}
                                    unreadMessages={(this.state.commentsUnSeen && this.state.commentsUnSeen[post.id] >= 0) ? this.state.commentsUnSeen[post.id] : this.state.totalMessages[post.id]}
                                    totalMessages={this.state.totalMessages[post.id]}
                                    onClick={this.goToDetail}
                                />
                                {
                                    index === this.state.data?.content.length || 1 - 1 || index % 5 === 0 &&
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

                        {!this.state.isLast &&
                        <View style={this.styles.loadMore} onTouchEnd={() => this.loadMore()}>
                            <Text style={this.styles.loadMoreText}>Load more...</Text>
                        </View>}

                    </ScrollView>

                    {
                        this.props.user.id >= 0 &&
                        <FAB
                            style={this.styles.fab}
                            icon="plus"
                            onPress={() => this.props.navigation.navigate('PostCreate', {postType: this.props.postType})}
                        />
                    }
                </View>

                <Modal
                    visible={this.state.showModal}
                    contentContainerStyle={this.styles.modal}
                    dismissable={false}
                >
                    <View style={this.styles.search}>
                        <ScrollView>
                            <TextInputComponent
                                id="title"
                                label="Title"
                                value={this.state.form.title}
                                onChange={this.update}
                                style={this.styles.input}
                            />

                            <TextInputComponent
                                id="game"
                                label="Game"
                                value={this.state.form.game}
                                onChange={this.update}
                                style={this.styles.input}
                            />

                            <TextInputComponent
                                id='user'
                                label='User name'
                                value={this.state.form.user}
                                onChange={this.update}
                                style={this.styles.input}
                            />

                            <CheckBoxListComponent
                                id="languages"
                                label="Language"
                                values={this.getLanguages()}
                                initialValues={this.state.form.languages}
                                onChange={(items) => this.handleChange(items, 'languages')}
                                style={this.styles.accordion}
                            />

                            <CheckBoxListComponent
                                id="platforms"
                                label="Platforms"
                                values={availablePlatforms}
                                initialValues={this.state.form.platforms}
                                onChange={(items) => this.handleChange(items, 'platforms')}
                                style={this.styles.accordion}
                            />

                        </ScrollView>
                        <ButtonComponent
                            label="Search"
                            icon="magnify"
                            onPress={() => {
                                let filter = {
                                    title: this.state.form.title,
                                    game: this.state.form.game,
                                    languages: this.state.form.languages,
                                    platforms: this.state.form.platforms,
                                    user: this.state.form.user
                                }
                                LocalStorage.addFilter(filter)
                                    .then(() => {
                                        this.search(filter)
                                        this.setState({showModal: false})
                                    })
                                    .catch(err => {
                                        console.log('Error saving filter')
                                        console.log(err)
                                    })
                            }}
                            style={this.styles.button}
                        />

                    </View>
                </Modal>

            </>
        )
    }
}

export default PostListScreen
