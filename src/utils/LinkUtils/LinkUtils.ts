import {Linking} from "react-native";

class LinkUtils {

    public static open(url: string) {
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

}

export default LinkUtils
