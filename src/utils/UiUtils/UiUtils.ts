import {Theme} from "react-native-paper/lib/typescript/types";
import {DefaultTheme} from "react-native-paper";

class UiUtils {

    public static getTheme = (isDarkTheme: boolean): Theme => {
        if (isDarkTheme) {
            return {
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                    primary: '#212121',
                    text: '#fafafa',
                    background: '#363636',
                    accent: '#075aab',
                    onSurface: '#1976d2',
                    surface: '#0f0f0f',
                    error: '#b71c1c'
                },
            }
        } else {
            return {
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                    primary: '#C0C0C0',
                    accent: '#075aab',
                    onSurface: '#1976d2',
                    surface: '#e9e9e9',
                    error: '#b71c1c'
                },
            }
        }
    }

}

export default UiUtils
