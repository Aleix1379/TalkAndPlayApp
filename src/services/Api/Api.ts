import axios from "axios"
import LocalStorage from "../../utils/LocalStorage/LocalStorage"
import {REACT_APP_BASE_URL_API} from "@env"

abstract class Api {
    protected readonly baseURL = REACT_APP_BASE_URL_API
    protected readonly http = axios
    protected path: string = ''

    protected constructor(path: string) {
        this.init(path).catch(error => console.log(error))
    }

    private async init(path: string): Promise<void> {
        this.path = path
        this.http.defaults.headers.common['Authorization'] = await LocalStorage.getAuthToken()
        this.http.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                // whatever you want to do with the error
                const statusCode = error.response ? error.response.status : null
                if (statusCode === 403) {
                    console.log('statusCode === 403...........................................')
                    LocalStorage.removeAuthToken()

                    //console.log("this.http.defaults.headers.common['Authorization']")
                    //console.log(this.http.defaults.headers.common['Authorization'])

                    //console.log("this.http.defaults.headers.common['Access-Control-Allow-Origin']")
                    //console.log(this.http.defaults.headers.common['Access-Control-Allow-Origin'])
                    // LocalStorage.setUserDisConnected()
                    // LocalStorage.removeUserId()
                    // window.document.location.reload()
                }

                throw error
            }
        )
    }

    protected getBaseUrl(): string {
        return this.baseURL!
    }

    protected getUrl(id?: number): string {
        if (id) {
            return `${this.baseURL}${this.path}/${id}`
        }
        return `${this.baseURL}${this.path}`
    }

    setToken(token: string) {
        this.http.defaults.headers.common['Authorization'] = token
    }

    clearToken(): void {
        delete this.http.defaults.headers.common['Authorization']
        LocalStorage.removeAuthToken().catch(error => console.log(error))
    }
}

export default Api
