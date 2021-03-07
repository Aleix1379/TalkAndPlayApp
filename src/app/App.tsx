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

const App = () => {
    const store: Store<ApplicationState> & {
        dispatch: DispatchType
    } = createStore(reducers, applyMiddleware(thunk))

    const getTheme = () => {
        let darkTheme = true;
        if (darkTheme) {
            return {
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                    primary: '#1a1a1a',
                    text: '#fafafa',
                    background: '#363636',
                    accent: '#075aab',
                    onSurface: '#1976d2',
                    surface: '#0f0f0f'
                },
            };
        } else {
            return {
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                    primary: '#e0e0e0',
                    accent: '#075aab',
                    onSurface: '#1976d2',
                    surface: '#e9e9e9'
                },
            };
        }
    };

    return (
        <Provider store={store}>
            <NavigationContainer>
                <PaperProvider theme={getTheme()}>
                    <Content/>
                </PaperProvider>
            </NavigationContainer>
        </Provider>
    );
};

export default App;
