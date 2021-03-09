import {ModalOption} from "../../screens/PostDetail/PostDetail";

export type TopSheetState = {
    visible: boolean
    options: ModalOption[]
    onChange?: () => void
}

export type TopSheetAction = {
    state: TopSheetState
    type: string
}

export type DispatchType = (args: TopSheetAction) => TopSheetAction
