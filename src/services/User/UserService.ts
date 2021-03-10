import Api from "../Api";
import {LoginResponse} from "../../types/PostsTypes";
import {UserState} from "../../store/user/types";
import LocalStorage from "../../utils/LocalStorage/LocalStorage";

class UserService extends Api {
    constructor() {
        super('/users')
    }

    async getProfile(): Promise<UserState> {
        const user: UserState | null = await LocalStorage.getUser()
        if (user) {
            return this.http.get(`${this.getUrl()}/${user.id}`).then((res) => {
                return res.data
            })
        } else {
            return new Promise((resolve, reject) => reject(null))
        }
    }

    login(email: string, password: string): Promise<LoginResponse> {
        this.clearToken()
        return this.http
            .post(`${this.getBaseUrl()}/login`, {email, password})
            .then((res) => res.data)
    }

    updateProfile(id: number, data: UserState): Promise<UserState> {
        return this.http.put(`${this.getUrl()}/${id}`, data)
    }


}

export default UserService
