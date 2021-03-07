import moment from 'moment'

class Time {
    public static diff = (time: number) => {
        time /= 1000
        const date = moment.unix(time)

        const ms = moment().diff(date)

        const day = Math.floor(ms / (24 * 60 * 60 * 1000))
        const daysms = ms % (24 * 60 * 60 * 1000)
        const hours = Math.floor(daysms / (60 * 60 * 1000))
        const hoursms = ms % (60 * 60 * 1000)
        const minutes = Math.floor(hoursms / (60 * 1000))

        if (day < 1) {
            if (hours === 0 && minutes < 1) {
                return 'now'
            } else {
                const today = moment().startOf('day')
                if (date < today) {
                    return `Yesterday at ${date.format('HH:mm')}`
                } else {
                    return date.format('HH:mm')
                }
            }
        } else if (day === 1) {
            return `Yesterday at ${date.format('HH:mm')}`
        } else if (day < 365) {
            return `${date.format('DD MMM')} at ${date.format('HH:mm')}`
        } else {
            return `${date.format('DD MMM YYYY')} at ${date.format('HH:mm')}`
        }
    }
}

export default Time
