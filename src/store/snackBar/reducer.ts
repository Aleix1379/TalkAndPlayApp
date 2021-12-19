import * as actionsTypes from './actionsTypes'
import {SnackBarAction, SnackBarState} from "./types"

const initialState: SnackBarState = {
    visible: false,
    color: '#212121',
    content: '',
    time: 1000
}

const reducer = (state: SnackBarState = initialState, action: SnackBarAction) => {
    if (action.type === actionsTypes.OPEN_SNACKBAR || action.type === actionsTypes.CLOSE_SNACKBAR) {
        return {
            ...action.state
        }
    }
    return state
}

export default reducer
