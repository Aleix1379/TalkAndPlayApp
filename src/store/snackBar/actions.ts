import * as actionsTypes from './actionsTypes'
import {DispatchType, SnackBarAction} from "./types"

export const openSnackBar = (content: string, color?: string, time?: number) => {
    const action: SnackBarAction = {
        type: actionsTypes.OPEN_SNACKBAR,
        state: {
            visible: true,
            content,
            color,
            time
        }
    }

    return (dispatch: DispatchType) => {
        dispatch(action)
    }
}

export const closeSnackBar = () => {
    const action: SnackBarAction = {
        type: actionsTypes.CLOSE_SNACKBAR,
        state: {
            visible: false,
            content: '',
            color: '#212121'
        }
    }

    return (dispatch: DispatchType) => {
        dispatch(action)
    }
}
