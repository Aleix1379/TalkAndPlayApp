import {NavigationTabProp} from "react-navigation-material-bottom-tabs/lib/typescript/src/types";
import {DeviceEventEmitter} from "react-native";

class NavigationUtils  {

    public static navigateTo (navigation: NavigationTabProp, to: string) {
        navigation.navigate(to)
        DeviceEventEmitter.emit('tabBarOnPress', {name: to})
    }

}

export default NavigationUtils
