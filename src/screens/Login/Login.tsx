import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Appbar, Button, Text, withTheme} from 'react-native-paper';
import {Theme} from "react-native-paper/lib/typescript/types";
import TextInputComponent from "../../components/TextInputComponent";
import ButtonComponent from "../../components/ButtonComponent";
import UserService from "../../services/User";
import {EMAIL, ErrorType, MAX_LENGTH, MIN_LENGTH, REQUIRED} from "../../utils/Validator/types";
import Validator from "../../utils/Validator/Validator";
import {connect} from 'react-redux';
import {login} from "../../store/user/actions";
import {setLoading} from "../../store/loading/actions";

interface LoginProperties {
    navigation: any
    theme: Theme
    login: Function
    setLoading: Function
}

interface Errors {
    email: ErrorType
    password: ErrorType
}

interface Form {
    email: string
    password: string
}

const LoginScreen: React.FC<LoginProperties> = ({navigation, theme, login, setLoading}) => {
    const userService = new UserService()
    const [form, setForm] = useState<Form>(
        {
            email: 'aleix@gmail.com',
            password: '1234=asdf'
        }
    )

    const [errors, setErrors] = useState<Errors>({
        email: {
            message: '',
            touched: false,
            label: 'Email',
            validations: [
                {
                    key: REQUIRED,
                },
                {
                    key: MAX_LENGTH,
                    value: 30,
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
            ],
        },
    })

    const styles = StyleSheet.create({
        login: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: 6,
            paddingTop: 8
        },
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 3,
            fontSize: 25
        },
        inputs: {
            marginBottom: 8
        },
        input: {
            marginTop: 16,
            marginBottom: 16,
            backgroundColor: theme.colors.background,
        },
        signInButton: {
            backgroundColor: theme.colors.accent,
            marginTop: 16,
            marginBottom: 32
        },
        help: {
            fontSize: 20,
            marginTop: 24,
            marginBottom: 8
        },
        registerButton: {
            backgroundColor: theme.colors.accent,
            marginTop: 8,
        }
    });

    const validator = new Validator(errors, setErrors)

    const update = (id: string, value: string) => {
        // setForm({...form, [id]: value})
        const data: Form = {...form}
        // @ts-ignore
        data[id] = value
        setForm(data)
        validator.validateForm(data)

        const err: Errors = {...errors}
        // @ts-ignore
        err[id].touched = true
        setErrors(err)
    }

    const signIn = () => {
        setLoading(true)
        userService.login(form.email, form.password)
            .then(loginResponse => {
                console.log('loginResponse.user::::')
                console.log(loginResponse.user)
                login(loginResponse.user, loginResponse.token)
            })
            .catch(() => {
                const err = errors['email']
                err.message = 'Your username and/or password do not match'
                setErrors({...errors, ['email']: err})
            })
            .finally(() => setLoading(false))
    }

    const goToCreateAccount = () => {

    }

    return (
        <>
            <Appbar>
                <Appbar.Content title="Sign In" titleStyle={styles.title}/>
            </Appbar>

            <ScrollView style={styles.login}>
                <View style={styles.inputs}>
                    <View style={styles.input}>
                        <TextInputComponent
                            id='email'
                            label="Email"
                            value={form.email}
                            onChange={update}
                            theme={theme}
                            error={errors.email}
                        />
                    </View>

                    <View style={styles.input}>
                        <TextInputComponent
                            id='password'
                            label="Password"
                            value={form.password}
                            onChange={update}
                            password={true}
                            theme={theme}
                            error={errors.password}
                        />
                    </View>
                </View>

                <ButtonComponent label="Sign in" icon="account" theme={theme} onPress={signIn}/>

                <Text style={styles.help}>Don't have an account?</Text>
                <ButtonComponent label="Create and account"
                                 icon="account-plus"
                                 theme={theme}
                                 onPress={goToCreateAccount}
                />
            </ScrollView>
        </>
    );
};

export default connect(null, {
    login: login,
    setLoading: setLoading
})(withTheme(LoginScreen))