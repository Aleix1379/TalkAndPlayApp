export type SnackBarState = {
    visible: boolean
    content: string
    color?: string
    time?: number
}

export type SnackBarAction = {
    state: SnackBarState
    type: string
}

export type DispatchType = (args: SnackBarAction) => SnackBarAction
