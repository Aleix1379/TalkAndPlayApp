export interface Notification {
    id?: number
    title: string
    body: string
    data: { [key: string]: string }
    seen?: boolean
    opened?: boolean
}
