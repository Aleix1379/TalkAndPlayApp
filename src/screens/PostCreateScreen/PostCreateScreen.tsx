import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from "react-native";
import {Appbar, withTheme} from 'react-native-paper';
import {Theme} from "react-native-paper/lib/typescript/types";
import TextInputComponent from "../../components/TextInputComponent";
import {ErrorType} from "../../utils/Validator/types";
import {availablePlatforms, Comment, Option, PostInfo, SelectItem} from "../../types/PostsTypes";
import {UserState} from "../../store/user/types";
import {connect, shallowEqual, useSelector} from "react-redux";
import {ApplicationState} from "../../store";
import Languages from "../../utils/Languages";
import CheckBoxListComponent from "../../components/CheckBoxListComponent";
import ButtonComponent from "../../components/ButtonComponent";
import Validator from "../../utils/Validator/Validator";
import {setLoading} from "../../store/loading/actions";
import PostsService from "../../services/Posts";

interface PostCreateProperties {
    navigation: any,
    theme: Theme,
    setLoading: Function
}

interface Errors {
    title: ErrorType
    game: ErrorType
    text: ErrorType
    platforms: ErrorType
    language: ErrorType
}


const PostCreateScreen: React.FC<PostCreateProperties> = ({navigation, setLoading, theme}) => {
    const [untouched, setUntouched] = useState(true)
    const postService = new PostsService()
    const user: UserState = useSelector((state: ApplicationState) => {
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
            marginHorizontal: 0,
            paddingHorizontal: 0
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
        language: {id: 0, name: ''},
        user: null,
        lastUpdate: '',
    })

    const [comment, setComment] = useState<Comment>({
        id: 0,
        text: '',
        lastUpdate: '',
        author: {
            id: 0,
            name: '',
            email: '',
            imageVersion: 0,
            languages: [],
            platforms: [],
        },
    })

    const [errors, setFormErrors] = useState<Errors>({
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
                    value: 24,
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
                    value: 30,
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
    })

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
                .catch(error => console.log(error))
                .finally(() => setLoading(false))
        }

    }

    return (
        <>
            <Appbar>
                <Appbar.Action color={theme.colors.accent} icon="arrow-left" onPress={() => navigation.goBack()}/>
                <Appbar.Content title="Create new post" titleStyle={styles.title}/>
                <Appbar.Action color={theme.colors.primary} icon="dots-vertical"/>
            </Appbar>

            <View style={styles.postCreate}>
                <ScrollView>
                    <TextInputComponent id="game"
                                        label="Game"
                                        value={post.game}
                                        style={styles.input}
                                        onChange={update}
                                        error={errors.game}
                    />

                    <TextInputComponent id="title"
                                        label="Title"
                                        value={post.title}
                                        style={styles.input}
                                        onChange={update}
                                        error={errors.title}
                    />

                    <TextInputComponent id="text"
                                        label="Message"
                                        value={comment.text}
                                        style={styles.input}
                                        multiLine={true}
                                        error={errors.text}
                                        onChange={update}
                    />

                    <CheckBoxListComponent
                        id="languages"
                        label="Language"
                        values={Languages.sortLanguages(user.languages)}
                        initialValues={[post.language]}
                        singleMode={true}
                        error={errors.language}
                        onChange={(items) => handleChange(items, 'language')}
                    />

                    <CheckBoxListComponent
                        id="platforms"
                        label="Platforms"
                        values={availablePlatforms}
                        initialValues={post.platforms}
                        error={errors.platforms}
                        onChange={(items) => handleChange(items, 'platforms')}
                    />

                </ScrollView>

                <ButtonComponent label="Save"
                                 icon="content-save"
                                 onPress={() => save()}
                                 style={styles.button}
                                 disabled={
                                     untouched ||
                                     !!errors.game.message ||
                                     !!errors.title.message ||
                                     !!errors.text.message ||
                                     !!errors.language.message ||
                                     !!errors.platforms.message
                                 }
                />
            </View>
        </>
    )
}

export default connect(null, {
    setLoading: setLoading
})(withTheme(PostCreateScreen))