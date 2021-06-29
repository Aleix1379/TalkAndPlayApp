import React, {useState} from 'react'
import {Dimensions, ScrollView, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Snackbar, Text, withTheme} from "react-native-paper"
import HeaderComponent from "../../components/HeaderComponent"
import Image from "react-native-scalable-image"
import ValidationCodeComponent from "../../components/ValidationCodeComponent"
import KeyboardComponent from "../../components/KeyboardComponent/KeyboardComponent"
import UserService from "../../services/User"

interface VerificationCodeProperties {
    navigation: any,
    theme: Theme
}

interface SnackBar {
    visible: boolean
    content: string
}


const VerificationCodeScreen: React.FC<VerificationCodeProperties> = ({navigation, theme}) => {
    const {email} = navigation.state.params
    const [snackbar, setSnackbar] = useState<SnackBar>({
        visible: false,
        content: ''
    })
    const userService = new UserService()
    const length = 6
    const [values, setValues] = useState<string []>([])
    const styles = StyleSheet.create({
        verificationCode: {
            flex: 1,
            backgroundColor: theme.colors.background,
            alignItems: 'center',
            paddingTop: 24,
            paddingHorizontal: 24
        },
        image: {
            marginBottom: 24,
            alignSelf: "center"
        },
        title: {
            marginBottom: 16,
            fontSize: 18,
            textAlign: "center"
        },
        snackBarContainer: {
            backgroundColor: theme.colors.error,
        },
        snackBarWrapper: {
            width: Dimensions.get('window').width,
        }
    })

    const pressKey = (value: number | string) => {
        let data: any[] = [...values]
        if (value === 'delete' && values.length > 0) {
            data.pop()
            setSnackbar({
                visible: false,
                content: ''
            })
        } else if (value !== 'delete' && values.length < length) {
            data.push(value)

            if (values.length === length - 1) {
                userService.verifyPassword(email, data.join(''))
                    .then(result => {
                        if (result.code === 0) {
                            setSnackbar({
                                visible: false,
                                content: ''
                            })
                            // setErrorMessage('')
                            navigation.navigate('PasswordEditWithCode', {verificationCode: data.join(''), email})
                        } else {
                            console.log('error verifyPassword')
                            console.log(result.message)
                            setSnackbar({
                                visible: true,
                                content: result.message
                            })
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
            <Snackbar
                visible={snackbar.visible}
                duration={3000}
                onDismiss={() => setSnackbar({visible: false, content: ''})}
                wrapperStyle={styles.snackBarWrapper}
                style={styles.snackBarContainer}
            >
                <Text>{snackbar.content}</Text>
            </Snackbar>
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

                    <Text style={styles.title}>Enter the verification code we just sent you on your email address</Text>

                    <ValidationCodeComponent values={values} length={length} style={{marginBottom: 16}}/>

                    {/*               <View style={styles.errorContainer}>
                        {
                            errorMessage.length > 0 &&
                            <Text style={styles.error}>{errorMessage}</Text>
                        }
                    </View>*/}

                    <KeyboardComponent onPress={(value => pressKey(value))}/>

                </ScrollView>
            </View>
        </>
    )
}

export default withTheme(VerificationCodeScreen)
