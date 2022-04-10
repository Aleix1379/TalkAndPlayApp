/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react'
import {Provider as PaperProvider} from 'react-native-paper'
import {NavigationContainer} from '@react-navigation/native'
import {Provider} from "react-redux"
import {applyMiddleware, createStore, Store} from "redux"
import reducers, {ApplicationState} from "../store"
import {DispatchType} from "../store/user/types"
import thunk from 'redux-thunk'
import Content from "./Content"
import {StatusBar} from "react-native"
import UiUtils from "../utils/UiUtils"

const App = () => {
    const store: Store<ApplicationState> & {
        dispatch: DispatchType
    } = createStore(reducers, applyMiddleware(thunk))

    let darkTheme = true

    return (
        <PaperProvider theme={UiUtils.getTheme(darkTheme)}>
            <Provider store={store}>
                <NavigationContainer>
                    <StatusBar
                        barStyle={darkTheme ? "light-content" : "dark-content"}
                        backgroundColor={UiUtils.getTheme(darkTheme).colors.surface}
                    />
                    <Content/>
                </NavigationContainer>
            </Provider>
        </PaperProvider>
    )
}

export default App
