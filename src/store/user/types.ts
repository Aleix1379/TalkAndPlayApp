import {Account, Option} from "../../types/PostsTypes";

export type UserState = {
  id: number
  name: string
  email: string
  imageVersion: number
  languages: Option[]
  platforms: Option[]
  profiles: Account[]
}
export type UserAction = {
  user: UserState
  type: string
}

export type DispatchType = (args: UserAction) => UserAction
