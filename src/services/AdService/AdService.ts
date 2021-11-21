import {Platform} from "react-native";

class AdService {

    private static getUnitAd(androidId: string ,iOSId: string) {
        return Platform.OS === 'ios' ? iOSId : androidId
    }

    public static getPostsListUnitAd() {
        return this.getUnitAd('ca-app-pub-3339437277990541/9618328669', 'ca-app-pub-3339437277990541/9857664440')
    }

    public static getPostDetailUnitAd() {
        return this.getUnitAd('ca-app-pub-3339437277990541/6995180467','ca-app-pub-3339437277990541/1085729304')
    }
}

export default AdService
