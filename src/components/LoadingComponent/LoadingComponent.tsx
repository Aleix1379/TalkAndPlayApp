import React from 'react';
import {Dimensions, StyleSheet, View} from "react-native";
import {Theme} from "react-native-paper/lib/typescript/types";
import FastImage from "react-native-fast-image";

interface LoadingProperties {
    theme: Theme
    visible: boolean
}

const LoadingComponent: React.FC<LoadingProperties> = ({theme, visible}) => {
    const styles = StyleSheet.create({
        loading: {
            height: Dimensions.get('screen').height,
            width: Dimensions.get('screen').width,
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: visible ? 10000 : 0,
            backgroundColor: 'rgba(33,33,33,0.666)'
        }
    });

    return (
        <View style={styles.loading}>
            {visible && <FastImage
                style={{width: 200, height: 200, alignSelf: "center"}}
                source={require("../../assets/images/loading.gif")}
            />}
        </View>
    )
}

export default LoadingComponent
