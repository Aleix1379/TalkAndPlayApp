import * as actionTypes from './actionsTypes'
import {DialogOption} from './types'
import {DispatchType, DialogAction} from "./types"

export const openDialog = (title: string, content: string[], actions: DialogOption[]) => {
    const action: DialogAction = {
        type: actionTypes.OPEN_DIALOG,
        state: {
            visible: true,
            title,
            content,
            actions
        }
    }

    return (dispatch: DispatchType) => {
        dispatch(action)
    }
}

export const closeDialog = () => {
    const action: DialogAction = {
        type: actionTypes.CLOSE_DIALOG,
        state: {
            visible: false,
            title: '',
            content: [],
            actions: []
        }
    }

    return (dispatch: DispatchType) => {
        dispatch(action)
    }
}

