export interface Report {
    itemId: number,
    type: 'post' | 'comment' | 'user'
    text: string
}
