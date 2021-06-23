import {User} from "../../types/PostsTypes"

export type UserAction = {
    user: User
    type: string
}

export type DispatchType = (args: UserAction) => UserAction
