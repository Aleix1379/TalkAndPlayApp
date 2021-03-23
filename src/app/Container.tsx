import React from 'react';
import {createStackNavigator} from "react-navigation-stack";
import PostListScreen from "../screens/PostList/PostList";
import PostDetailScreen from "../screens/PostDetail";
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import ProfileScreen from "../screens/Profile";
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingsScreen from "../screens/Settings";
import PostCreateScreen from "../screens/PostCreateScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen";
import PostEditScreen from "../screens/PostEditScreen";


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
                    return <MaterialCommunityIcons name="controller-classic" color={tintColor} size={25}/>;
                }
            }
        },
        Profile: {
            screen: ProfileScreen,
            navigationOptions: {
                tabBarIcon: ({tintColor}) => {
                    return <MaterialCommunityIcons name="account" color={tintColor} size={25}/>;
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
    Settings: {
        screen: SettingsScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    PostCreate: {
        screen: PostCreateScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    ProfileEdit: {
        screen: ProfileEditScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    PostEdit: {
        screen: PostEditScreen,
        navigationOptions: {
            headerShown: false
        }
    }
});

export default createAppContainer(
    createSwitchNavigator(
        {
            App: BottomTabNavigator,
            HomeDetailStack: HomeDetailStack
        },
        {
            initialRouteName: 'App',
        },
    ),
);
