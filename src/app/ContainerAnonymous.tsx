import React from 'react'
import {createStackNavigator} from "react-navigation-stack"
import PostDetailScreen from "../screens/PostDetail"
import {createAppContainer, createSwitchNavigator} from "react-navigation"
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs"
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LoginScreen from "../screens/Login"
import RegisterScreen from "../screens/RegisterScreen"
import RecoveryPasswordScreen from "../screens/RecoveryPasswordScreen"
import VerificationCodeScreen from "../screens/VerificationCodeScreen"
import PasswordEditWithCodeScreen from "../screens/PasswordEditWithCodeScreen/PasswordEditWithCodeScreen"
import ShowConditionsScreen from "../screens/ShowConditionsScreen"
import ErrorScreen from "../screens/ErrorScreen"
import PostsScreen from "../screens/PostsScreen/PostsScreen"
import ShowEulaScreen from "../screens/ShowEulaScreen";

const PostsStack = createStackNavigator({
    Home: {
        screen: PostsScreen,
        navigationOptions: {
            headerShown: false
        },
    },
})


const BottomTabNavigator = createMaterialBottomTabNavigator(
    {
        Posts: {
            screen: PostsStack,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => {
                    return <MaterialCommunityIcons name="comment-text-multiple" color={tintColor} size={25}/>
                }
            }
        },
        Login: {
            screen: LoginScreen,
            navigationOptions: {
                title: 'Log in',
                tabBarIcon: ({tintColor}) => {
                    return <MaterialCommunityIcons name="login" color={tintColor} size={24}/>
                }
            }
        }
    },
    {
        activeColor: '#1976d2',
        inactiveColor: '#888888',
        barStyle: {borderTopColor: '#0f0f0f', borderTopWidth: 0.5},
    },
)

const HomeDetailStack = createStackNavigator({
    Tabs: {
        screen: BottomTabNavigator,
        navigationOptions: {
            headerShown: false,
        },
    },
    Detail: {
        screen: PostDetailScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    Register: {
        screen: RegisterScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    RecoveryPassword: {
        screen: RecoveryPasswordScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    VerificationCode: {
        screen: VerificationCodeScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    PasswordEditWithCode: {
        screen: PasswordEditWithCodeScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    ShowConditions: {
        screen: ShowConditionsScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    Error: {
        screen: ErrorScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    ShowEula: {
        screen: ShowEulaScreen,
        navigationOptions: {
            headerShown: false
        }
    }
})

export default createAppContainer(
    createSwitchNavigator(
        {
            App: BottomTabNavigator,
            HomeDetailStack: HomeDetailStack,
        },
        {
            initialRouteName: 'App',
        },
    ),
)
