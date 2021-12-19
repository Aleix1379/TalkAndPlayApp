import React from 'react'
import {createStackNavigator} from "react-navigation-stack"
import PostDetailScreen from "../screens/PostDetail"
import {createAppContainer, createSwitchNavigator} from "react-navigation"
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs"
import ProfileScreen from "../screens/Profile"
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SettingsScreen from "../screens/Settings"
import PostCreateScreen from "../screens/PostCreateScreen"
import ProfileEditScreen from "../screens/ProfileEditScreen"
import PostEditScreen from "../screens/PostEditScreen"
import PasswordEditScreen from "../screens/PasswordEditScreen"
import PicturePreviewScreen from "../screens/PicturePreviewScreen"
import ReportScreen from "../screens/ReportScreen"
import PictureUploadScreen from "../screens/PictureUploadScreen"
import ProfileViewerScreen from "../screens/ProfileViewerScreen"
import ErrorScreen from "../screens/ErrorScreen"
import PostsScreen from "../screens/PostsScreen"
import UserAccountsEditScreen from "../screens/UserAccountsEditScreen"
import FollowingFollowersListScreen from "../screens/FollowingFollowersListScreen"
import NotificationsListScreen from "../screens/NotificationsListScreen"
import BlockedUsersScreen from "../screens/BlockedUsersScreen"
import ProductsGridScreen from "../screens/ProductsGridScreen"
import ProductsScreen from "../screens/ProductsScreen"
import NavigationBottomTabComponent from "../components/NavigationBottomTabComponent"
import NavigationUtils from "../types/NavigationUtils"

const PostsStack = createStackNavigator({
    Home: {
        screen: PostsScreen,
        navigationOptions: {
            headerShown: false,
        },
    },
})

const BottomTabNavigator = createMaterialBottomTabNavigator(
    {
        Posts: {
            screen: PostsStack,
            navigationOptions: {
                tabBarOnPress: ({navigation}) => {
                    NavigationUtils.navigateTo(navigation, 'Posts')
                },
                tabBarIcon: ({tintColor, focused}) => {
                    return <NavigationBottomTabComponent icon="comment-text-multiple" color={tintColor} size={25}
                                                         focused={focused}/>
                }
            }
        },
        Products: {
            screen: ProductsScreen,
            navigationOptions: {
                tabBarOnPress: ({navigation}) => {
                    NavigationUtils.navigateTo(navigation, 'Products')
                },
                tabBarIcon: ({tintColor, focused}) => {
                    return <NavigationBottomTabComponent icon="basket" color={tintColor} size={25} focused={focused}/>
                }
            }
        },
        Profile: {
            screen: ProfileScreen,
            navigationOptions: {
                tabBarOnPress: ({navigation}) => {
                    NavigationUtils.navigateTo(navigation, 'Profile')
                },
                tabBarIcon: ({tintColor, focused}) => {
                    return <NavigationBottomTabComponent icon="account" color={tintColor} size={25} focused={focused}/>
                }
            },
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
    },
    UserAccountsEdit: {
        screen: UserAccountsEditScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    FollowingFollowersList: {
        screen: FollowingFollowersListScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    NotificationsList: {
        screen: NotificationsListScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    BlockedUsers: {
        screen: BlockedUsersScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    ProductsGrid: {
        screen: ProductsGridScreen,
        navigationOptions: {
            headerShown: false
        }
    }
})

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
)
