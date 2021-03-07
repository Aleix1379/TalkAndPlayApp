import {Comment, CommentResponse, Filter, PostInfo, PostsResponse} from "../../types/PostsTypes";
import Api from "../Api";

class PostsService extends Api {
    constructor() {
        super('/posts')
    }

    async add(post: PostInfo, comment: Comment): Promise<PostInfo> {
        const response = await this.http.post(this.getUrl(), post)
        await this.addComment(response.data.id, comment)
        return response.data
    }

    get(page: number = 0, filter?: Filter): Promise<PostsResponse> {
        let title = '';
        let game = '';
        let platforms: number[] = [];
        let language: number[] = [];
        if (filter) {
            title = filter.title;
            game = filter.game;
            platforms = filter.platforms.map((platform) => platform.id);
            language = filter.languages.map((language) => language.id);
        }
        console.log('url get')
        console.log(`${this.getUrl()}?page=${page}&title=${title}&game=${game}&platforms=${platforms}&languages=${language}`)
        return this.http
            .get(
                `${this.getUrl()}?page=${page}&title=${title}&game=${game}&platforms=${platforms}&languages=${language}`
            )
            .then((res) => {
                return res.data;
            })
    }

    getPostById(id: number): Promise<PostInfo> {
        return this.http.get(this.getUrl(id)).then((res) => res.data)
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
}

export default PostsService;
