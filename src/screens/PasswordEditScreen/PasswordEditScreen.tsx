import React, {useState} from 'react'
import {StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import TextInputComponent from "../../components/TextInputComponent/TextInputComponent"
import {Snackbar, Text, withTheme} from "react-native-paper"
import HeaderComponent from "../../components/HeaderComponent"
import {connect, shallowEqual, useSelector} from "react-redux"
import ButtonComponent from "../../components/ButtonComponent"
import {ErrorType, MIN_LENGTH, PASSWORD_COMPLEXITY, PASSWORD_REPEAT} from "../../utils/Validator/types"
import Validator from "../../utils/Validator/Validator"
import {ApplicationState} from "../../store"
import UserService from "../../services/User"
import {setLoading} from "../../store/loading/actions"
import {User} from "../../types/PostsTypes"

interface PasswordEditProperties {
    navigation: any,
    theme: Theme,
    setLoading: Function
}

interface PasswordForm {
    currentPassword: string,
    password: string,
    repeatPassword: string
}

interface Errors {
    currentPassword: ErrorType
    password: ErrorType
    repeatPassword: ErrorType
}

interface SnackBar {
    visible: boolean
    message: string
}

const PasswordEditScreen: React.FC<PasswordEditProperties> = ({navigation, theme, setLoading}) => {
    const userService = new UserService()
    const [untouched, setUntouched] = useState(true)
    const [snackBar, setSnackBar] = useState<SnackBar>({
        visible: false,
        message: ''
    })
    const [form, setForm] = useState<PasswordForm>({
        currentPassword: '',
        password: '',
        repeatPassword: ''
    })
    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const styles = StyleSheet.create({
        passwordEdit: {
            backgroundColor: theme.colors.background,
            flex: 1,
            padding: 8,
            paddingTop: 32
        },
        info: {
            marginVertical: 32,
            width: '100%'
        },
        button: {
            marginTop: 'auto',
            marginBottom: 16,
            marginHorizontal: 8
        }
    })

    const [errors, setErrors] = useState<Errors>({
        currentPassword: {
            message: '',
            touched: false,
            label: 'Current password',
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
        }
    })

    const validator = new Validator(errors, setErrors)

    const updateErrors = (id: string, message: string): void => {
        const err: Errors = {...errors}
        // @ts-ignore
        err[id].message = message
        setErrors(err)
    }

    const updatePassword = (id: string, value: string): void => {
        if (untouched) {
            setUntouched(false)
        }
        const data: PasswordForm = {...form}
        // @ts-ignore
        data[id] = value
        setForm(data)
        validator.validateForm(data)

        const err: Errors = {...errors}
        // @ts-ignore
        err[id].touched = true
        setErrors(err)
    }

    const checkPassword = async (): Promise<boolean> => {
        try {
            return await userService.checkPassword(user.email, form.currentPassword)
        } catch (err) {
            return false
        }
    }

    const savePassword = async () => {
        setLoading(true)
        const passwordIsCorrect = await checkPassword()
        if (!passwordIsCorrect) {
            updateErrors('currentPassword', 'Password is not correct')
            setLoading(false)
        } else {
            try {
                const result = await userService.updatePassword(user.id, form.currentPassword, form.password)
                if (result) {
                    setSnackBar({visible: true, message: 'Password updated correctly 😎'})
                } else {
                    setSnackBar({visible: true, message: 'Error updating password 🥵'})
                }
                setForm({
                    currentPassword: '',
                    password: '',
                    repeatPassword: ''
                })
                setUntouched(true)
            } catch (e) {
                console.log('error updating password')
                console.log(e)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <>
            <HeaderComponent
                navigation={navigation}
                title="Edit password"
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.goBack()
                }}
            />

            <Snackbar
                visible={snackBar.visible}
                style={{backgroundColor: theme.colors.background}}
                onDismiss={() => {
                    setSnackBar({visible: false, message: ''})
                }}
            >
                <Text>{snackBar.message}</Text>
            </Snackbar>

            <View style={styles.passwordEdit}>
                <TextInputComponent
                    id="currentPassword"
                    label="Current password"
                    password={true}
                    value={form.currentPassword}
                    onChange={updatePassword}
                    style={styles.info}
                    error={errors.currentPassword}
                />

                <TextInputComponent
                    id="password"
                    label="Password"
                    password={true}
                    value={form.password}
                    onChange={updatePassword}
                    style={styles.info}
                    error={errors.password}
                />

                <TextInputComponent
                    id="repeatPassword"
                    label="Repeat password"
                    password={true}
                    value={form.repeatPassword}
                    onChange={updatePassword}
                    style={styles.info}
                    error={errors.repeatPassword}
                />

                <ButtonComponent
                    label="Save"
                    icon="content-save"
                    style={styles.button}
                    onPress={savePassword}
                    disabled={
                        untouched ||
                        !!errors.currentPassword.message ||
                        !!errors.password.message ||
                        !!errors.repeatPassword.message
                    }
                />

            </View>
        </>
    )
}

export default connect(null, {
    setLoading: setLoading
})(withTheme(PasswordEditScreen))
