import * as actionTypes from './actionsTypes'
import {UserAction} from './types'
import {User} from "../../types/PostsTypes"

const initialState: User = {
    id: 0,
    name: '',
    email: '',
    languages: [],
    platforms: [],
    profiles: [],
    seenMessages: [],
    notifications: [],
    postsSubscribed: [],
    avatar: '',
    devices: [],
    followers: [],
    following: []
}

const reducer = (state: User = initialState, action: UserAction) => {
    if (action.type === actionTypes.LOG_IN || action.type === actionTypes.LOG_OUT) {
        return {
            ...action.user,
        }
    }
    return state
}

export default reducer
