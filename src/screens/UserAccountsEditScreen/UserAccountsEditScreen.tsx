import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import {withTheme} from "react-native-paper";
import HeaderComponent from "../../components/HeaderComponent";
import AccountEditComponent from "../../components/AccountEditComponent";
import ButtonComponent from "../../components/ButtonComponent";
import {UserState} from "../../store/user/types";
import {connect, shallowEqual, useSelector} from "react-redux";
import {ApplicationState} from "../../store";
import UserService from "../../services/User";
import {login} from "../../store/user/actions";

interface UserAccountsEditProperties {
    theme: Theme
    navigation: any
    login: (user: UserState, token?: string) => void
}

const UserAccountsEditScreen: React.FC<UserAccountsEditProperties> = ({theme, navigation}) => {
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
    });

    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)

    const userService = new UserService()
    const [inputsUpdated, setInputsUpdated] = useState<{ [key: string]: boolean }>({})
    const [untouched, setUntouched] = useState(true)
    const [accounts, setAccounts] = useState<any[]>(
        [
            {id: user.id + '-1', name: 'Xbox', value: ''},
            {id: user.id + '-2', name: 'Playstation', value: ''},
            {id: user.id + '-3', name: 'Nintendo', value: ''},
            {id: user.id + '-4', name: 'Steam', value: ''},
            {id: user.id + '-5', name: 'Discord', value: ''},
            {id: user.id + '-6', name: 'Twitch', value: ''},
            {id: user.id + '-7', name: 'Youtube', value: ''},
            {id: user.id + '-8', name: 'Facebook', value: ''},
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
        user.profiles = accounts.filter(ac => ac.value || inputsUpdated[ac.name])

        userService.updateProfile(user.id, user)
            .then((userUpdated) => {
                login(userUpdated)
                setTimeout(() => {
                    goBack()
                }, 500)
            })
            .catch(err => {
                console.log('Error updating accounts')
                console.log(err)
            })
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
    }
)(withTheme(UserAccountsEditScreen))
