import React, {useEffect, useState} from 'react';
import {Animated, StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {Text, withTheme} from "react-native-paper";
import {ModalOption} from "../../screens/PostDetail/PostDetail";
import {Theme} from "react-native-paper/lib/typescript/types";

interface TopSheetProperties {
    theme: Theme
    visible: boolean
    options: ModalOption[]
    onChange?: () => void
    top?: number
    style?: StyleProp<ViewStyle>
}

const TopSheetComponent: React.FC<TopSheetProperties> = ({
                                                             theme,
                                                             visible = false,
                                                             options,
                                                             onChange,
                                                             top = 0,
                                                             style
                                                         }) => {
    const [upperAnimation] = useState(new Animated.Value(0))

    const startAnimation = () => {
        Animated.timing(upperAnimation, {
            useNativeDriver: true,
            toValue: visible ? 1 : 0,
            duration: 300
        }).start()
    }

    const animatedStyles = {
        upper: {
            transform: [
                {
                    scale: upperAnimation
                }
            ]
        }
    }


    const styles = StyleSheet.create({
        container: {
            position: "absolute",
            top: top,
            left: 0,
            width: '100%',
            zIndex: 99999999,
            height: visible ? '100%' : 0
        },
        topSheet: {
            position: "absolute",
            top: 4,
            right: 6,
            shadowColor: theme.colors.surface,
            shadowOffset: {
                width: 5,
                height: 5,
            },
            shadowOpacity: 0.95,
            shadowRadius: 1,
            elevation: 10,
            backgroundColor: theme.colors.background,
            paddingHorizontal: 8

        },
        option: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 8,
            marginHorizontal: 6,
            paddingVertical: 4
        },
        text: {
            fontSize: 18,
            marginLeft: 32
        }
    });

    useEffect(() => {
        startAnimation()
    }, [visible])

    return (
        <View style={[styles.container, style]} onTouchEnd={() => onChange && onChange()}>
            <Animated.View style={[styles.topSheet, animatedStyles.upper]}>
                {options.map((option) => (
                    <View key={option.id} style={{backgroundColor: 'rgba(0,0,0,0)'}} onTouchEnd={() => option.action()}>
                        <View style={styles.option}>
                            <MaterialCommunityIcons name={option.icon} color={theme.colors.text} size={25}/>
                            <Text style={styles.text}>{option.title}</Text>
                        </View>
                    </View>
                ))}
            </Animated.View>
        </View>
    )
}

export default withTheme(TopSheetComponent)
