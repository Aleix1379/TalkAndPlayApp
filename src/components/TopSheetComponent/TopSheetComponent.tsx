import React, {useEffect, useState} from 'react';
import {Animated, StyleSheet, View} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {Text, withTheme} from "react-native-paper";
import {ModalOption} from "../../screens/PostDetail/PostDetail";
import {Theme} from "react-native-paper/lib/typescript/types";

interface TopSheetProperties {
    theme: Theme
    visible: boolean
    options: ModalOption[]
}

const TopSheetComponent: React.FC<TopSheetProperties> = ({theme, visible = false, options}) => {
    const optionModalHeight = 40 + 2 * 8
    const getModalHeight = () => optionModalHeight * options.length

    const [upperAnimation] = useState(new Animated.Value(0))

    const startAnimation = () => {
        Animated.timing(upperAnimation, {
            useNativeDriver: true,
            toValue: visible ? 0 : getModalHeight() + 60,
            duration: 300
        }).start()
    }

    const animatedStyles = {
        upper: {
            transform: [
                {
                    translateY: upperAnimation
                }
            ]
        }
    }


    const styles = StyleSheet.create({
        topSheet: {
            position: "absolute",
            top: getModalHeight() * -1,
            right: 5,
            width: 115,
            borderRadius: 12,
            backgroundColor: theme.colors.surface,
            shadowColor: theme.colors.background,
            shadowOffset: {
                width: 2.5,
                height: 2.5,
            },
            shadowOpacity: 0.75,
            shadowRadius: 1,
            elevation: 5,

        },
        option: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 8,
            marginHorizontal: 12,
            paddingVertical: 4,
            backgroundColor: theme.colors.surface
        },
        text: {
            fontSize: 18,
        },
        separator: {
            height: 1,
            width: '90%',
            marginLeft: '5%',
            backgroundColor: theme.colors.text
        }
    });

    useEffect(() => {
        startAnimation()
    }, [visible])

    return (
        <Animated.View style={[styles.topSheet, animatedStyles.upper]}>
            {options.map((option, index) => (
                <View key={option.id}>
                    {index > 0 && <View style={styles.separator}/>}
                    <View
                        // @ts-ignore
                        style={styles.option}
                        onTouchEnd={() => option.action()}>
                        <MaterialCommunityIcons name={option.icon} color={theme.colors.accent} size={25}/>
                        <Text style={styles.text}>{option.title}</Text>
                    </View>
                </View>
            ))}
        </Animated.View>
    )
}

export default withTheme(TopSheetComponent)
