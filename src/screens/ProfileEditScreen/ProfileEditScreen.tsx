import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import HeaderComponent from "../../components/HeaderComponent";
import {connect, shallowEqual, useSelector} from "react-redux";
import {withTheme} from "react-native-paper";
import {UserState} from "../../store/user/types";
import {ApplicationState} from "../../store";
import AvatarComponent from "../../components/AvatarComponent/AvatarComponent";
import UserUtils from "../../utils/UserUtils";
import TextInputComponent from "../../components/TextInputComponent";
import {availablePlatforms, Option, SelectItem} from "../../types/PostsTypes";
import Validator from "../../utils/Validator/Validator";
import {EMAIL, ErrorType, REQUIRED} from "../../utils/Validator/types";
import CheckBoxListComponent from "../../components/CheckBoxListComponent/CheckBoxListComponent";
import Languages from "../../utils/Languages";
import ButtonComponent from "../../components/ButtonComponent";
import {setLoading} from "../../store/loading/actions";
import UserService from "../../services/User";
import {login} from "../../store/user/actions";
import {launchImageLibrary} from 'react-native-image-picker';
import {ImagePickerResponse} from "react-native-image-picker/src/types";

interface ProfileEditProperties {
    theme: Theme
    navigation: any
    setLoading: (visible: boolean) => void
    login: (user: UserState, token?: string) => void
}

interface Errors {
    name: ErrorType
    email: ErrorType
    platforms: ErrorType
    languages: ErrorType
}

const ProfileEditScreen: React.FC<ProfileEditProperties> = ({theme, navigation, setLoading, login}) => {
    const [untouched, setUntouched] = useState(true)
    const userService = new UserService()
    const [errorImage, setErrorImage] = useState('')

    const styles = StyleSheet.create({
        profileEdit: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: 8,
            paddingTop: 8,
            display: "flex",
            flex: 1,
            alignItems: "center"
        },
        avatar: {
            marginTop: 8,
            marginBottom: 24,
        },
        info: {
            marginVertical: 24,
            width: '100%'
        },
        checkBoxList: {
            marginHorizontal: 8,
            paddingHorizontal: 0,
            marginTop: 10,
            marginBottom: 24,
            width: '100%'
        },
        button: {
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 24,
        }
    });

    const [form, setForm] = useState<UserState>()
    const [image, setImage] = useState<ImagePickerResponse>()

    const userConnected: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    useEffect(() => {
        setForm({...userConnected})
    }, [])

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
        platforms: {
            message: '',
            touched: false,
            label: 'Platforms',
            validations: [
                {
                    key: REQUIRED,
                },
            ],
        },
        languages: {
            message: '',
            touched: false,
            label: 'Language',
            validations: [
                {
                    key: REQUIRED,
                },
            ],
        },
    })

    const validator = new Validator(errors, setErrors)

    const updateErrors = (err: Errors, id: string) => {
        // @ts-ignore
        err[id].touched = true
        setErrors(err)
    }

    const update = (id: string, value: string | Option | Option[]) => {
        if (untouched) {
            setUntouched(false)
        }

        // @ts-ignore
        const data: UserState = {...form}
        // @ts-ignore
        data[id] = value
        setForm(data)
        validator.validateForm(data)


        const err: Errors = {...errors}

        if ((id === 'name' && data.name !== userConnected.name) || (id === 'email' && data.email !== userConnected.email)) {
            userService.checkIfUserExists(id, data[id])
                .then((exists) => {
                    if (exists && data[id].length > 0) {
                        err[id].message = `${err[id].label}: Already exists`
                        updateErrors(err, id)
                    } else {
                        updateErrors(err, id)
                    }
                })
        } else {
            updateErrors(err, id)
        }
    }

    const handleChange = (value: SelectItem[], field: string): void => {
        const result = value.filter((item) => item.value)
        if (field === 'language') {
            update(field, result[0] ? result[0] : [])
        } else {
            update(field, result)
        }
    }

    const finish = () => {
        if (form) {
            navigation.navigate('Profile')
        }
    }

    const updateUser = async () => {
        if (form && validator.validateForm(form)) {
            try {
                setLoading(true)
                await userService.updateProfile(form.id, form)
                if (image) {
                    const newVersion = await userService.fileUpload(image, `${userConnected.id}_${userConnected.imageVersion}.png`)
                    setImage(undefined)
                    login({...userConnected, imageVersion: newVersion})
                    finish()
                } else {
                    login(form)
                    finish()
                }
            } catch (err) {
                console.log('error updating user....')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <>
            <View style={{flex: 1, backgroundColor: theme.colors.background}}>
                <HeaderComponent
                    title="Edit your profile"
                    leftAction={{
                        image: "arrow-left",
                        onPress: () => navigation.navigate('Profile')
                    }}
                />
                <ScrollView style={{flex: 1, backgroundColor: theme.colors.background}}>
                    {form &&
                    <View style={styles.profileEdit}>
                        <AvatarComponent
                            style={styles.avatar}
                            uri={image?.uri || UserUtils.getImageUrl(form)}
                            error={errorImage}
                            onPress={() => launchImageLibrary(
                                {
                                    mediaType: "photo"
                                },
                                (result) => {
                                    if (!result.didCancel) {
                                        if (result.fileSize && result.fileSize >= 5242880) {
                                            setErrorImage('Maximum upload file size: 5MB')
                                        } else {
                                            setErrorImage('')
                                            setUntouched(false)
                                            setImage(result)
                                        }
                                    }
                                }
                            )}
                        />

                        <TextInputComponent
                            id="name"
                            label="Name"
                            value={form.name}
                            onChange={update}
                            error={errors.name}
                            style={styles.info}
                        />

                        <TextInputComponent
                            id="email"
                            label="Email"
                            value={form.email}
                            onChange={update}
                            error={errors.email}
                            style={styles.info}
                        />

                        <CheckBoxListComponent
                            id="languages"
                            label="Language"
                            values={Languages.sortLanguages(userConnected.languages).map(lang => ({
                                ...lang,
                                image: 'language'
                            }))}
                            initialValues={form.languages}
                            error={errors.languages}
                            onChange={(items) => handleChange(items, 'languages')}
                            style={styles.checkBoxList}
                        />

                        <CheckBoxListComponent
                            id="platforms"
                            label="Platforms"
                            values={availablePlatforms}
                            initialValues={form.platforms}
                            error={errors.platforms}
                            onChange={(items) => handleChange(items, 'platforms')}
                            style={{...styles.checkBoxList, marginBottom: 0}}
                        />
                    </View>
                    }
                </ScrollView>

                <ButtonComponent
                    label="Save"
                    icon="content-save"
                    style={styles.button}
                    onPress={updateUser}
                    disabled={
                        untouched || !!errorImage || !!errors.name.message || !!errors.email.message
                    }
                />
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
)(withTheme(ProfileEditScreen))