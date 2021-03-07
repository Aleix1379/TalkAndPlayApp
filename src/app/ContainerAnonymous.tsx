import React from 'react';
import {createStackNavigator} from "react-navigation-stack";
import PostListScreen from "../screens/PostList/PostList";
import PostDetailScreen from "../screens/PostDetail";
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import ProfileScreen from "../screens/Profile";
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginScreen from "../screens/Login";
import PostCreateScreen from "../screens/PostCreateScreen";


const PostStack = createStackNavigator({
    Home: {
        screen: PostListScreen,
        navigationOptions: {
            headerShown: false
        },
    },
});

const BottomTabNavigator = createMaterialBottomTabNavigator(
    {
        Posts: {
            screen: PostStack,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => {
                    return <MaterialCommunityIcons name="controller-classic" color={tintColor} size={24}/>;
                }
            }
        },
        Login: {
            screen: LoginScreen,
            navigationOptions: {
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
    PostCreate: {
        screen: PostCreateScreen,
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
