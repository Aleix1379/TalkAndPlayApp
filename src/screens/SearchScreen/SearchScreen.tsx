import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from "react-native";
import {withTheme} from 'react-native-paper';
import {Theme} from "react-native-paper/lib/typescript/types";
import HeaderComponent from "../../components/HeaderComponent";
import {availablePlatforms, Option, SelectItem} from "../../types/PostsTypes";
import TextInputComponent from "../../components/TextInputComponent";
import ButtonComponent from "../../components/ButtonComponent";
import CheckBoxListComponent from "../../components/CheckBoxListComponent/CheckBoxListComponent";
import languages from "../../store/languages.json";
import {UserState} from "../../store/user/types";
import {shallowEqual, useSelector} from "react-redux";
import {ApplicationState} from "../../store";
import LocalStorage from "../../utils/LocalStorage/LocalStorage";

interface SearchProperties {
    navigation: any,
    theme: Theme
}

interface Form {
    title: string
    game: string
    languages: Option[]
    platforms: Option[]
}

const SearchScreen: React.FC<SearchProperties> = ({navigation, theme}) => {
    const {search} = navigation.state.params
    const [untouched, setUntouched] = useState(true)
    const user: UserState = useSelector((state: ApplicationState) => {
        return state.user
    }, shallowEqual)
    const [form, setForm] = useState<Form>({
        title: '',
        game: '',
        languages: [],
        platforms: []
    })

    const styles = StyleSheet.create({
        search: {
            backgroundColor: theme.colors.background,
            flex: 1,
            paddingTop: 16,
            paddingHorizontal: 16
        },
        input: {
            marginTop: 32
        },
        accordion: {
            marginTop: 32
        },
        button: {
            marginTop: 'auto',
            marginBottom: 24
        }
    });

    useEffect(() => {
        LocalStorage.getFilter()
            .then(data => {
                if (data) {
                    setForm(data)
                }
            })
            .catch(err => {
                console.log('Error getting filter')
                console.log(err)
            })
    }, [])

    const update = (id: string, value: string | Option | Option[]): void => {
        let data: any

        if (untouched) {
            setUntouched(false)
        }

        data = {...form}
        data[id] = value
        setForm(data)
    }

    const handleChange = (value: SelectItem[], field: string): void => {
        const result = value.filter((item) => item.value)
        update(field, result)
    }

    const getLanguages = () => {
        let values = user.languages.map(lang => ({
            ...lang,
            image: 'language'
        }))

        if (values.length === 0) {
            return languages.map(lang => ({
                ...lang,
                image: 'language'
            }))
        }

        return values
    }

    return (
        <>
            <HeaderComponent
                title="Search"
                leftAction={{
                    image: "arrow-left",
                    onPress: () => navigation.goBack()
                }}
            />
            <View style={styles.search}>
                <ScrollView>
                    <TextInputComponent
                        id="title"
                        label="Title"
                        value={form.title}
                        onChange={update}
                        style={styles.input}
                    />

                    <TextInputComponent
                        id="game"
                        label="Game"
                        value={form.game}
                        onChange={update}
                        style={styles.input}
                    />

                    <CheckBoxListComponent
                        id="languages"
                        label="Language"
                        values={getLanguages()}
                        initialValues={form.languages}
                        onChange={(items) => handleChange(items, 'languages')}
                        style={styles.accordion}
                    />

                    <CheckBoxListComponent
                        id="platforms"
                        label="Platforms"
                        values={availablePlatforms}
                        initialValues={form.platforms}
                        onChange={(items) => handleChange(items, 'platforms')}
                        style={styles.accordion}
                    />
                </ScrollView>

                <ButtonComponent
                    label="Search"
                    icon="magnify"
                    onPress={() => {
                        let filter = {
                            title: form.title,
                            game: form.game,
                            languages: form.languages,
                            platforms: form.platforms
                        }
                        LocalStorage.addFilter(filter)
                            .then(() => {
                                search(filter)
                                navigation.goBack()
                            })
                            .catch(err => {
                                console.log('Error saving filter')
                                console.log(err)
                            })
                    }}
                    style={styles.button}
                />

            </View>
        </>
    )
}

export default withTheme(SearchScreen)
