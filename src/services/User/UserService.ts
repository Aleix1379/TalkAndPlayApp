import Api from "../Api";
import {LoginResponse} from "../../types/PostsTypes";
import {UserState} from "../../store/user/types";
import LocalStorage from "../../utils/LocalStorage/LocalStorage";
import {Platform} from "react-native";
import {ImagePickerResponse} from "react-native-image-picker/src/types";

class UserService extends Api {
    constructor() {
        super('/users')
    }

    add<UserState>(user: UserState): Promise<LoginResponse> {
        return this.http.post(this.getUrl(), user).then((res) => {
            return res.data
        })
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

    async fileUpload(image: ImagePickerResponse, name: string): Promise<number> {
        const user: UserState | null = await LocalStorage.getUser()
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
            .post(`${this.getUrl()}/${user?.id}/avatar`, formData, config)
            .then((res) => res.data)
    }

    checkIfUserExists(field: string, value: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            return this.http.get(`${this.getUrl()}?${field}=${value}`).then((res) => {
                resolve(res.data.length === 1)
            })
        })
    }

    delete(userId: number): Promise<boolean> {
        return this.http.delete(`${this.getUrl(userId)}`).then((res) => res.data)
    }


}

export default UserService
