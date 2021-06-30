import {ImageResponse} from "./ImageRequest";

export type User = {
    id: number
    name: string
    email: string
    avatar: string
    languages: Option[]
    platforms: Option[]
    profiles: Account[]
    seenMessages: { [id: number]: number }
}

export enum PostType {
    GENERAL = "GENERAL",
    GAMES = "GAMES",
    ONLINE = "ONLINE",
    STREAMERS = "STREAMERS",
    SETUP = "SETUP",
    HARDWARE = "HARDWARE"
}

export interface PostInfo {
    id: number
    title: string
    game: string
    language: Option
    platforms: Option[]
    user: User | null
    lastUpdate: any
    postType: PostType
    channels?: Channel[]
    lastAuthor: User | null
}

export interface UserPost {
    id: number
    name: string
    imageName: string
}

export interface PostRow {
    post: PostInfo
    user: UserPost
    lastAuthor: string
}

export interface PostRenderItem {
    item: PostRow
    index: number
}

export interface Comment {
    id: number | null
    text: string
    lastUpdate?: any
    author?: User
    reply?: Comment
    images: ImageResponse[]
}

export interface SelectItem {
    id: number
    name: string
    value: boolean
    image?: string
}

export interface PostWithAuthor {
    post: PostInfo
    authorId: number
}

export interface Filter {
    title: string
    game: string
    languages: Option[]
    platforms: Option[]
    channels: Channel[]
    user: string
}

export interface Option {
    id: number
    name: string
    image?: string
}

export interface Account {
    id: number,
    name: string
    value: string
}

export interface Channel {
    id: number
    name: string
    image: string
}

export const availablePlatforms = [
    {id: 1, name: 'PC', image: 'pc'},
    {id: 2, name: 'PS 5', image: 'ps4'},
    {id: 3, name: 'Xbox Series', image: 'xbox'},
    {id: 4, name: 'PS 4', image: 'ps4'},
    {id: 5, name: 'Xbox One', image: 'xbox'},
    {id: 6, name: 'Nintendo Switch', image: 'nintendo'},
    {id: 7, name: 'Android', image: 'android'},
    {id: 8, name: 'iOS', image: 'iphone'},
    {id: 9, name: 'PS 3', image: 'ps4'},
    {id: 10, name: 'Xbox 360', image: 'xbox'},
    {id: 11, name: 'Other', image: 'gamepad'},
]

export const availableChannels: Channel[] = [
    {id: 1, name: 'Twitch', image: 'twitch'},
    {id: 2, name: 'Youtube', image: 'youtube'},
    {id: 3, name: 'Facebook Gaming', image: 'facebook'},
]

export interface LoginResponse {
    token: string
    user: User
    message: string
}

export interface Sort {
    sorted: boolean
    unsorted: boolean
    empty: boolean
}

export interface Pageable {
    sort: Sort
    offset: number
    pageNumber: number
    pageSize: number
    paged: boolean
    unpaged: boolean
}

export interface PostsResponse {
    content: PostRow[]
    pageable: Pageable
    totalPages: number
    totalElements: number
    last: boolean
    size: number
    number: number
    sort: Sort
    numberOfElements: number
    first: boolean
    empty: boolean
    unreadComments?: number
    totalComments?: number
}

export interface CommentResponse {
    content: Comment[]
    pageable: Pageable
    totalPages: number
    totalElements: number
    last: boolean
    size: number
    number: number
    sort: Sort
    numberOfElements: number
    first: boolean
    empty: boolean
}
