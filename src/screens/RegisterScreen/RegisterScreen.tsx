import React, {useState} from 'react'
import {Image, ScrollView, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import AvatarComponent from "../../components/AvatarComponent/AvatarComponent"
import TextInputComponent from "../../components/TextInputComponent/TextInputComponent"
import {LoginResponse, Option, User} from "../../types/PostsTypes"
import {EMAIL, ErrorType, MIN_LENGTH, PASSWORD_COMPLEXITY, PASSWORD_REPEAT, REQUIRED} from "../../utils/Validator/types"
import Validator from "../../utils/Validator/Validator"
import UserService from "../../services/User"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
import {connect} from "react-redux"
import {login} from "../../store/user/actions"
import {setLoading} from "../../store/loading/actions"
import LocalStorage from "../../utils/LocalStorage/LocalStorage"
import {Conditions} from "../../types/Conditions"
import ConditionComponent from "../../components/SelectComponent"
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker'
import AvatarService from "../../services/avatar"
import {ImageRequest} from "../../types/ImageRequest"
// @ts-ignore
import ImgToBase64 from 'react-native-image-base64'

interface RegisterProperties {
    theme: Theme
    setLoading: (visible: boolean) => void
    login: (user: User, token?: string) => void
    navigation: any
}

interface UserForm {
    name: string
    email: string
    password: string
    repeatPassword: string
}

interface Errors {
    name: ErrorType
    email: ErrorType
    password: ErrorType
    repeatPassword: ErrorType
}

const RegisterScreen: React.FC<RegisterProperties> = ({theme, setLoading, login, navigation}) => {
    const [conditions, setConditions] = useState<Conditions>({
        privacyPolicy: {
            text: 'I have read and agree with the privacy policy',
            value: false
        },
        termsOfUse: {
            text: 'I have read and agree with the terms and conditions',
            value: false
        },
        eula: {
            text: 'I have read and agree with EULA',
            value: false
        }
    })
    const [focused, setFocused] = useState(false)
    const avatarService = new AvatarService()
    const [image, setImage] = useState<ImageOrVideo>()
    const [timeoutId, setTimeoutId] = useState(-1)
    const [untouched, setUntouched] = useState(true)
    const [errorImage, setErrorImage] = useState('')
    const userService = new UserService()
    const [user, setUser] = useState<UserForm>({
        name: '',
        email: '',
        password: '',
        repeatPassword: '',
    })

    const styles = StyleSheet.create({
        register: {
            backgroundColor: theme.colors.background,
            display: "flex",
            flex: 1,
            zIndex: 100
        },
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 4,
            fontSize: 35,
            marginTop: 20,
            zIndex: 10,
            color: theme.colors.text,
            marginHorizontal: 16
        },
        image: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0.5,
        },
        content: {
            paddingTop: 8,
            paddingHorizontal: 12,
            display: "flex",
            flex: 1
        },
        avatar: {},
        info: {
            marginTop: 16,
            marginBottom: 16
        },
        button: {
            marginHorizontal: 12,
            marginBottom: 16,
            marginTop: 24,
        },
        noAccount: {
            display: "flex",
            flexDirection: "row",
            fontSize: 20,
            marginHorizontal: 16
        },
        singUp: {
            marginLeft: 8,
            marginBottom: 16,
            color: theme.colors.accent
        },
    })

    const [errors, setErrors] = useState<Errors>({
        name: {
            message: '',
            touched: false,
            label: 'Name',
            validations: [
                {
                    key: REQUIRED,
                },
            ],
        },
        email: {
            message: '',
            touched: false,
            label: 'Email',
            validations: [
                {
                    key: REQUIRED,
                },
                {
                    key: EMAIL,
                },
            ],
        },
        password: {
            message: '',
            touched: false,
            label: 'Password',
            validations: [
                {
                    key: MIN_LENGTH,
                    value: 6,
                },
                {
                    key: PASSWORD_COMPLEXITY,
                },
            ],
        },
        repeatPassword: {
            message: '',
            touched: false,
            label: 'Repeat password',
            validations: [
                {
                    key: PASSWORD_REPEAT,
                    fields: ['password', 'repeatPassword'],
                },
            ],
        },
    })

    const validator = new Validator(errors, setErrors)

    const checkUserExists = (id: string, value: string) => {
        userService.checkIfUserExists(id, value).then((exists) => {
            const err: Errors = {...errors}
            if (exists) {
                // @ts-ignore
                err[id].message = `${id}: ${value} already exists`
            } else {
                // @ts-ignore
                err[id].message = ''
            }
            setErrors(err)
        })
    }


    const update = (id: string, value: string | Option | Option[]): void => {
        if (untouched) {
            setUntouched(false)
        }
        const data: UserForm = {...user}
        // @ts-ignore
        data[id] = value
        setUser(data)
        validator.validateForm(data)

        const err: Errors = {...errors}
        // @ts-ignore
        err[id].touched = true
        setErrors(err)

        if (id === 'name' || id === 'email') {
            if (timeoutId !== -1) {
                clearTimeout(timeoutId)
            }
            const newTimeoutId = setTimeout(() => {
                checkUserExists(id, value as string)
            }, 1000)

            // @ts-ignore
            setTimeoutId(newTimeoutId)
        }
    }

    const createAccount = () => {
        setLoading(true)
        userService.add(user).then(async (response: LoginResponse) => {
            LocalStorage.setUser(response.user).catch(error => console.log(error))
            LocalStorage.setAuthToken(response.token).catch(error => console.log(error))
            login(response.user)
            userService.setToken(response.token)
            if (image) {
                let newImage: ImageRequest
                let base64String = await ImgToBase64.getBase64String(image.path)
                newImage = {
                    name: `${response.user.id}_avatar`,
                    base64: base64String
                }
                avatarService
                    .upload(newImage)
                    .then(() => {
                        navigation.navigate('Profile')
                    })
                    .finally(() => setLoading(false))
            } else {
                setLoading(false)
            }
        })
            .catch(err => {
                console.log('error create user')
                console.log(err)
            })
    }

    const toggleConditions = (id: string) => {
        const data = {...conditions}
        if (id === 'privacyPolicy') {
            data.privacyPolicy.value = !data.privacyPolicy.value
        } else {
            data.termsOfUse.value = !data.termsOfUse.value
        }

        setConditions(data)
    }

    const showConditions = (id: string) => {
        if (id === 'eula') {
            console.log(`show conditions => ${id}`)
            navigation.navigate('ShowEula')
        } else {
            navigation.navigate('ShowConditions', {id})
        }
    }

    return (
        <>
            <View style={styles.register}>
                <Image style={styles.image} source={require('../../assets/images/controller.png')}/>

                {!focused && <Text style={styles.title}>Talk & Play</Text>}


                <ScrollView style={styles.content}>

                    <AvatarComponent
                        style={styles.avatar}
                        path={image?.path}
                        error={errorImage}
                        onPress={() => ImagePicker.openPicker({cropping: true})
                            .then((response: ImageOrVideo) => {
                                if (response.size >= 5242880) {
                                    setErrorImage('Maximum upload file size: 5MB')
                                } else {
                                    setImage(response)
                                }
                            })
                            .catch(err => {
                                console.log('Error image picker')
                                console.log(err)
                            })}
                    />

                    <TextInputComponent
                        id="name"
                        label="Name"
                        value={user.name}
                        onChange={update}
                        error={errors.name}
                        style={styles.info}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />

                    <TextInputComponent
                        id="email"
                        label="Email"
                        value={user.email}
                        onChange={update}
                        error={errors.email}
                        style={styles.info}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />

                    <TextInputComponent
                        id="password"
                        label="Password"
                        value={user.password}
                        onChange={update}
                        password={true}
                        error={errors.password}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        style={styles.info}
                    />

                    <TextInputComponent
                        id="repeatPassword"
                        label="Repeat password"
                        value={user.repeatPassword}
                        onChange={update}
                        password={true}
                        error={errors.repeatPassword}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        style={styles.info}
                    />

                    <ConditionComponent
                        id='privacyPolicy'
                        value={conditions.privacyPolicy.value}
                        onChangeValue={() => toggleConditions('privacyPolicy')}
                        text={conditions.privacyPolicy.text}
                        show={(id) => showConditions(id)}
                    />

                    <ConditionComponent
                        id={'termsOfUse'}
                        value={conditions.termsOfUse.value}
                        onChangeValue={() => toggleConditions('termsOfUse')}
                        text={conditions.termsOfUse.text}
                        show={(id) => showConditions(id)}
                    />

{/*                    <ConditionComponent
                        id={'eula'}
                        value={conditions.eula.value}
                        onChangeValue={() => toggleConditions('eula')}
                        text={conditions.eula.text}
                        show={(id) => showConditions(id)}
                    />*/}

                    <ButtonComponent
                        label="Create account"
                        icon="account-plus"
                        onPress={createAccount}
                        style={styles.button}
                        disabled={
                            untouched ||
                            !!errors.name.message ||
                            !!errors.email.message ||
                            !!errors.password.message ||
                            !!errors.repeatPassword.message ||
                            !conditions.privacyPolicy.value ||
                            !conditions.termsOfUse.value
                        }
                    />

                    <View style={styles.noAccount}>
                        <Text>Already have an account?</Text>
                        <Text
                            style={styles.singUp}
                            onPress={() => navigation.navigate('Login')}>Sign in 😎
                        </Text>
                    </View>

                </ScrollView>

            </View>
        </>
    )
}

export default connect(
    null,
    {
        login: login,
        setLoading: setLoading
    }
)(withTheme(RegisterScreen))
