import * as actionTypes from './actionsTypes'
import {DispatchType, LoadingAction} from './types'

export const setLoading = (visible: boolean) => {
    const action: LoadingAction = {
        type: actionTypes.SET_LOADING,
        state: {visible}
    }

    return (dispatch: DispatchType) => {
        dispatch(action)
    }
}
