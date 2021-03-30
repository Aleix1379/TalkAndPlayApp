import * as actionTypes from './actionsTypes'
import {DialogAction, DialogState} from "./types"

const initialState: DialogState = {
    visible: false,
    title: '',
    content: [],
    actions: []
}

const reducer = (state: DialogState = initialState, action: DialogAction) => {
    if (action.type === actionTypes.OPEN_DIALOG || action.type === actionTypes.CLOSE_DIALOG) {
        return {
            ...action.state
        }
    }
    return state
}

export default reducer