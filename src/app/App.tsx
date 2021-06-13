/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect} from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from "react-redux";
import {applyMiddleware, createStore, Store} from "redux";
import reducers, {ApplicationState} from "../store";
import {DispatchType} from "../store/user/types";
import thunk from 'redux-thunk'
import Content from "./Content";
import {Alert, StatusBar} from "react-native";
import firebase from "react-native-firebase";
import LocalStorage from "../utils/LocalStorage/LocalStorage";

const App = () => {
    let notificationListener = null
    let notificationOpenedListener = null
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
                    text: '#bdbdbd',
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
                    primary: '#959595',
                    accent: '#075aab',
                    onSurface: '#1976d2',
                    surface: '#e9e9e9',
                    error: '#b71c1c'
                },
            };
        }
    };

    useEffect(() => {
        //we check if user has granted permission to receive push notifications.
        checkPermission().catch(err => {
            console.log('Error check permission')
            console.log(err)
        })
        // Register all listener for notification
        createNotificationListeners().catch(err => {
            console.log('Error createNotificationListeners')
            console.log(err)
        })

        firebase.messaging().subscribeToTopic("comments")
    }, [])

    const checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        // If Permission granted proceed towards token fetch
        if (enabled) {
            getToken().catch(err => {
                console.log('Error get token')
                console.log(err)
            })
        } else {
            // If permission hasn't been granted to our app, request user in requestPermission method.
            requestPermission().catch(err => {
                console.log('Error request permission')
                console.log(err)
            })
        }
    }

    const getToken = async () => {
        let fcmToken = await LocalStorage.getFcmToken()
        console.log('GET TOKEN:')
        console.log(fcmToken)
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                LocalStorage.setFcmToken(fcmToken).catch(error => {
                    console.log('Error saving fcm token')
                    console.log(error)
                })
            }
        }
    }

    const requestPermission = async () => {
        try {
            await firebase.messaging().requestPermission()
            // User has authorised
            getToken().catch(error => {
                console.log('Error get token')
                console.log(error)
            })
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }

    const createNotificationListeners = async () => {

        // This listener triggered when notification has been received in foreground
        notificationListener = firebase.notifications().onNotification((notification) => {
            const {title, body} = notification
            displayNotification(title, body)
        });

        // This listener triggered when app is in background and we click, tapped and opened notification
        notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const {title, body} = notificationOpen.notification
            displayNotification(title, body)
        });

        // This listener triggered when app is closed and we click,tapped and opened notification
        const notificationOpen = await firebase.notifications().getInitialNotification();
        console.log('notificationOpen')
        console.log(notificationOpen)
        if (notificationOpen) {
            const {title, body} = notificationOpen.notification
            displayNotification(title, body)
        }
    }

    const displayNotification = (title: string, body: string) => {
        // we display notification in alert box with title and body
        console.log('TITLE: ' + title)
        console.log('BODY: ' + body)

        Alert.alert(
            title, body,
            [
                {text: 'Ok', onPress: () => console.log('ok pressed')},
            ],
            {cancelable: false},
        );
    }

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
