import * as actionTypes from './actionsTypes'
import {LoadingAction, LoadingState} from "./types";

const initialState: LoadingState = {
    visible: false
}

const reducer = (state: LoadingState = initialState, action: LoadingAction) => {
    if (action.type === actionTypes.SET_LOADING) {
        return {
            ...action.state
        }
    }
    return state
}

export default reducer
