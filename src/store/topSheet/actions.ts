import * as actionTypes from './actionsTypes'
import {ModalOption} from "../../screens/PostDetail/PostDetail";
import {DispatchType, TopSheetAction} from "./types";

export const openModal = (options: ModalOption[], onChange?: () => void) => {
    const action: TopSheetAction = {
        type: actionTypes.OPEN_TOP_SHEET,
        state: {
            visible: true,
            options,
            onChange
        }
    }

    return (dispatch: DispatchType) => {
        dispatch(action)
    }
}

export const closeModal = () => {
    const action: TopSheetAction = {
        type: actionTypes.CLOSE_TOP_SHEET,
        state: {
            visible: false,
            options: []
        }
    }

    return (dispatch: DispatchType) => {
        dispatch(action)
    }
}