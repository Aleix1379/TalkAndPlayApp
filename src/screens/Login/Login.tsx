import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-paper';
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
    theme: Theme
    login: Function
    setLoading: Function
    navigation: any
}

interface Errors {
    email: ErrorType
    password: ErrorType
}

interface Form {
    email: string
    password: string
}

const LoginScreen: React.FC<LoginProperties> = ({theme, login, setLoading, navigation}) => {
    const userService = new UserService()
    const [form, setForm] = useState<Form>(
        {
            email: '',
            password: ''
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
            flex: 1,
            backgroundColor: theme.colors.background
        },
        title: {
            textAlign: 'center',
            fontFamily: 'Ranchers-Regular',
            letterSpacing: 4,
            fontSize: 50,
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
            zIndex: 0,
            top: 0,
            left: 0,
            opacity: 0.5
        },
        content: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingHorizontal: 12,
            bottom: 25,
            display: "flex",
            flex: 1,
        },
        inputs: {
            marginTop: 'auto',
            marginBottom: 8
        },
        input: {
            marginTop: 16,
            marginBottom: 16
        },
        signInButton: {
            marginTop: 32,
            marginBottom: 32,
            marginHorizontal: 0
        },
        registerButton: {
            backgroundColor: theme.colors.accent,
            marginTop: 8,
            marginHorizontal: 8
        },
        noAccount: {
            display: "flex",
            flexDirection: "row",
            fontSize: 20,
            marginHorizontal: 8,
        },
        singUp: {
            marginLeft: 8,
            color: theme.colors.accent
        },
        icon: {
            width: 18,
            height: 18
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
        navigation.navigate('Register')
    }

    return (
        <>
            <View style={styles.login}>

                <Text style={styles.title}>Talk & Play</Text>

                <Image style={styles.image} source={require('../../assets/images/controller.png')}/>

                <View style={styles.content}>

                    <View style={styles.inputs}>
                        <View style={styles.input}>
                            <TextInputComponent
                                id='email'
                                label="Email"
                                value={form.email}
                                onChange={update}
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
                                error={errors.password}
                            />
                        </View>
                    </View>

                    <ButtonComponent
                        label="Sign in"
                        icon="account"
                        onPress={signIn}
                        style={styles.signInButton}
                        disabled={
                            (form.email.length === 0 && form.password.length === 0) ||
                            !!errors.email.message ||
                            !!errors.password.message
                        }
                    />

                    <View style={styles.noAccount}>
                        <Text>Don't have an account?</Text>
                        <Text style={styles.singUp} onPress={() => goToCreateAccount()}>Sign up  😜</Text>
                    </View>
                </View>
            </View>
        </>
    );
};

export default connect(null, {
    login: login,
    setLoading: setLoading
})(withTheme(LoginScreen))