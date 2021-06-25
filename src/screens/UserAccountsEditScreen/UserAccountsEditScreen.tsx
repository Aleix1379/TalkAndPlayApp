import React, {useEffect, useState} from 'react'
import {ScrollView, StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {withTheme} from "react-native-paper"
import HeaderComponent from "../../components/HeaderComponent"
import AccountEditComponent from "../../components/AccountEditComponent"
import ButtonComponent from "../../components/ButtonComponent"
import {connect, shallowEqual, useSelector} from "react-redux"
import {ApplicationState} from "../../store"
import UserService from "../../services/User"
import {login} from "../../store/user/actions"
import {User} from "../../types/PostsTypes"
import {setLoading} from "../../store/loading/actions"

interface UserAccountsEditProperties {
    theme: Theme
    navigation: any
    login: (user: User, token?: string) => void
    setLoading: (value: boolean) => void
}

const UserAccountsEditScreen: React.FC<UserAccountsEditProperties> = ({theme, navigation, setLoading}) => {
    const styles = StyleSheet.create({
        userAccountsEdit: {
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingHorizontal: 8,
            paddingTop: 8
        },
        account: {
            marginVertical: 16
        },
        button: {
            marginTop: 'auto',
            marginBottom: 24
        }
    })

    const user: User = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const userService = new UserService()
    const [inputsUpdated, setInputsUpdated] = useState<{ [key: string]: boolean }>({})
    const [untouched, setUntouched] = useState(true)
    const [accounts, setAccounts] = useState<any[]>(
        [
            {id: null, name: 'Xbox', value: ''},
            {id: null, name: 'Playstation', value: ''},
            {id: null, name: 'Nintendo', value: ''},
            {id: null, name: 'Steam', value: ''},
            {id: null, name: 'Discord', value: ''},
            {id: null, name: 'Twitch', value: ''},
            {id: null, name: 'Youtube', value: ''},
            {id: null, name: 'Facebook', value: ''},
        ]
    )

    useEffect(() => {
        const result = accounts.map(account => {
            let item = user.profiles.find(ac => ac.name === account.name)

            if (item) {
                account.id = item.id
            }
            if (item && item.value) {
                account.value = item.value
            }
            return account
        })
        setAccounts(result)
    }, [user])

    const update = (id: string, value: string) => {
        setInputsUpdated({...inputsUpdated, [id]: true})
        setUntouched(false)
        const items = [...accounts]
        const item = items.find(ac => ac.name === id)

        if (item) {
            item.value = value
        }

        setAccounts(items)
    }

    const goBack = () => {
        navigation.navigate('Profile', {index: 1})
    }

    const save = () => {
        setLoading(true)
        user.profiles = accounts
            .filter(ac => ac.value || inputsUpdated[ac.name])
            .map(({id, name, value}) => (
                {
                    id,
                    name,
                    value: value.trim()
                }
            ))
        userService.updateProfile(user.id, user)
            .then((userUpdated) => {
                console.log('userUpdated')
                console.log(userUpdated)
                login(userUpdated)
                goBack()
            })
            .catch(err => {
                console.log('Error updating accounts')
                console.log(err)
                setLoading(false)
            })
            .finally(() => setLoading(false))
    }

    return (
        <>
            <HeaderComponent
                title="Enter the user name"
                leftAction={{
                    image: "arrow-left",
                    onPress: () => goBack()
                }}
            />

            <View style={styles.userAccountsEdit}>
                <ScrollView>
                    {accounts.map(account => (
                            <AccountEditComponent
                                key={account.name}
                                account={account}
                                onChange={update}
                                style={styles.account}
                            />
                        )
                    )}
                </ScrollView>
                <ButtonComponent
                    label='Save'
                    icon="content-save"
                    onPress={() => save()}
                    style={styles.button}
                    disabled={untouched}
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
)(withTheme(UserAccountsEditScreen))
