import {GestureResponderEvent, Linking} from "react-native"

export interface Position {
    x: number
    y: number
}

class LinkUtils {

    public static open(url: string, position?: Position, event?: GestureResponderEvent) {
        if (!url) return

        if (!!position && !!event && !this.canOpen(position, event)) return

        if (url.startsWith('https://rogueenergy.com')) {
            url = this.buildUrl(url, 'rfsn=6281106.7d599ee&utm_source=refersion&utm_medium=affiliate&utm_campaign=6281106.7d599ee')
        } else if (url.startsWith('https://www.instant-gaming.com')) {
            url = this.buildUrl(url, 'igr=TalkAndPlay')
        } else {
            console.warn('open link without affiliate code...')
        }
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err))
    }

    private static buildUrl(url: string, affiliateCode: string): string {
        if (url.endsWith("/")) {
            url = url.slice(0, -1)
        }
        if (url.includes("?")) {
            return `${url}&${affiliateCode}`
        }
        return `${url}?${affiliateCode}`
    }

    private static canOpen(position: Position, event: GestureResponderEvent): boolean {
        return position.x === event.nativeEvent.locationX &&
            position.y === event.nativeEvent.locationY
    }

}

export default LinkUtils
