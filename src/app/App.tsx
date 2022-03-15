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
import {GoogleSignin} from "@react-native-google-signin/google-signin"

const App = () => {
    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // [Android] what API you want to access on behalf of the user, default is email and profile
        webClientId: '1:510869304297:android:65eed9579c2b1f58701178', // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        hostedDomain: '', // specifies a hosted domain restriction
        forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
        accountName: '', // [Android] specifies an account name on the device that should be used
        iosClientId: '1:510869304297:ios:974c5ee9dbd0f566701178', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
        openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
        profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
    })

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
