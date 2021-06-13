import * as actionTypes from './actionsTypes'
import {ModalOption} from "../../screens/PostDetail/PostDetail";
import {DispatchType, TopSheetAction} from "./types";

export const openModal = (options: ModalOption[], top: number, onChange?: () => void) => {
    const action: TopSheetAction = {
        type: actionTypes.OPEN_TOP_SHEET,
        state: {
            visible: true,
            options,
            onChange,
            top
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
            options: [],
            top: 0
        }
    }

    return (dispatch: DispatchType) => {
        dispatch(action)
    }
}
