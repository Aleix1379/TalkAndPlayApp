import * as actionTypes from './actionsTypes'
import {DispatchType, UserAction, UserState} from './types'
import UserService from '../../services/User'
import LocalStorage from "../../utils/LocalStorage/LocalStorage";

const userService = new UserService()

export const login = (user: UserState, token?: string) => {
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
            imageVersion: 0,
            languages: [],
            platforms: [],
            profiles: []
        },
    }

    return (dispatch: DispatchType) => {
        dispatch(action)
    }
}
