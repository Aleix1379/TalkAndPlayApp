import * as actionTypes from './actionsTypes'
import {UserAction, UserState} from './types'

const initialState: UserState = {
    id: -1,
    name: '',
    email: '',
    imageVersion: 0,
    languages: [],
    platforms: [],
    profiles: [],
    seenMessages: []
}

const reducer = (state: UserState = initialState, action: UserAction) => {
    if (action.type === actionTypes.LOG_IN || action.type === actionTypes.LOG_OUT) {
        return {
            ...action.user,
        }
    }
    return state
}

export default reducer
