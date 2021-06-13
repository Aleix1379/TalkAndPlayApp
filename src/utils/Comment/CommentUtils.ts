class CommentUtils {
    private static findStartYoutubeUrl(message: string, start: number) {
        let i = start
        while (i > 0) {
            if (message[i] === " " || message[i] === "\n") {
                return i + 1
            }
            i--
        }
        return i
    }

    private static findEndYoutubeUrl(message: string, start: number) {
        let i = start
        let letterNumber = /^[0-9a-zA-Z]+$/
        while (i < message.length) {
            if (message[i] === " " || message[i] === "\n" || (!message[i].match(letterNumber) && !message[i + 1]?.match(letterNumber))) {
                return i
            }
            i++
        }
        return i
    }

    private static getPositionYoutube(message: string, start: number) {
        let i = start
        let longValue = 'youtube.com'
        let shortValue = 'youtu.be'

        while (i < message.length) {
            if (message.substring(i, i + longValue.length) === longValue || message.substring(i, i + shortValue.length) === shortValue) {
                return i
            }
            i++
        }
        return -1
    }

    public static processYoutubeUrl(message: string, initialPosition: number = 0): string {
        let positionYoutube = this.getPositionYoutube(message, initialPosition)

        let startYoutube = -1
        let endYoutube = -1

        if (positionYoutube >= 0) {
            startYoutube = this.findStartYoutubeUrl(message, positionYoutube)
            endYoutube = this.findEndYoutubeUrl(message, positionYoutube)

            let youtubeUrl = message.substring(startYoutube, endYoutube)
            let value = '![yt](' + message.substring(startYoutube, endYoutube) + ')'

            return this.processYoutubeUrl(message.replace(youtubeUrl, value), endYoutube)
        }

        return message
    }

    public static getIdByUrl (url: string): string {
        let start = -1
        let end = -1

        if (url.includes('youtube.com')) {
            start = url.indexOf('watch?v=') + 8
            end = url.indexOf("&", start)
            if (end < 0) {
                end = url.length
            }
            return url.substring(start, end)
        }

        if (url.includes('youtu.be')) {
            start = url.indexOf('youtu.be/') + 9
            end = url.indexOf("&", start)
            if (end < 0) {
                end = url.length
            }
            return url.substring(start, end)
        }

        return '-1'
    }

}

export default CommentUtils
