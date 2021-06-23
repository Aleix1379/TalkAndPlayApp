import Api from "../Api"
import {ImagePickerResponse} from "react-native-image-picker/src/types"
import {Platform} from "react-native"

class PictureService extends Api {
    constructor() {
        super('/images')
    }

    async fileUpload(image: ImagePickerResponse, name: string): Promise<number> {
        const formData = new FormData()
        formData.append('file', {
            ...image,
            name,
            uri: Platform.OS === 'android' ? image.uri : image.uri?.replace('file://', '')
        })
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        }
        return this.http
            .post(`${this.getUrl()}`, formData, config)
            .then((res) => res.data)
    }
}

export default PictureService
