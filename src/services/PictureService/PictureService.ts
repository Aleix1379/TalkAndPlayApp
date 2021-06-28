import Api from "../Api"
import {ImageRequest, ImageResponse} from "../../types/ImageRequest";

class PictureService extends Api {
    constructor() {
        super('/images')
    }

    async fileUpload(items: ImageRequest[]): Promise<ImageResponse[]> {
        return this.http
            .post(`${this.getUrl()}`, items)
            .then((res) => res.data)
    }
}

export default PictureService
