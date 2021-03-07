export type LoadingState = {
    visible: boolean
}

export type LoadingAction = {
    state: LoadingState
    type: string
}

export type DispatchType = (args: LoadingAction) => LoadingAction

