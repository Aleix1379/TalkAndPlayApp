import React, {useEffect, useState} from 'react'
import {ScrollView, StyleSheet, View} from "react-native"
import {withTheme} from 'react-native-paper'
import {Theme} from "react-native-paper/lib/typescript/types"
import TextInputComponent from "../../components/TextInputComponent"
import {ErrorType} from "../../utils/Validator/types"
import {
    availableChannels,
    availablePlatforms,
    Comment,
    Option,
    PostInfo,
    PostType,
    SelectItem,
    User
} from "../../types/PostsTypes"
import {connect, shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import CheckBoxListComponent from "../../components/CheckBoxListComponent"
import ButtonComponent from "../../components/ButtonComponent"
import Validator from "../../utils/Validator/Validator"
import {setLoading} from "../../store/loading/actions"
import PostsService from "../../services/Posts"
import HeaderComponent from "../../components/HeaderComponent"
import languages from '../../store/languages.json'
import {logout} from "../../store/user/actions"

interface PostCreateProperties {
    navigation: any,
    theme: Theme,
    setLoading: Function
    logout: Function
}

interface Errors {
    title: ErrorType
    game?: ErrorType
    text: ErrorType
    platforms?: ErrorType
    language: ErrorType
    channels?: ErrorType
}


const PostCreateScreen: React.FC<PostCreateProperties> = ({navigation, setLoading, theme, logout}) => {
    const {postType} = navigation.state.params
    const [untouched, setUntouched] = useState(true)
    const postService = new PostsService()
    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const styles = StyleSheet.create({
        postCreate: {
            backgroundColor: theme.colors.background,
            display: "flex",
            flex: 1,
            paddingVertical: 16,
            paddingHorizontal: 0,
        },
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 3,
            fontSize: 25,
        },
        input: {
            marginTop: 30,
            marginBottom: 10,
            marginHorizontal: 8
        },
        accordion: {
            marginHorizontal: 8,
            paddingHorizontal: 0,
            marginTop: 30,
            marginBottom: 8
        },
        button: {
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 8,
        }
    })

    const [post, setPost] = useState<PostInfo>({
        id: 0,
        title: '',
        game: '',
        platforms: [],
        channels: [],
        language: {id: 0, name: ''},
        user: null,
        lastUpdate: '',
        postType,
        lastAuthor: null
    })

    const [comment, setComment] = useState<Comment>({
        id: 0,
        text: '',
        lastUpdate: '',
        author: {
            id: 0,
            name: '',
            email: '',
            imageName: 0,
            languages: [],
            platforms: [],
            profiles: [],
            seenMessages: {}
        },
    })

    useEffect(() => {
        const data: PostInfo = {...post}

        if (user.languages.length >= 1) {
            data.language = user.languages[0]
        }

        setPost(data)
    }, [])

    const initErrors = (): Errors => {
        switch (postType) {
            case PostType.GENERAL:
                return {
                    title: {
                        message: '',
                        touched: false,
                        label: 'Title',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    game: {
                        message: '',
                        touched: false,
                        label: 'Game',
                        validations: [
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    text: {
                        message: '',
                        touched: false,
                        label: 'Message',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 5000,
                            },
                        ],
                    },
                    language: {
                        message: '',
                        touched: false,
                        label: 'Language',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                    platforms: {
                        message: '',
                        touched: false,
                        label: 'Platforms',
                        validations: [],
                    },
                    channels: {
                        message: '',
                        touched: false,
                        label: 'Channels',
                        validations: []
                    }
                }
            case PostType.STREAMERS:
                return {
                    title: {
                        message: '',
                        touched: false,
                        label: 'Title',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    text: {
                        message: '',
                        touched: false,
                        label: 'Message',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 5000,
                            },
                        ],
                    },
                    language: {
                        message: '',
                        touched: false,
                        label: 'Language',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    }
                }
            case PostType.SETUP:
                return {
                    title: {
                        message: '',
                        touched: false,
                        label: 'Title',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    text: {
                        message: '',
                        touched: false,
                        label: 'Message',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 5000,
                            },
                        ],
                    },
                    language: {
                        message: '',
                        touched: false,
                        label: 'Language',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                    platforms: {
                        message: '',
                        touched: false,
                        label: 'Platforms',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ]
                    }
                }
            case PostType.ONLINE:
                return {
                    title: {
                        message: '',
                        touched: false,
                        label: 'Title',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    text: {
                        message: '',
                        touched: false,
                        label: 'Message',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 5000,
                            },
                        ],
                    },
                    platforms: {
                        message: '',
                        touched: false,
                        label: 'Platforms',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                    language: {
                        message: '',
                        touched: false,
                        label: 'Language',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                }
            default:
                return {
                    title: {
                        message: '',
                        touched: false,
                        label: 'Title',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    game: {
                        message: '',
                        touched: false,
                        label: 'Game',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    text: {
                        message: '',
                        touched: false,
                        label: 'Message',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 5000,
                            },
                        ],
                    },
                    platforms: {
                        message: '',
                        touched: false,
                        label: 'Platforms',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                    language: {
                        message: '',
                        touched: false,
                        label: 'Language',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                }
        }

    }

    const [errors, setFormErrors] = useState<Errors>(initErrors())


    const validator = new Validator(errors, setFormErrors)

    const update = (id: string, value: string | Option | Option[]): void => {
        let data: any

        if (untouched) {
            setUntouched(false)
        }

        if (id === "text") {
            data = {...comment}
            data[id] = value
            setComment(data)
            validator.validateForm({...data, ...post})
        } else {
            data = {...post}
            data[id] = value
            setPost(data)
            validator.validateForm({...data, ...comment})
        }

        const err: Errors = {...errors}
        // @ts-ignore
        if (err[id]) {
            // @ts-ignore
            err[id].touched = true
        }
        setFormErrors({...errors, ...err})
    }

    const handleChange = (value: SelectItem[], field: string): void => {
        const result = value.filter((item) => item.value)
        if (field === 'language') {
            update(field, result[0] ? result[0] : [])
        } else {
            update(field, result)
        }
    }

    const save = () => {
        const data: PostInfo = {...post}
        data.user = user
        setPost(data)

        if (validator.validateForm(data)) {
            console.log('Sending post: ')
            console.log(JSON.stringify(data, null, 2))
            setLoading(true)

            postService
                .add(data, comment)
                .then((postCreated) =>
                    navigation.navigate('Detail', {title: postCreated.title, id: postCreated.id})
                )
                .catch(error => {
                    console.log('create post')
                    console.log(JSON.stringify(error))
                    console.log('----------------------------------------------------------------')
                    console.log('|' + error.message + '|')
                    if (error.message === "Request failed with status code 403") {
                        logout()
                    }
                })
                .finally(() => setLoading(false))
        } else {
            console.log('Form is not valid!')
        }

    }

    const getLanguages = () => {
        let values = user.languages.map((lang: Option) => ({
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

    const isButtonEnabled = (): boolean => {
        switch (postType) {
            case PostType.GENERAL:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.text.message ||
                    !!errors.language.message ||
                    !post.language.name
            case PostType.GAMES:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.game?.message ||
                    !!errors.text.message ||
                    !!errors.language.message ||
                    !post.language.name ||
                    !!errors.platforms?.message
            case PostType.ONLINE:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.text.message ||
                    !!errors.language.message ||
                    !post.language.name ||
                    !!errors.platforms?.message
            case PostType.STREAMERS:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.text.message ||
                    !!errors.language.message ||
                    !post.language.name
            case PostType.SETUP:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.text.message ||
                    !!errors.language.message ||
                    !post.language.name ||
                    !!errors.platforms?.message
            default:
                return true
        }
    }

    const getLabel = (label: string, id: string): string => {
        const key = id.toLowerCase()
        // @ts-ignore
        if (!errors[key]) {
            return label
        }
        return `${label} *`
    }

    return (
        <>
            <HeaderComponent
                title="Create new post"
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.goBack()
                }}
            />


            <View style={styles.postCreate}>
                <ScrollView>
                    <TextInputComponent id="title"
                                        label={getLabel("Title", "title")}
                                        value={post.title}
                                        style={styles.input}
                                        onChange={update}
                                        error={errors.title}
                    />
                    {
                        postType !== PostType.SETUP &&
                        < TextInputComponent id="game"
                                             label={getLabel("Game", "game")}
                                             value={post.game}
                                             style={styles.input}
                                             onChange={update}
                                             error={errors.game}
                        />
                    }

                    <TextInputComponent id="text"
                                        label={getLabel("Message", "text")}
                                        value={comment.text}
                                        style={styles.input}
                                        multiLine={true}
                                        error={errors.text}
                                        onChange={update}
                    />

                    <CheckBoxListComponent
                        id="languages"
                        label={getLabel("Language", "languages")}
                        values={getLanguages()}
                        initialValues={[post.language]}
                        singleMode={true}
                        error={errors.language}
                        onChange={(items) => handleChange(items, 'language')}
                        style={styles.accordion}
                    />

                    <CheckBoxListComponent
                        id="platforms"
                        label={getLabel("Platforms", "platforms")}
                        values={availablePlatforms}
                        initialValues={post.platforms}
                        error={errors.platforms}
                        onChange={(items) => handleChange(items, 'platforms')}
                        style={styles.accordion}
                    />

                    {
                        postType === PostType.STREAMERS &&
                        <CheckBoxListComponent
                            id="channels"
                            label={getLabel("Channels", "channels")}
                            values={availableChannels}
                            error={errors.channels}
                            onChange={(items) => handleChange(items, 'channels')}
                            style={styles.accordion}
                        />
                    }

                </ScrollView>

                <ButtonComponent label="Save"
                                 icon="content-save"
                                 onPress={() => save()}
                                 style={styles.button}
                                 disabled={isButtonEnabled()}
                />
            </View>
        </>
    )
}

export default connect(null, {
    setLoading: setLoading,
    logout: logout
})(withTheme(PostCreateScreen))
