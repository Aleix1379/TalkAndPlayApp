import {Channel} from "../../types/Channel"

class AccountUtil {

    public static getChannel(name?: string): Channel {
        if (name?.toLowerCase() === 'twitch') {
            return {
                color: '#9147fe',
                icon: 'twitch'
            }
        }

        if (name?.toLowerCase() === 'youtube') {
            return {
                color: '#e53935',
                icon: 'youtube'
            }
        }

        if (name?.toLowerCase() === 'facebook') {
            return {
                color: '#4267B2',
                icon: 'facebook'
            }
        }

        if (name?.toLowerCase() === 'xbox') {
            return {
                color: '#107C10',
                icon: 'microsoft-xbox'
            }
        }

        if (name?.toLowerCase() === 'playstation') {
            return {
                color: '#4382f1',
                icon: 'sony-playstation'
            }
        }

        if (name?.toLowerCase() === 'nintendo') {
            return {
                color: '#E60012',
                icon: 'nintendo-switch'
            }
        }

        if (name?.toLowerCase() === 'steam') {
            return {
                color: '#538fbf',
                icon: 'steam'
            }
        }

        if (name?.toLowerCase() === 'discord') {
            return {
                color: '#7289DA',
                icon: 'discord'
            }
        }

        return {
            color: '#b3b3b3',
            icon: 'account-check'
        }
    }

}

export default AccountUtil
