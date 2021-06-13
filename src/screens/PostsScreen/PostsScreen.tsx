import React from 'react';
import {Animated, Dimensions, ScrollView, StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {TabBar, TabView} from "react-native-tab-view";
import {FAB, Modal, Text, withTheme} from "react-native-paper";
import {NavigationState, SceneRendererProps} from "react-native-tab-view/lib/typescript/src/types";
import {availablePlatforms, Filter, Option, PostsResponse, PostType, SelectItem, User} from "../../types/PostsTypes";
import HeaderComponent from "../../components/HeaderComponent";
import PostComponent from "../../components/PostComponent/PostComponent";
import {BannerAd, BannerAdSize, TestIds} from "@react-native-firebase/admob";
import TextInputComponent from "../../components/TextInputComponent/TextInputComponent";
import CheckBoxListComponent from "../../components/CheckBoxListComponent/CheckBoxListComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import LocalStorage from "../../utils/LocalStorage/LocalStorage";
import PostsService from "../../services/Posts";
import languages from "../../store/languages.json";
import {PostListProperties} from "../PostList/PostList";
import {connect} from "react-redux";
import {ApplicationState} from "../../store";
import Image from "react-native-scalable-image";

export interface PostsProperties {
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
    navigationState: NavigationState<RouteItem>
    postType: PostType
    upperAnimation: Animated.Value
    headerVisible: boolean
}

interface RouteItem {
    key: string
    title: string
    postType: string
}


class PostsScreen extends React.Component<PostsProperties, PostListState> {
    readonly postService = new PostsService()
    readonly postsService = new PostsService()
    mounted: boolean = false
    offset = null
    readonly animationDuration = 100

    startAnimation = (headerVisible: boolean) => {
        Animated.timing(this.state.upperAnimation, {
            useNativeDriver: true,
            toValue: headerVisible ? 1 : 0,
            duration: this.animationDuration
        }).start()
    }

    readonly layout = Dimensions.get('window')

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
        navigationState: {
            index: 0,
            routes: [
                {key: 'general', title: 'General', postType: PostType.GENERAL},
                {key: 'games', title: 'Games', postType: PostType.GAMES},
                {key: 'online', title: 'Online', postType: PostType.ONLINE},
                {key: 'streamers', title: 'Streaming', postType: PostType.STREAMERS},
            ]
        },
        postType: PostType.GENERAL,
        upperAnimation: new Animated.Value(0),
        headerVisible: true
    }

    readonly styles = StyleSheet.create({
        posts: {
            flex: 1,
            backgroundColor: this.props.theme.colors.background,
        },
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 3,
            fontSize: 25,
        },
        loadMore: {
            display: "flex",
            alignItems: "center",
            marginTop: 4,
            marginBottom: 8
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
            paddingTop: 40,
            paddingHorizontal: 8,
            bottom: 56,
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
            flex: 1,
            zIndex: 2000,
        },
        noDataContainer: {
            display: "flex",
            alignItems: 'center',
            justifyContent: "center",
            height: Dimensions.get('screen').height

        },
        noDataText: {
            fontSize: 22,
        },
        image: {
            marginTop: 50,
            marginBottom: 100,
        },
        tab: {
            backgroundColor: this.props.theme.colors.primary,
        },
        topSheet: {
            position: "absolute",
            top: 0,
            left: 0,
            width: Dimensions.get('screen').width,
            zIndex: 1000000,
            shadowColor: this.props.theme.colors.surface,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.55,
            shadowRadius: 5,
            elevation: 8,
            // height: this.state.headerVisible ? 50 : 0
            // top: 4,
            // right: 6,
            // shadowColor: this.props.theme.colors.background,
            // shadowOffset: {
            //     width: 2.5,
            //     height: 2.5,
            // },
            // shadowOpacity: 0.75,
            // shadowRadius: 1,
            // elevation: 5,
            // backgroundColor: this.props.theme.colors.background,
            // paddingHorizontal: 8
        }
    })

    animatedStyles = {
        upper: {
            transform: [
                {
                    scaleY: this.state.upperAnimation
                }
            ]
        }
    }

    unsubscribe = this.props.navigation.addListener('didFocus', () => {
        if (this.mounted) {
            console.log('load data...')
            this.loadData()
        } else {
            typeof this.unsubscribe === "function" && this.unsubscribe()
        }
    });

    componentWillUnmount() {
        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true
        this.startAnimation(true)
    }

    onScroll = (event: any) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const dif = currentOffset - (this.offset || 0)

        if (Math.abs(dif) >= 5) {
            if (dif < -5) {
                this.setState({headerVisible: true})
                this.startAnimation(true)

            } else {
                this.startAnimation(false)
                this.setState({headerVisible: false})
            }
        }

        this.offset = currentOffset;
    };

    loadData = () => {
        LocalStorage.getMessagesSeen()
            .then(data => {
                this.postService.getCommentsUnseen(data).then(values => {
                    this.setState({commentsUnSeen: values})
                }).catch(err => {
                    console.log('error get messages seen')
                    console.log(err)
                })
            })

        LocalStorage.getFilter()
            .then(filter => {
                if (filter) {
                    this.setState({form: filter})
                    this.fetchData(0, filter)
                    const data: Form = {...filter}
                    data.title = ''
                    data.user = ''
                    data.game = ''
                    data.languages = filter.languages
                    data.platforms = filter.platforms
                    LocalStorage.saveFilter(data)
                        .then(() => this.setState({form: data}))
                        .catch(err => console.log(err))
                } else {
                    this.fetchData()
                }
            })
            .catch(err => {
                console.log('error getting filter')
                console.log(err)
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
                    .catch(err => {
                        console.log('error getting number of comments by post')
                        console.log(err)
                    })
            }
        }
    }

    fetchData = (page: number = 0, filter?: Filter) => {
        this.postService.get(page, this.state.postType, filter)
            .then((response: PostsResponse) => {
                this.setState({
                    data: response,
                    isLast: response.last
                })
            })
            .catch(err => {
                console.log('Error getting posts')
                console.log(err)
                this.props.navigation.navigate('Error', {err: JSON.stringify(err, null, 2)})
            })
    }

    goToDetail = (id: number, title: string) => {
        this.props.navigation.navigate('Detail', {title, id, postType: this.state.postType})
    }

    search = (filter: Filter) => {
        this.postsService.get(0, this.state.postType, filter)
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
            this.postService.get(this.state.data.number + 1, this.state.postType)
                .then((response: PostsResponse) => {
                    let newValue: PostsResponse | null = {...response}
                    if (this.state.data) {
                        newValue.content = this.state.data.content.concat(response.content)
                        this.setState({
                            data: newValue,
                            isLast: response.last
                        })
                    }
                })
                .catch(err => {
                    console.log('error load more')
                    console.log(err)
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

    getTitle = () => {
        if (this.state.postType === PostType.ONLINE) {
            return 'Find friends to play online '
        } else if (this.state.postType === PostType.GAMES) {
            return 'Talk about games'
        } else if (this.state.postType === PostType.GENERAL) {
            return 'News and general topics'
        } else {
            return 'Talk about streamers'
        }
    }

    getScene = (props: SceneRendererProps) => (
        <View style={this.styles.posts}>
            {
                this.state.data?.content.length === 0 &&
                <View style={this.styles.noDataContainer}>
                    <Text style={this.styles.noDataText}>No posts found with this filter.</Text>
                    <Image width={Dimensions.get('window').width * 0.75} style={this.styles.image}
                           source={require('../../assets/images/undraw_empty_xct9.png')}/>
                </View>
            }

            <ScrollView onScroll={this.onScroll}>
                {this.state.data?.content.map((post, index) =>
                    <View key={post.id}
                          style={{
                              marginTop: index === 0 ? 5 : 0,
                              marginHorizontal: 2,
                              marginBottom: 2
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
                            <View style={{marginTop: 4, marginBottom: 2}}>
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

                {!this.state.isLast && this.state.data?.content.length && this.state.data?.content.length > 0 &&
                <View style={this.styles.loadMore} onTouchEnd={() => this.loadMore()}>
                    <Text style={this.styles.loadMoreText}>Load more...</Text>
                </View>}

            </ScrollView>

            {
                this.props.user.id >= 0 && !this.state.showModal &&
                <FAB
                    style={{
                        position: 'absolute',
                        margin: 16,
                        right: 0,
                        bottom: this.state.headerVisible ? 56 : 0,
                    }}
                    icon="plus"
                    onPress={() => this.props.navigation.navigate('PostCreate', {postType: this.state.postType})}
                />
            }


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
                            LocalStorage.saveFilter(filter)
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

        </View>
    )

    getPostType = (index: number): PostType => {
        switch (index) {
            case 0:
                return PostType.GENERAL
            case 1:
                return PostType.GAMES
            case 2:
                return PostType.ONLINE
            default:
                return PostType.STREAMERS
        }
    }

    updateIndex = (index: number) => {
        this.setState({
            data: null,
            navigationState: {...this.state.navigationState, ...{index}},
            postType: this.getPostType(index)
        })
        this.loadData()
    }

    render() {
        return (
            <View style={this.styles.posts}>
                <Animated.View style={[this.styles.topSheet, this.animatedStyles.upper]}>
                    <HeaderComponent
                        title={this.getTitle()}
                        rightAction={{
                            image: "magnify",
                            onPress: () => this.setState({showModal: true})
                        }}
                    />
                </Animated.View>
                <TabView
                    navigationState={this.state.navigationState}
                    style={{top: this.state.headerVisible ? 56 : 0}}
                    renderScene={this.getScene}
                    onIndexChange={this.updateIndex}
                    initialLayout={{width: this.layout.width}}
                    renderTabBar={props => (
                        !this.state.showModal && <TabBar
                            scrollEnabled={true}
                            indicatorStyle={{backgroundColor: this.props.theme.colors.text}}
                            style={this.styles.tab} {...props}
                        />
                    )}
                />
            </View>
        )
    }
}

const mapStateToProps = (state: ApplicationState) => ({user: state.user})

export default connect(mapStateToProps, {})(withTheme(PostsScreen))