import {PostUser, User} from "../../types/PostsTypes"
import {REACT_APP_IMAGES_URL} from "@env"

class UserUtils {

    public static getImageUrl(user: User | PostUser | null): string {
        if (!user || user.id <= 0) {
            return ''
        }

        return `${REACT_APP_IMAGES_URL}/${user.id}_${user.imageVersion}.png`
    }

    public static getImageByName(name: string): string {
        return `${REACT_APP_IMAGES_URL}/${name}`
    }
}

export default UserUtils
