import {REACT_APP_IMAGES_URL} from "@env"
import {User} from "../../types/PostsTypes"

class UserUtils {

    public static getImageUrl(user: User | null): string {
        if (!user || user.id <= 0) {
            return ''
        }

        if (user.imageName >= 0) {
            return `${REACT_APP_IMAGES_URL}/${user.id}_${user.imageName}.png`
        }
        return `${user.imageName}`
    }

    public static getImageByName(name: string): string {
        return `${REACT_APP_IMAGES_URL}/${name}`
    }
}

export default UserUtils
