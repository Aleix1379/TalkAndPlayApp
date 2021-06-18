import * as actionTypes from './actionsTypes'
import {TopSheetAction, TopSheetState} from "./types";

const initialState: TopSheetState = {
    visible: false,
    top: 0,
    options: []
}

const reducer = (state: TopSheetState = initialState, action: TopSheetAction) => {
    if (action.type === actionTypes.OPEN_TOP_SHEET || action.type === actionTypes.CLOSE_TOP_SHEET) {
        return {
            ...action.state
        }
    }
    return state
}

export default reducer
