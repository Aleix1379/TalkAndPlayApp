import * as actionTypes from './actionsTypes'
import {ThemeAction, ThemeState} from "./types"

const initialState: ThemeState = {
    isDarkTheme: true
}

const reducer = (state: ThemeState = initialState, action: ThemeAction) => {
    if (action.type === actionTypes.SET_THEME) {
        return {
            ...action.state
        }
    }
    return state
}

export default reducer
