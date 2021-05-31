import React from 'react';
import {createStackNavigator} from "react-navigation-stack";
import PostDetailScreen from "../screens/PostDetail";
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginScreen from "../screens/Login";
import RegisterScreen from "../screens/RegisterScreen";
import RecoveryPasswordScreen from "../screens/RecoveryPasswordScreen";
import VerificationCodeScreen from "../screens/VerificationCodeScreen";
import PasswordEditWithCodeScreen from "../screens/PasswordEditWithCodeScreen/PasswordEditWithCodeScreen";
import PostListGames from "../screens/PostListGames";
import PostListOnline from "../screens/PostListOnline/PostListOnline";
import PostListStreamers from "../screens/PostListStreamers/PostListStreamers";
import ShowConditionsScreen from "../screens/ShowConditionsScreen";
import ErrorScreen from "../screens/ErrorScreen";


const GamesStack = createStackNavigator({
    Home: {
        screen: PostListGames,
        navigationOptions: {
            headerShown: false
        },
    },

});

const OnlineStack = createStackNavigator({
    Home: {
        screen: PostListOnline,
        navigationOptions: {
            headerShown: false
        },
    },

});
const StreamersStack = createStackNavigator({
    Home: {
        screen: PostListStreamers,
        navigationOptions: {
            headerShown: false
        },
    },

});

const BottomTabNavigator = createMaterialBottomTabNavigator(
    {
        Games: {
            screen: GamesStack,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => {
                    return <MaterialCommunityIcons name="controller-classic" color={tintColor} size={25}/>;
                }
            }
        },
        Online: {
            screen: OnlineStack,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => {
                    return <MaterialCommunityIcons name="account-group" color={tintColor} size={25}/>;
                }
            }
        },
        Streamers: {
            screen: StreamersStack,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => {
                    return <MaterialCommunityIcons name="twitch" color={tintColor} size={25}/>;
                }
            }
        },
        Login: {
            screen: LoginScreen,
            navigationOptions: {
                title: 'Log in',
                tabBarIcon: ({tintColor}) => {
                    return <MaterialCommunityIcons name="login" color={tintColor} size={24}/>;
                }
            }
        }
    },
    {
        activeColor: '#1976d2'
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
    }
});

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
);
