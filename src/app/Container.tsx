import React from 'react';
import {createStackNavigator} from "react-navigation-stack";
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
import PasswordEditScreen from "../screens/PasswordEditScreen";
import PicturePreviewScreen from "../screens/PicturePreviewScreen";
import ReportScreen from "../screens/ReportScreen";
import PictureUploadScreen from "../screens/PictureUploadScreen";
import PostListGames from "../screens/PostListGames";
import PostListOnline from "../screens/PostListOnline";
import PostListStreamers from "../screens/PostListStreamers";
import ProfileViewerScreen from "../screens/ProfileViewerScreen";
import ErrorScreen from "../screens/ErrorScreen";
import UserScreen from "../screens/UserScreen";


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
    },
    PasswordEdit: {
        screen: PasswordEditScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    PicturePreview: {
        screen: PicturePreviewScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    Report: {
        screen: ReportScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    PictureUpload: {
        screen: PictureUploadScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    ProfileViewer: {
        screen: ProfileViewerScreen,
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
            HomeDetailStack: HomeDetailStack
        },
        {
            initialRouteName: 'App',
        },
    ),
);
