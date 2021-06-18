import React, {useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {Text, withTheme} from "react-native-paper";
import HeaderComponent from "../../components/HeaderComponent";
import Image from "react-native-scalable-image";
import TextInputComponent from "../../components/TextInputComponent";
import ButtonComponent from "../../components/ButtonComponent";
import UserService from "../../services/User";
import {EMAIL, ErrorType, REQUIRED} from "../../utils/Validator/types";
import Validator from "../../utils/Validator/Validator";
import {connect} from "react-redux";
import {setLoading} from "../../store/loading/actions";

interface RecoveryPasswordProperties {
    navigation: any,
    theme: Theme,
    setLoading: Function
}

interface Errors {
    email: ErrorType
}

interface RecoveryForm {
    email: string
}


const RecoveryPasswordScreen: React.FC<RecoveryPasswordProperties> = ({navigation, theme, setLoading}) => {
    const [form, setForm] = useState<RecoveryForm>({email: ''})
    const userService = new UserService()
    const [untouched, setUntouched] = useState(true)

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
                    key: EMAIL,
                },
            ],
        },
    })

    const validator = new Validator(errors, setErrors)

    const styles = StyleSheet.create({
        recoveryPassword: {
            flex: 1,
            backgroundColor: theme.colors.background,
            alignItems: 'center',
            paddingTop: 25,
            paddingHorizontal: 8
        },
        image: {
            marginBottom: 35,
            alignSelf: "center"
        },
        title: {
            marginBottom: 16,
            fontSize: 22,
            textAlign: "center"
        },
        subTitle: {
            textAlign: "center"
        },
        input: {
            width: '100%',
            marginTop: 60,
            marginBottom: 24
        },
        button: {
            marginTop: 'auto',
            marginBottom: 24,
            width: Dimensions.get('window').width - 48
        }
    });

    const getRecoveryCode = () => {
        setLoading(true)
        userService.getRecoveryPasswordCode(form.email)
            .then(result => {
                console.log('RECOVERY CODE RESULT')
                console.log(result)
                if (result.code === 0) {
                    navigation.navigate('VerificationCode', {email: form.email})
                } else {
                    const err: Errors = {...errors}
                    // @ts-ignore
                    err['email'].touched = true
                    err['email'].message = result.message

                    setErrors(err)
                }
            })
            .catch(err => {
                console.log('user service error get recovery password code')
                console.log(err)
                console.log('---------------------------------------------------------------------------')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const update = (id: string, value: string) => {
        if (untouched) {
            setUntouched(false)
        }

        const data: RecoveryForm = {...form}
        // @ts-ignore
        data[id] = value
        setForm(data)
        validator.validateForm(data)

        const err: Errors = {...errors}
        // @ts-ignore
        err[id].touched = true
        setErrors(err)
    }

    return (
        <>
            <HeaderComponent
                title="Forgot password?"
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.navigate('Login')
                }}
            />
            <View style={styles.recoveryPassword}>
                <ScrollView>

                    <Image width={Dimensions.get('window').width * 0.5} style={styles.image}
                           source={require('../../assets/images/undraw_forgot_password_gi2d.png')}/>


                    <Text style={styles.title}>Enter the email address associated with your account</Text>

                    <Text style={styles.subTitle}>We will email you a code to reset your password</Text>

                    <TextInputComponent
                        id='email'
                        value={form.email}
                        label='Email'
                        onChange={update}
                        style={styles.input}
                        error={errors.email}
                    />
                </ScrollView>

                <ButtonComponent
                    label='Send'
                    onPress={getRecoveryCode}
                    style={styles.button}
                    disabled={
                        untouched ||
                        !!errors.email.message
                    }
                />

            </View>
        </>
    )
}

export default connect(null, {
    setLoading: setLoading
})(withTheme(RecoveryPasswordScreen))
