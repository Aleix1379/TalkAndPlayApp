import * as actionTypes from './actionsTypes'
import {DispatchType, ThemeAction} from './types'

export const setTheme = (theme: 'dark' | 'light') => {
    const action: ThemeAction = {
        type: actionTypes.SET_THEME,
        state: {
            isDarkTheme: theme === 'dark'
        }
    }

    return (dispatch: DispatchType) => {
        dispatch(action)
    }
}
