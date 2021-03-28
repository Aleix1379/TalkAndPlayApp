/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from "react-redux";
import {applyMiddleware, createStore, Store} from "redux";
import reducers, {ApplicationState} from "../store";
import {DispatchType} from "../store/user/types";
import thunk from 'redux-thunk'
import Content from "./Content";
import {StatusBar, View} from "react-native";

const App = () => {
    const store: Store<ApplicationState> & {
        dispatch: DispatchType
    } = createStore(reducers, applyMiddleware(thunk))

    let darkTheme = true;
    const getTheme = () => {
        if (darkTheme) {
            return {
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                    primary: '#212121',
                    text: '#fafafa',
                    background: '#363636',
                    accent: '#075aab',
                    onSurface: '#1976d2',
                    surface: '#0f0f0f',
                    error: '#b71c1c'
                },
            };
        } else {
            return {
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                    primary: '#C0C0C0',
                    accent: '#075aab',
                    onSurface: '#1976d2',
                    surface: '#e9e9e9',
                    error: '#b71c1c'
                },
            };
        }
    };

    return (
        <Provider store={store}>
            <NavigationContainer>
                <PaperProvider theme={getTheme()}>
                    <StatusBar
                        barStyle={darkTheme ? "light-content" : "dark-content"}
                        backgroundColor={getTheme().colors.surface}
                    />
                    <Content/>
                </PaperProvider>
            </NavigationContainer>
        </Provider>
    );
};

export default App;
