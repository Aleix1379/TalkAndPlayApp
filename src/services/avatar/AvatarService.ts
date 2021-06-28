import Api from "../Api";
import {Avatar, ImageRequest} from "../../types/ImageRequest";

class AvatarService extends Api {
    constructor() {
        super('/avatars')
    }

    async upload(image: ImageRequest): Promise<Avatar> {
        return this.http
            .post(`${this.getUrl()}`, image)
            .then((res) => res.data)
    }

}

export default AvatarService
