import React, {useState} from 'react'
import {Dimensions, ScrollView, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import HeaderComponent from "../../components/HeaderComponent"
import Image from "react-native-scalable-image"
import ValidationCodeComponent from "../../components/ValidationCodeComponent"
import KeyboardComponent from "../../components/KeyboardComponent/KeyboardComponent"
import UserService from "../../services/User"

interface VerificationCodeProperties {
    navigation: any,
    theme: Theme
}

const VerificationCodeScreen: React.FC<VerificationCodeProperties> = ({navigation, theme}) => {
    const {email} = navigation.state.params
    const userService = new UserService()
    const length = 6
    const [values, setValues] = useState<string []>([])
    const [errorMessage, setErrorMessage] = useState('')
    const styles = StyleSheet.create({
        verificationCode: {
            flex: 1,
            backgroundColor: theme.colors.background,
            alignItems: 'center',
            paddingTop: 25,
            paddingHorizontal: 24
        },
        image: {
            marginBottom: 35,
            alignSelf: "center"
        },
        title: {
            marginBottom: 24,
            fontSize: 18,
            textAlign: "center"
        },
        error: {
            color: '#ff2222',
        }
    })

    const pressKey = (value: number | string) => {
        let data: any[] = [...values]
        if (value === 'delete' && values.length > 0) {
            data.pop()
            setErrorMessage('')
        } else if (value !== 'delete' && values.length < length) {
            data.push(value)

            if (values.length === length - 1) {
                console.log('SEND CODE')
                console.log(data)
                userService.verifyPassword(email, data.join(''))
                    .then(result => {
                        if (result.code === 0) {
                            console.log('Go to update password')
                            setErrorMessage('')
                            navigation.navigate('PasswordEditWithCode', {verificationCode: data.join(''), email})
                        } else {
                            console.log(result.message)
                            setErrorMessage(result.message)
                        }
                    })
                    .catch(err => {
                        console.log(`Error verifying code: ${data}`)
                        console.log(err)
                    })
            }
        }
        setValues(data)
    }

    return (
        <>
            <HeaderComponent
                title="Verification"
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.goBack()
                }}
            />
            <View style={styles.verificationCode}>
                <ScrollView>

                    <Image width={Dimensions.get('window').width * 0.5} style={styles.image}
                           source={require('../../assets/images/undraw_secure_login_pdn4.png')}/>

                    <Text style={styles.title}>Enter the verification code we just send you on your email address</Text>

                    <ValidationCodeComponent values={values} length={length}/>

                    {errorMessage.length > 0 && <Text style={styles.error}>{errorMessage}</Text>}

                    <KeyboardComponent onPress={(value => pressKey(value))}/>

                </ScrollView>
            </View>
        </>
    )
}

export default withTheme(VerificationCodeScreen)
