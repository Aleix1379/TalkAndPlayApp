export interface DialogOption {
    label: string
    backgroundColor?: string
    onPress: () => void
}

export type DialogState = {
    visible: boolean,
    actions: DialogOption[],
    title: string,
    content: string[]
}

export type DialogAction = {
    state: DialogState,
    type: string
}

export type DispatchType = (args: DialogAction) => DialogAction