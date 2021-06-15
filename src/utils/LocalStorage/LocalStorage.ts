import AsyncStorage from '@react-native-community/async-storage';
import {UserState} from "../../store/user/types";
import {Filter} from "../../types/PostsTypes";

export default class LocalStorage {
    private static keys = {
        AUTH_TOKEN: 'auth-token',
        COMMENTS_PER_PAGE: 'comments-per-page',
        USER: 'user',
        COMMENT_SEEN: 'comment-seen',
        FILTER: 'filter',
        FCM_TOKEN: 'fcm-token',
        THEME: 'theme',
        POST_TAB_INDEX: 'post-tab-index'
    };

    public static setAuthToken = async (token: string) => {
        try {
            await AsyncStorage.setItem(LocalStorage.keys.AUTH_TOKEN, token);
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
    };

    public static removeAuthToken = async () => {
        try {
            await AsyncStorage.removeItem(LocalStorage.keys.AUTH_TOKEN);
        } catch (error) {
            console.log(error.message);
        }
    };

    public static getAuthToken = async (): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(LocalStorage.keys.AUTH_TOKEN);
        } catch (error) {
            console.log('Error get auth token');
            console.log(error.message);
            return null;
        }
    };

    public static setCommentsPerPage = async (commentPerPage: number) => {
        try {
            await AsyncStorage.setItem(LocalStorage.keys.AUTH_TOKEN, `${commentPerPage}`);
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
    };

    public static getCommentsPerPage = async (): Promise<number> => {
        try {
            let value = await AsyncStorage.getItem(LocalStorage.keys.COMMENTS_PER_PAGE);
            if (!value) {
                return 10
            }
            return Number(value)
        } catch (error) {
            console.log('Error get auth token');
            console.log(error.message);
            return -1
        }
    }

    public static setUser = async (user: UserState) => {
        try {
            await AsyncStorage.setItem(LocalStorage.keys.USER, JSON.stringify(user));
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
    }

    public static getUser = async (): Promise<UserState | null> => {
        try {
            let value = await AsyncStorage.getItem(LocalStorage.keys.USER);
            return JSON.parse(value!);
        } catch (error) {
            console.log('Error get auth token');
            console.log(error.message);
            return null;
        }
    };

    public static removeUser = async () => {
        try {
            await AsyncStorage.removeItem(LocalStorage.keys.USER);
        } catch (error) {
            console.log(error.message);
        }
    };

    /*
  {
    1: 23,
    2: 1,
    3: 78
  }
    */

    public static getMessagesSeen = async () => {
        try {
            let value = await AsyncStorage.getItem(LocalStorage.keys.COMMENT_SEEN)
            return JSON.parse(value!)
        } catch (error) {
            console.log('Error get comments seen');
            console.log(error.message)
            return null;
        }
    }

    public static addCommentSeen = async (postId: number, lastCommentId: number | null) => {
        let map
        let current: number | undefined
        try {
            map = await LocalStorage.getMessagesSeen() || {}
            current = map[postId]
            if (lastCommentId && (!current || lastCommentId > current)) {
                map[postId] = lastCommentId
            }
            await AsyncStorage.setItem(LocalStorage.keys.COMMENT_SEEN, JSON.stringify(map))
        } catch (error) {
            console.log(error)
        }
    }

    public static removeCommentsSeen = async () => {
        try {
            await AsyncStorage.removeItem(LocalStorage.keys.COMMENT_SEEN);
        } catch (error) {
            console.log(error.message);
        }
    }

    public static saveFilter = async (filter: Filter) => {
        try {
            await AsyncStorage.setItem(LocalStorage.keys.FILTER, JSON.stringify(filter));
        } catch (error) {
            console.log(error.message);
        }
    }

    public static getFilter = async (): Promise<Filter | null> => {
        let value = await AsyncStorage.getItem(LocalStorage.keys.FILTER)
        if (value) {
            return JSON.parse(value);
        }
        return null
    }

    public static removeFilter = async () => {
        try {
            await AsyncStorage.removeItem(LocalStorage.keys.FILTER);
        } catch (error) {
            console.log(error.message);
        }
    }

    public static getFcmToken = async (): Promise<string | null> => {
        return await AsyncStorage.getItem(LocalStorage.keys.FCM_TOKEN)
    }

    public static setFcmToken = async (token: string) => {
        try {
            await AsyncStorage.setItem(LocalStorage.keys.FCM_TOKEN, token)
        } catch (error) {
            console.log(error.message);
        }
    }

    public static setTheme = async (theme: 'dark' | 'light') => {
        try {
            await AsyncStorage.setItem(LocalStorage.keys.THEME, theme)
        } catch (error) {
            console.log(error.message);
        }
    }

    public static getTheme = async (): Promise<'dark' | 'light'> => {
        const value = await AsyncStorage.getItem(LocalStorage.keys.THEME)
        return value === 'light' ? 'light' : 'dark'
    }

    public static setPostTabIndex = async (index: number) => {
        try {
            await AsyncStorage.setItem(LocalStorage.keys.POST_TAB_INDEX, JSON.stringify(index))
        } catch (error) {
            console.log(error)
        }
    }

    public static getPostTabIndex = async (): Promise<number> => {
        const value = await AsyncStorage.getItem(LocalStorage.keys.POST_TAB_INDEX)
        if (value) {
           return JSON.parse(value)
        }
        return -1
    }

}
