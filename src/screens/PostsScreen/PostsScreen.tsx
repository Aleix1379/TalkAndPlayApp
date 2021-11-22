import React from 'react'
import {Animated, Dimensions, FlatList, RefreshControl, ScrollView, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {TabBar, TabView} from "react-native-tab-view"
import {FAB, Modal, Text, withTheme} from "react-native-paper"
import {NavigationState} from "react-native-tab-view/lib/typescript/src/error get messages seentypes"
import {
    availableChannels,
    availablePlatforms,
    Channel,
    Filter,
    Option,
    PostRenderItem,
    PostRow,
    PostsResponse,
    PostType,
    SelectItem,
    User
} from "../../types/PostsTypes"
import HeaderComponent from "../../components/HeaderComponent"
import PostComponent from "../../components/PostComponent/PostComponent"
import {BannerAd, BannerAdSize} from "@react-native-firebase/admob"
import TextInputComponent from "../../components/TextInputComponent/TextInputComponent"
import CheckBoxListComponent from "../../components/CheckBoxListComponent/CheckBoxListComponent"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
import LocalStorage from "../../utils/LocalStorage/LocalStorage"
import PostsService from "../../services/Posts"
import languages from "../../store/languages.json"
import {connect} from "react-redux"
import {ApplicationState} from "../../store"
import Image from "react-native-scalable-image"
import UserService from "../../services/User"
import SeenMessageUtils from "../../utils/SeenMessage"
import {setLoading} from "../../store/loading/actions"
import firebase from "react-native-firebase"
import {DialogOption} from "../../store/dialog/types"
import {closeDialog, openDialog} from "../../store/dialog/actions"
import {login} from "../../store/user/actions"
import DeviceInfo from 'react-native-device-info'
import AdService from "../../services/AdService";

export interface PostsProperties {
    navigation: any,
    theme: Theme,
    user: User
    postType: PostType
    setLoading: (visible: boolean) => void
    openDialog: (title: string, content: string[], actions: DialogOption[]) => void
    closeDialog: () => void
    login: (user: User, token?: string) => void
}

interface Form {
    title: string
    game: string
    languages: Option[]
    platforms: Option[]
    user: string
    channels: Channel[]
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
    lastIndex: number
    refreshing: boolean
    isEmpty: boolean
    notificationRead: boolean
}

interface RouteItem {
    key: string
    title: string
    postType: string
}


class PostsScreen extends React.Component<PostsProperties, PostListState> {
    readonly postService = new PostsService()
    readonly userService = new UserService()
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
            user: '',
            channels: []
        },
        navigationState: {
            index: 0,
            routes: [
                {key: 'general', title: 'General', postType: PostType.GENERAL},
                {key: 'games', title: 'Games', postType: PostType.GAMES},
                {key: 'online', title: 'Online', postType: PostType.ONLINE},
                {key: 'streamers', title: 'Streaming', postType: PostType.STREAMERS},
                {key: 'hardware', title: 'Hardware', postType: PostType.HARDWARE},
                {key: 'setup', title: 'Setup', postType: PostType.SETUP}
            ]
        },
        postType: PostType.GENERAL,
        upperAnimation: new Animated.Value(0),
        headerVisible: true,
        lastIndex: -1,
        refreshing: false,
        isEmpty: false,
        notificationRead: true
    }

    notificationListener: any = null
    notificationOpenedListener: any = null

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
            marginTop: 6,
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
            elevation: 8
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

    unsubscribe = this.props.navigation.addListener('didFocus', async (response: any) => {
        if (response.action.params?.lastIndex) {
            // this.updateIndex(response.action.params?.lastIndex)
        }

        console.log('response.action.params?.notificationRead => ' + response.action.params?.notificationRead)
        if (!response.action.params || response.action.params.notificationRead) {
            this.setState({notificationRead: true})
        } else {
            this.setState({notificationRead: false})
        }


        const indexSaved = await LocalStorage.getPostTabIndex()

        console.log('indexSaved: => ' + indexSaved)
        if (indexSaved > 0) {
            this.updateIndex(indexSaved)
        } else {
            console.log('this.mounted: => ' + this.mounted)
            if (this.mounted) {
                this.loadData()
            } else {
                typeof this.unsubscribe === "function" && this.unsubscribe()
            }
        }
    })


    componentWillUnmount() {
        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true
        this.startAnimation(true)
    }

    initNotificationsListener() {
        //we check if user has granted permission to receive push notifications.
        this.checkPermission().catch(err => {
            console.log('Error check permission')
            console.log(err)
        })
        // Register all listener for notification
        this.createNotificationListeners().catch(err => {
            console.log('Error createNotificationListeners')
            console.log(err)
        })
    }

    createNotificationListeners = async () => {

        // This listener triggered when notification has been received in foreground
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const {title, body} = notification
            this.displayNotification(title, body, notification.data)
        })

        // This listener triggered when app is in background and we click, tapped and opened notification
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            console.log('onNotificationOpened......................')
            if (this.state.notificationRead) {
                this.handleBackgroundNotification(notificationOpen.notification.data.postTitle, notificationOpen.notification.data.body, notificationOpen.notification.data)
            }
        })

        // This listener triggered when app is closed and we click,tapped and opened notification
        firebase.notifications().getInitialNotification().then(notificationOpen => {
            if (notificationOpen?.notification && this.state.notificationRead) {
                this.handleBackgroundNotification(notificationOpen.notification.data.postTitle, notificationOpen.notification.data.body, notificationOpen.notification.data)
            }
        })
    }

    handleBackgroundNotification = (title: string, body: string, data: { [key: string]: string }) => {
        this.userService.updateNotifications(this.props.user.id, this.props.user.notifications.map(nt => ({
            ...nt,
            seen: true
        })))
            .then(() => {
                this.props.navigation.navigate('Detail', {
                    title: data.postTitle,
                    id: data.postId,
                    newCommentId: data.commentId,
                    notificationRead: false
                })
            })
            .catch(err => {
                console.log('error update notifications')
                console.log(err)
            })
    }

    checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission()
        // If Permission granted proceed towards token fetch
        if (enabled) {
            this.loadToken().catch(err => {
                console.log('Error get token')
                console.log(err)
            })
        } else {
            // If permission hasn't been granted to our app, request user in requestPermission method.
            this.requestPermission().catch(err => {
                console.log('Error request permission')
                console.log(err)
            })
        }
    }

    requestPermission = async () => {
        try {
            await firebase.messaging().requestPermission()
            // User has authorised
            this.loadToken().catch(error => {
                console.log('Error get token')
                console.log(error)
            })
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected')
        }
    }

    loadToken = async () => {
        let fcmToken = await LocalStorage.getFcmToken()
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken()
            if (fcmToken) {
                const name = await DeviceInfo.getDeviceName()
                this.userService.registerDevice(
                    this.props.user.id,
                    {
                        name,
                        fcmToken,
                        uniqueId: DeviceInfo.getUniqueId()
                    })
                    .catch(err => {
                        console.log('error register new device')
                        console.log(err.response.data)
                    })
                LocalStorage.setFcmToken(fcmToken).catch(error => {
                    console.log('Error saving fcm token')
                    console.log(error)
                })
            }
        }
    }

    displayNotification = (title: string, body: string, data: { [key: string]: string }) => {
        // we display notification in alert box with title and body
        if (data.authorId !== this.props.user.id.toString()) {
            this.props.login({
                ...this.props.user,
                notifications: [...this.props.user.notifications, {title, body, data}]
            })
            // this.setState({showDialog: true, notification: {title, body, data}})
            /*     this.props.openDialog(
                     title,
                     [body],
                     [
                         {
                             label: 'See comment',
                             backgroundColor: this.props.theme.colors.accent,
                             onPress: () => {
                                 this.props.closeDialog()
                                 this.handleBackgroundNotification(data)
                             }
                         }
                     ])*/
        } else {
            // this.handleBackgroundNotification(data)
        }
    }

    onScroll = (event: any) => {
        const currentOffset = event.nativeEvent.contentOffset.y
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

        this.offset = currentOffset
    }

    onRefresh = () => {
        this.setState({refreshing: true})
        console.log('on refresh load data')
        this.loadData()

        // setTimeout(() => this.setState({refreshing: false}), 2000)
    }

    loadData = () => {
        LocalStorage.getMessagesSeen()
            .then(data => {
                let result: { [id: number]: number } = SeenMessageUtils.mergeSeenMessages(data, this.props.user.seenMessages)

                if (this.props.user.id >= 0) {
                    this.userService.getCommentsUnseen(this.props.user.id, result).then(values => {
                        this.setState({commentsUnSeen: values})
                    }).catch(err => {
                        console.log('error get messages seen')
                        console.log(err)
                    })
                }
            })
            .catch(err => {
                console.log('error LocalStorage.getMessagesSeen()')
                console.log(err)
            })

        LocalStorage.getFilter()
            .then(filter => {
                if (filter) {
                    this.setState({form: filter})
                    this.fetchData(0, {
                        ...filter,
                        channels: this.state.postType === PostType.STREAMERS ? filter.channels : []
                    })
                    const data: Form = {...filter}
                    data.title = ''
                    data.user = ''
                    data.game = ''
                    data.languages = filter.languages
                    data.platforms = filter.platforms
                    data.channels = filter.channels

                    LocalStorage.saveFilter(data)
                        .then(() => this.setState({form: data}))
                        .catch(err => console.log(err))
                } else {
                    console.log('fetchData without filter.......')
                    this.fetchData()
                }
            })
            .catch(err => {
                console.log('error getting filter')
                console.log(err)
            })
    }

    componentDidUpdate(prevProps: Readonly<PostsProperties>, prevState: Readonly<PostListState>, snapshot?: any) {
        if (JSON.stringify(prevState.data) !== JSON.stringify(this.state.data)) {
            const ids = this.state.data?.content.map(item => item.post.id)
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

            if (this.props.user.id >= 0) {
                //this.initNotificationsListener()
                /*           LocalStorage.getFcmToken()
                               .then((fcmToken: string | null) => {
                                   if (fcmToken) {
                                       this.userService.updateFcmToken(this.props.user.id, fcmToken)
                                           .catch(err => {
                                               console.log('error updateFcmToken')
                                               console.log(err.response.data)
                                           })
                                   }
                               })
                               .catch(err => {
                                   console.log('Error getting fcm token')
                                   console.log(err)
                               })*/
            }

        }
    }

    fetchData = (page: number = 0, filter?: Filter) => {
        console.log('set loading true => fetchData')
        this.props.setLoading(true)
        this.postService.get(page, this.state.postType, filter)
            .then((response: PostsResponse) => {
                const stateData: PostListState = {...this.state}
                stateData.data = response
                stateData.isLast = response.last
                this.setState(stateData)
                if (this.state.refreshing) {
                    this.setState({refreshing: false})
                }
            })
            .catch(err => {
                console.log('Error getting posts')
                console.log(err)
                this.props.navigation.navigate('Error', {err: JSON.stringify(err, null, 2)})
            })
            .finally(() => this.props.setLoading(false))
    }

    goToDetail = (id: number, title: string) => {
        this.props.navigation.navigate('Detail', {
            title,
            id,
            postType: this.state.postType,
            lastIndex: this.state.lastIndex
        })
    }

    search = async (filter: Filter) => {
        this.props.setLoading(true)
        try {
            const response = await this.postService.get(0, this.state.postType, {
                ...filter,
                channels: this.state.postType === PostType.STREAMERS ? filter.channels : []
            })
            this.setState({
                data: response,
                isLast: response.last
            })
        } catch (err) {
            console.log('Error searching')
            console.log(err)
        } finally {
            this.props.setLoading(false)
        }
    }

    loadMore = () => {
        if (!this.state.headerVisible && !this.state.isLast) {
            this.props.setLoading(true)
            if (this.state.data) {
                this.postService.get(this.state.data.number + 1, this.state.postType, this.state.form)
                    .then((response: PostsResponse) => {
                        let newValue: PostsResponse | null = {...response}
                        if (this.state.data) {
                            newValue.content = this.state.data.content.concat(response.content)
                            this.setState({
                                data: newValue,
                                isLast: response.last,
                                isEmpty: response.empty
                            })
                        }
                    })
                    .catch(err => {
                        console.log('error load more')
                        console.log(err)
                    })
                    .finally(() => this.props.setLoading(false))
            }
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
        let values: Option[] = []

        if (this.props.user.languages) {
            values = this.props.user.languages.map(lang => ({
                ...lang,
                image: 'language'
            }))
        }

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
        } else if (this.state.postType === PostType.STREAMERS) {
            return 'Talk about streamers'
        } else if (this.state.postType === PostType.SETUP) {
            return 'Talk about gaming setup'
        } else if (this.state.postType === PostType.HARDWARE) {
            return 'Hardware and accessories'
        }
    }

    renderItem = (element: PostRenderItem) => (
        <View key={element.item.post.id}
              style={{
                  marginTop: element.index === 0 ? 5 : 0,
                  marginBottom: 2
              }}>
            <PostComponent
                key={element.item.post.id}
                post={element.item.post}
                user={element.item.user}
                lastAuthor={element.item.lastAuthor || ''}
                unreadMessages={(this.state.commentsUnSeen && this.state.commentsUnSeen[element.item.post.id] >= 0) ? this.state.commentsUnSeen[element.item.post.id] : this.state.totalMessages[element.item.post.id]}
                totalMessages={this.state.totalMessages[element.item.post.id]}
                onClick={this.goToDetail}
            />
            {
                element.index === this.state.data?.content.length || 1 - 1 || element.index % 5 === 0 &&
                <View style={{marginTop: 4, marginBottom: 2}}>
                    <BannerAd
                        unitId={AdService.getPostsListUnitAd()}
                        size={BannerAdSize.ADAPTIVE_BANNER}
                        onAdLoaded={() => {
                            console.log('Advert loaded')
                        }}
                        onAdFailedToLoad={(error) => {
                            console.error('Advert failed to load: ', error)
                        }}
                        onAdClosed={() => console.log('onAdClosed')}
                        onAdLeftApplication={() => console.log('onAdLeftApplication')}
                        onAdOpened={() => console.log('onAdOpened')}
                    />
                </View>
            }
        </View>
    )

    getScene = () => (
        <View style={this.styles.posts}>
            {
                this.state.data?.content.length === 0 &&
                <View style={this.styles.noDataContainer}>
                    <Text style={this.styles.noDataText}>No posts found with this filter.</Text>
                    <Image width={Dimensions.get('window').width * 0.75} style={this.styles.image}
                           source={require('../../assets/images/undraw_empty_xct9.png')}/>
                </View>
            }
            <FlatList
                data={this.state.data?.content}
                renderItem={this.renderItem}
                keyExtractor={(item: PostRow) => item.post.id.toString()}
                onScroll={this.onScroll}
                onScrollEndDrag={this.loadMore}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
            />

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

                        {
                            this.state.postType !== PostType.SETUP &&
                            <TextInputComponent
                                id="game"
                                label="Game"
                                value={this.state.form.game}
                                onChange={this.update}
                                style={this.styles.input}
                            />
                        }

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

                        {
                            this.state.postType === PostType.STREAMERS &&
                            <CheckBoxListComponent
                                id="channels"
                                label="Channels"
                                values={availableChannels}
                                initialValues={this.state.form.channels}
                                onChange={(items) => this.handleChange(items, 'channels')}
                                style={this.styles.accordion}
                            />
                        }

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
                                user: this.state.form.user,
                                channels: this.state.form.channels
                            }
                            this.setState({showModal: false})
                            this.search(filter).catch(err => {
                                console.log('error search')
                                console.log(err)
                            })
                            LocalStorage.saveFilter(filter)
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

    getPostType = (index: number): any => {
        if (this.state.navigationState.routes[index]) {
            return this.state.navigationState.routes[index].postType
        }
        return PostType.GENERAL
    }

    updateIndex = (index: number) => {
        console.log('TAB INDEX')
        if (index !== this.state.lastIndex) {
            this.setState({showModal: false})
        }
        LocalStorage.setPostTabIndex(index).catch(err => {
            console.log('Error set post tab index')
            console.log(err)
        })
        this.setState({
            data: null,
            navigationState: {...this.state.navigationState, ...{index}},
            postType: this.getPostType(index),
            lastIndex: index
        })
        console.log('tab index | load data')
        this.loadData()
    }

    render() {
        return (
            <View style={this.styles.posts}>
                <Animated.View style={[this.styles.topSheet, this.animatedStyles.upper]}>
                    <HeaderComponent
                        navigation={this.props.navigation}
                        title={this.getTitle()}
                        originalScreen='Posts'
                        rightAction={{
                            image: "magnify",
                            onPress: () => this.setState({showModal: !this.state.showModal})
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
                        <View>
                            <TabBar
                                scrollEnabled={true}
                                indicatorStyle={{backgroundColor: this.props.theme.colors.text}}
                                style={this.styles.tab} {...props}
                            />
                        </View>
                    )}
                />

                {/*                <DialogComponent
                    visible={this.state.showDialog} onDismiss={() => this.setState({showDialog: false})}
                    title={this.state.notification.title}
                    content={[this.state.notification.body]}
                    actions={[
                        {
                            label: 'See comment',
                            backgroundColor: this.props.theme.colors.accent,
                            onPress: () => {
                                this.setState({showDialog: false})
                                this.handleBackgroundNotification(this.state.notification.data)
                            }
                        }
                    ]}
                />*/}
            </View>
        )
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    user: state.user,
})

export default connect(mapStateToProps, {
    setLoading: setLoading,
    openDialog: openDialog,
    closeDialog: closeDialog,
    login: login
})(withTheme(PostsScreen))
