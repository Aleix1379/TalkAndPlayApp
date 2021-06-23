import {
    Comment,
    CommentResponse,
    Filter,
    PostInfo,
    PostsResponse,
    PostType,
    PostWithAuthor
} from "../../types/PostsTypes"
import Api from "../Api"

class PostsService extends Api {
    constructor() {
        super('/posts')
    }

    async add(post: PostInfo, comment: Comment): Promise<PostInfo> {
        const response = await this.http.post(this.getUrl(), post)
        await this.addComment(response.data.id, comment)
        return response.data
    }

    get(page: number = 0, postType: PostType, filter?: Filter): Promise<PostsResponse> {
        let title = ''
        let game = ''
        let platforms: number[] = []
        let language: number[] = []
        let userName = ''
        let channels: number[] = []

        if (filter) {
            title = filter.title
            game = filter.game
            platforms = filter.platforms.map((platform) => platform.id)
            language = filter.languages.map((language) => language.id)
            userName = filter.user
            channels = filter.channels.map((channel) => channel.id)
        }

        return this.http
            .get(
                `${this.getUrl()}?page=${page}&title=${title}&game=${game}&platforms=${platforms}&languages=${language}&postType=${postType}&userName=${userName}&channels=${channels}`
            )
            .then((res) => {
                let result = {...res.data}
                result.content = res.data.content.map((item: any) => ({
                    post: item[0],
                    user: {
                        id: item[1],
                        name: item[2],
                        imageName: item[3]
                    },
                    lastAuthor: item[4]
                }))
                return result
            })
    }

    getPostById(id: number): Promise<PostWithAuthor> {
        return this.http.get(this.getUrl(id)).then((res) => {
            const result: PostWithAuthor = {
                post: res.data[0],
                authorId: res.data[1]
            }
            return result
        })
    }

    getCommentsByPost(
        postId: number,
        page: number = 0,
        size: number = 10
    ): Promise<CommentResponse> {
        return this.http
            .get(`${this.getUrl(postId)}/comments?page=${page}&size=${size}`)
            .then((res) => res.data)
    }

    addComment(postId: number, comment: Comment): Promise<Comment> {
        return this.http
            .post(`${this.getUrl(postId)}/comments`, comment)
            .then((res) => res.data)
    }

    getNumberOfCommentsByPost(ids: number[]): Promise<number> {
        return this.http
            .get(`${this.getUrl()}/comments?ids=${ids}`)
            .then((res) => res.data)
    }

    delete(postId: number): Promise<boolean> {
        return this.http.delete(this.getUrl(postId))
    }

    getPageFirstUnseenComment(postId: number, commentId: number, itemsPerPage: number = 10): Promise<number> {
        return this.http.get(`${this.getUrl(postId)}/firstUnseen/${commentId}?itemsPerPage=${itemsPerPage}`).then((res) => res.data)
    }

    update(post: PostInfo): Promise<Comment> {
        return this.http.put(this.getUrl(post.id), post)
    }

    deleteComment(postId: number, commentId: number): Promise<number> {
        return this.http.delete(`${this.getUrl(postId)}/comments/${commentId}`)
    }

    editComment(postId: number, comment: Comment): Promise<Comment> {
        return this.http.put(`${this.getUrl(postId)}/comments/${comment.id}`, comment)
    }
}

export default PostsService
