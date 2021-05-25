import {combineReducers, Reducer} from 'redux'
// Import your state types and reducers here.
import {UserState} from './user/types'
import userReducer from './user/reducer'
import loadingReducer from './loading/reducer'
import topSheetReducer from './topSheet/reducer'
import dialogReducer from './dialog/reducer'
import themeReducer from './theme/reducer'
import {LoadingState} from "./loading/types";
import {TopSheetState} from "./topSheet/types";
import {DialogState} from "./dialog/types";
import {ThemeState} from "./theme/types";

// The top-level state object
export interface ApplicationState {
    user: UserState
    loading: LoadingState
    topSheet: TopSheetState
    dialog: DialogState
    theme: ThemeState
}

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
const reducers: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    user: userReducer,
    loading: loadingReducer,
    topSheet: topSheetReducer,
    dialog: dialogReducer,
    theme: themeReducer
})

export default reducers
