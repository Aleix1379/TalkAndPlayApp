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
    onChange?: () => void
}

const TopSheetComponent: React.FC<TopSheetProperties> = ({theme, visible = false, options, onChange}) => {
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
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 100,
            height: visible ? '100%' : 0,
        },
        topSheet: {
            position: "absolute",
            top: 0,
            right: 0,
            shadowColor: theme.colors.background,
            shadowOffset: {
                width: 2.5,
                height: 2.5,
            },
            shadowOpacity: 0.75,
            shadowRadius: 1,
            elevation: 5,
            backgroundColor: theme.colors.background,
            paddingHorizontal: 8

        },
        option: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            marginVertical: 8,
            marginHorizontal: 12,
            paddingVertical: 4
        },
        text: {
            fontSize: 18,
            marginLeft: 32
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
        <View style={styles.container} onTouchEnd={() => onChange && onChange()}>
            <Animated.View style={[styles.topSheet, animatedStyles.upper]}>
                {options.map((option) => (
                    <View key={option.id}>
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
        </View>
    )
}

export default withTheme(TopSheetComponent)
