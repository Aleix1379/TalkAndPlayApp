import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {withTheme} from "react-native-paper";
import HeaderComponent from "../../components/HeaderComponent";
import TextInputComponent from "../../components/TextInputComponent/TextInputComponent";
import CheckBoxListComponent from "../../components/CheckBoxListComponent/CheckBoxListComponent";
import {availablePlatforms, Option, PostInfo, PostType, SelectItem} from "../../types/PostsTypes";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import {ErrorType} from "../../utils/Validator/types";
import PostsService from "../../services/Posts";
import Validator from "../../utils/Validator/Validator";
import {UserState} from "../../store/user/types";
import {connect, shallowEqual, useSelector} from "react-redux";
import {ApplicationState} from "../../store";
import {setLoading} from "../../store/loading/actions";

interface PostEditProperties {
    theme: Theme
    navigation: any
    setLoading: Function
}

interface Errors {
    title: ErrorType
    game: ErrorType
    platforms?: ErrorType
    language: ErrorType
    channels?: ErrorType
}

const PostEditScreen: React.FC<PostEditProperties> = ({theme, navigation, setLoading}) => {
    const {title, id, updatePost, postType} = navigation.state.params
    const [untouched, setUntouched] = useState(true)
    const postService = new PostsService()
    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const styles = StyleSheet.create({
        postEdit: {
            backgroundColor: theme.colors.background,
            display: "flex",
            flex: 1,
            paddingVertical: 16,
            paddingHorizontal: 0,
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
    });

    const [post, setPost] = useState<PostInfo>({
        id: 0,
        title: '',
        game: '',
        platforms: [],
        channels: [],
        language: {id: 0, name: ''},
        user: null,
        lastUpdate: '',
        postType: PostType.ONLINE
    })

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

        data = {...post}
        data[id] = value
        setPost(data)
        validator.validateForm(data)

        const err: Errors = {...errors}
        // @ts-ignore
        err[id].touched = true
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

    useEffect(() => {
        postService.getPostById(id)
            .then(data => setPost(data))
            .catch(error => console.log(error))
    }, [])

    const save = async () => {
        try {
            setLoading(true)
            await postService.update(post)
            updatePost(post)
            navigation.navigate('Detail', {title, id})
        } catch (e) {
            console.log('Error updating post.....')
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    const isButtonEnabled = (): boolean => {
        switch (postType) {
            case PostType.GENERAL:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.language.message ||
                    !post.language.name
            case PostType.GAMES:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.game?.message ||
                    !!errors.language.message ||
                    !post.language.name ||
                    !!errors.platforms?.message
            case PostType.ONLINE:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.game?.message ||
                    !!errors.language.message ||
                    !post.language.name ||
                    !!errors.platforms?.message
            case PostType.STREAMERS:
                return untouched ||
                    !!errors.game?.message ||
                    !!errors.title.message ||
                    !!errors.language.message ||
                    !post.language.name ||
                    !!errors.channels?.message
            default:
                return true
        }
    }

    return (
        <>
            <HeaderComponent
                title="Edit post"
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.goBack()
                }}
            />

            <View style={styles.postEdit}>
                <ScrollView>
                    <TextInputComponent id="title"
                                        label="Title"
                                        value={post.title}
                                        style={styles.input}
                                        onChange={update}
                                        error={errors.title}
                    />

                    <TextInputComponent id="game"
                                        label="Game"
                                        value={post.game}
                                        style={styles.input}
                                        onChange={update}
                                        error={errors.game}
                    />

                    <CheckBoxListComponent
                        id="languages"
                        label="Language"
                        values={user.languages.map(lang => ({
                            ...lang,
                            image: 'language'
                        }))}
                        initialValues={[post.language]}
                        singleMode={true}
                        error={errors.language}
                        onChange={(items) => handleChange(items, 'language')}
                        style={styles.accordion}
                    />

                    <CheckBoxListComponent
                        id="platforms"
                        label="Platforms"
                        values={availablePlatforms}
                        initialValues={post.platforms}
                        error={errors.platforms}
                        onChange={(items) => handleChange(items, 'platforms')}
                        style={styles.accordion}
                    />

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
    setLoading: setLoading
})(withTheme(PostEditScreen))
