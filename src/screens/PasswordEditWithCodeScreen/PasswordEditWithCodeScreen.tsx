import React, {useState} from 'react'
import {StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {withTheme} from "react-native-paper"
import HeaderComponent from "../../components/HeaderComponent"
import TextInputComponent from "../../components/TextInputComponent"
import {ErrorType, MIN_LENGTH, PASSWORD_COMPLEXITY, PASSWORD_REPEAT} from "../../utils/Validator/types"
import Validator from "../../utils/Validator/Validator"
import ButtonComponent from "../../components/ButtonComponent"
import UserService from "../../services/User"

interface PasswordEditWithCodeProperties {
    navigation: any,
    theme: Theme
}

interface PasswordForm {
    password: string
    repeatPassword: string
}

interface Errors {
    password: ErrorType
    repeatPassword: ErrorType
}

const PasswordEditWithCodeScreen: React.FC<PasswordEditWithCodeProperties> = ({navigation, theme}) => {
    const userService = new UserService()
    const {verificationCode, email} = navigation.state.params
    const [untouched, setUntouched] = useState(true)
    const [form, setForm] = useState<PasswordForm>({
        password: '',
        repeatPassword: ''
    })
    const styles = StyleSheet.create({
        passwordEditWithCode: {
            flex: 1,
            backgroundColor: theme.colors.background,
            justifyContent: "center",
            paddingHorizontal: 16
        },
        input: {
            marginVertical: 50
        },
    })


    const [errors, setErrors] = useState<Errors>({
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

    const update = (id: string, value: string) => {
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

    const save = () => {
        console.log('update password with code')
        console.log(form.password)
        console.log(verificationCode)
        console.log(email)
        userService.resetPassword(verificationCode, email, form.password)
            .then(response => {
                if (response.code === 0) {
                    navigation.navigate('Login')
                }
            })
            .catch(err => {
                console.log('Error resetting password')
                console.log(err)
            })
    }

    return (
        <>
            <HeaderComponent
                title="New password"
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.goBack()
                }}
            />
            <View style={styles.passwordEditWithCode}>

                <TextInputComponent
                    id='password'
                    label='Introduce your new password'
                    value={form.password}
                    onChange={update}
                    password={true}
                    error={errors.password}
                    style={styles.input}
                />

                <TextInputComponent
                    id='repeatPassword'
                    label='Repeat password'
                    value={form.repeatPassword}
                    onChange={update}
                    password={true}
                    error={errors.repeatPassword}
                    style={styles.input}
                />

                <ButtonComponent
                    label='Save'
                    icon="account-plus"
                    onPress={save}
                    disabled={
                        untouched ||
                        !!errors.password.message ||
                        !!errors.repeatPassword.message
                    }
                />

            </View>
        </>
    )
}

export default withTheme(PasswordEditWithCodeScreen)
