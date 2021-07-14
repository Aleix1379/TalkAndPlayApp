import Api from "../Api"
import {LoginResponse, User} from "../../types/PostsTypes"
import LocalStorage from "../../utils/LocalStorage/LocalStorage"
import {RecoveryPasswordResponse} from "../../types/EmailTypes"
import {VerificationResponse} from "../../types/VerificationTypes"
import {FollowCounter} from "../../types/FollowCounter"
import {Device} from "../../types/Device"
import {Notification} from "../../types/Notification";

class UserService extends Api {
    constructor() {
        super('/users')
    }

    add<User>(user: User): Promise<LoginResponse> {
        return this.http.post(this.getUrl(), user).then((res) => {
            return res.data
        })
    }

    async getProfile(): Promise<User> {
        const user: User | null = await LocalStorage.getUser()
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
            .catch((error) => {
                throw error.response.data
            })
    }

    checkPassword(email: string, password: string): Promise<boolean> {
        return this.http.post(`${this.getUrl()}/check-password`, {email, password}).then((res) => res.data)
    }

    updateProfile(id: number, data: User): Promise<User> {
        return this.http.put(`${this.getUrl()}/${id}`, data).then((res) => res.data)
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
        let url = `${this.getUrl(userId)}/password`
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

    findUserByEmail(email: string): Promise<User> {
        return this.http.get(`${this.getUrl()}?email=${email}`).then((res) => res.data[0])
    }

    getCommentsUnseen(userId: number, values: any): Promise<any> {
        return this.http.get(`${this.getUrl(userId)}/comments/unseen`, {
            params: {
                data: JSON.stringify(values)
            }
        }).then((res) => res.data)
    }

    updateCommentsUnseen(userId: number, data: any): Promise<User> {
        return this.http.put(`${this.getUrl(userId)}/comments/unseen`, data)
            .then((res) => res.data)
    }

    addFollowing(userId: number, followingId: number): Promise<boolean> {
        return this.http.post(`${this.getUrl(userId)}/following/${followingId}`)
            .then((res) => res.data)
    }

    deleteFollowing(userId: number, followerId: number): Promise<boolean> {
        return this.http.delete(`${this.getUrl(userId)}/following/${followerId}`)
            .then((res) => res.data)
    }

    getFollowCounter(userId: number): Promise<FollowCounter> {
        return this.http.get(`${this.getUrl(userId)}/followCounter`)
            .then((res) => res.data)
    }

    getFollowing(userId: number): Promise<User[]> {
        return this.http.get(`${this.getUrl(userId)}/following`)
            .then((res) => res.data)
    }

    getFollowers(userId: number): Promise<User[]> {
        return this.http.get(`${this.getUrl(userId)}/followers`)
            .then((res) => res.data)
    }

    isFollowing(userId: number, followingId: number): Promise<boolean> {
        return this.http.get(`${this.getUrl(userId)}/following/${followingId}`)
            .then((res) => res.data)
    }

    isFollower(userId: number, followerId: number): Promise<boolean> {
        return this.http.get(`${this.getUrl(userId)}/followers/${followerId}`)
            .then((res) => res.data)
    }

    registerDevice(userId: number, device: Device): Promise<boolean> {
        return this.http.post(`${this.getUrl(userId)}/devices`, device)
            .then((res) => res.data)
    }

    addPostSubscription(userId: number, postId: number): Promise<number[]> {
        return this.http.post(`${this.getUrl(userId)}/subscriptions/${postId}`)
            .then((res) => res.data)
    }

    deleteSubscription(userId: number, postId: number): Promise<number[]> {
        return this.http.delete(`${this.getUrl(userId)}/subscriptions/${postId}`)
            .then((res) => res.data)
    }

    getNotifications(userId: number): Promise<Notification []> {
        return this.http.get(`${this.getUrl(userId)}/notifications`)
            .then((res) => res.data)
    }

    updateNotifications(userId: number, notifications: Notification[]): Promise<boolean> {
        return this.http.put(`${this.getUrl(userId)}/notifications`, notifications)
            .then((res) => res.data)
    }

    deleteNotification(userId: number, notificationId: number): Promise<boolean> {
        return this.http.delete(`${this.getUrl(userId)}/notifications/${notificationId}`)
            .then((res) => res.data)
    }

}

export default UserService
