import {REACT_APP_IMAGES_URL} from "@env"

class UserUtils {

    public static getImageUserByName(id: number, imageName: number): string {
        if (imageName < 0) {
            return ''
        }
        return `${REACT_APP_IMAGES_URL}/${id}_${imageName}.png`
    }

    public static getImageByName(name: string): string {
        return `${REACT_APP_IMAGES_URL}/${name}`
    }
}

export default UserUtils
