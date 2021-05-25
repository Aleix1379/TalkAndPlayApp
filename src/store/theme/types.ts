export type ThemeState = {
    isDarkTheme: boolean
}

export type ThemeAction = {
    state: ThemeState
    type: string
}

export type DispatchType = (args: ThemeAction) => ThemeAction
