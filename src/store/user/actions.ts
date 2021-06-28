import * as actionTypes from './actionsTypes'
import {DispatchType, UserAction} from './types'
import UserService from '../../services/User'
import LocalStorage from "../../utils/LocalStorage/LocalStorage"
import {User} from "../../types/PostsTypes"

const userService = new UserService()

export const login = (user: User, token?: string) => {
    LocalStorage.setUser(user).catch(error => console.log(error))
    if (token) {
        LocalStorage.setAuthToken(token).catch(error => console.log(error))
        userService.setToken(token)
    }

    const action: UserAction = {
        type: actionTypes.LOG_IN,
        user,
    }

    return (dispatch: DispatchType) => {
        dispatch(action)
    }
}

export const logout = () => {
//    LocalStorage.removeAuthToken().catch(error => console.log(error))
    LocalStorage.removeUser().catch(error => console.log(error))
    userService.clearToken()

    const action: UserAction = {
        type: actionTypes.LOG_OUT,
        user: {
            id: -1,
            name: '',
            email: '',
            avatar: {
                id: -1,
                name: ''
            },
            languages: [],
            platforms: [],
            seenMessages: {},
            profiles: []
        },
    }

    return (dispatch: DispatchType) => {
        dispatch(action)
    }
}
