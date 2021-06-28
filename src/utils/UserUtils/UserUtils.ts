import {REACT_APP_IMAGES_URL} from "@env"
import {User} from "../../types/PostsTypes"

class UserUtils {

    public static getImageUrl(user: User | null): string {
        if (!user || user.id < 0) {
            return ''
        }

        if (user.avatar.length > 0) {
            return `${REACT_APP_IMAGES_URL}/${user.avatar}`
        }
        return ''
        // return `${user.imageName}`
    }

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
