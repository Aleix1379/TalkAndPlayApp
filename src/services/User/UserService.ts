import Api from "../Api";
import {LoginResponse} from "../../types/PostsTypes";
import {UserState} from "../../store/user/types";
import LocalStorage from "../../utils/LocalStorage/LocalStorage";
import {Platform} from "react-native";
import {ImagePickerResponse} from "react-native-image-picker/src/types";
import {RecoveryPasswordResponse} from "../../types/EmailTypes";
import {VerificationResponse} from "../../types/VerificationTypes";

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

    checkPassword(email: string, password: string): Promise<boolean> {
        return this.http.post(`${this.getUrl()}/check-password`, {email, password}).then((res) => res.data)
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

    updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
        let url = `${this.getUrl(userId)}/password`;
        console.log('url: ' + url)
        console.log('currentPassword: ' + currentPassword)
        console.log('newPassword: ' + newPassword)
        return this.http.put(url, {
            currentPassword: currentPassword,
            newPassword: newPassword
        }).then((res) => res.data)
            .catch(err => {
                console.log('user service error updating password')
                console.log(err)
                console.log('---------------------------------------------------------------------------')
            })
    }

    getRecoveryPasswordCode(email: string): Promise<RecoveryPasswordResponse> {
        console.log('URL: ' + this.getUrl() + '/recovery/email')
        return this.http
            .post(this.getUrl() + '/recovery/email', {targetEmail: email})
            .then((res) => res.data)
    }

    verifyPassword(email: string, code: string): Promise<VerificationResponse> {
        return this.http
            .post(this.getUrl() + '/verification', {email, code})
            .then((res) => res.data)
    }

    resetPassword(code: string, email: string, newPassword: string): Promise<VerificationResponse> {
        return this.http
            .put(this.getUrl() + '/reset-password', {code, email, newPassword})
            .then((res) => res.data)
    }

    findUserByEmail(email: string): Promise<UserState[]> {
        return this.http.get(`${this.getUrl()}?email=${email}`).then((res) => res.data)
    }

}

export default UserService
