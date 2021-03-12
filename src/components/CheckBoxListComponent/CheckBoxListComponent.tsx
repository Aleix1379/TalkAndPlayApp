import React, {useEffect, useRef, useState} from 'react'
import {Animated, StyleProp, StyleSheet, View, ViewStyle} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Option, SelectItem} from "../../types/PostsTypes"
import TextInputComponent from "../TextInputComponent"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import CheckBoxComponent from "../CheckBoxComponent"
import {ErrorType} from "../../utils/Validator/types"
import {withTheme} from "react-native-paper"

interface CheckBoxListProperties {
    theme: Theme
    id: string
    label: string
    values: Option[]
    initialValues?: Option[]
    singleMode?: boolean
    error?: ErrorType
    style?: StyleProp<ViewStyle>


    onChange(items: SelectItem[]): void
}

const CheckBoxListComponent: React.FC<CheckBoxListProperties> = ({
                                                                     theme,
                                                                     id,
                                                                     label,
                                                                     values,
                                                                     initialValues,
                                                                     onChange,
                                                                     singleMode = false,
                                                                     error,
                                                                     style
                                                                 }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current
    const [showItemsContent, setShowItemsContent] = useState(false)

    const [err, setErr] = useState<ErrorType>({
        message: '',
        touched: false,
        label: label,
        validations: [
            {
                key: 'REQUIRED',
            }
        ],
    })

    const styles = StyleSheet.create({
        checkboxlist: {
            borderRadius: 4
        },
        header: {},
        icon: {
            position: "absolute",
            top: 4,
            right: 10,
        },
        content: {
            backgroundColor: theme.colors.primary,
            marginHorizontal: 2,
            bottom: 4,
            paddingVertical: 10,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            borderBottomRightRadius: 12,
            borderBottomLeftRadius: 12
        }
    })

    const [items, setItems] = useState<SelectItem[]>([])
    const [showItems, setShowItems] = useState(false)

    const updateItemStatus = (name: string, value: boolean) => {
        const data: SelectItem[] = [...items]

        if (singleMode) {
            data.forEach((it) => (it.value = false))
        }

        const item = data.find((it) => it.name === name)
        //if (singleMode) {
        item!.value = value
        //} else {
        //  item!.value = value
        //}
        if (singleMode) {
            onChange(data.filter((it) => it.name === name && it.value))
        } else {
            onChange(data)
        }
        setItems(data)
        checkError()
    }

    useEffect(() => {
        const data: SelectItem[] = []
        values.forEach((value) => {
            data.push({
                id: value.id,
                name: value.name,
                image: value.image,
                value: !!initialValues?.find((it) => it.name === value.name),
            })
        })

        setItems(data)
    }, [values, initialValues])

    const checkError = () => {
        setErr({...err, touched: true, message: error?.message!})
    }

    const toggleShowItems = () => {
        setShowItems(!showItems)
    }

    useEffect(() => {
        startAnimation()
        setShowItemsContent(showItems)
    }, [showItems])

    const getInputTextValue = (): string =>
        items
            .filter((it) => it.value)
            .map((it) => it.name)
            .join(', ')

    const [rotationAnimation] = useState(new Animated.Value(0))

    const startAnimation = () => {
        Animated.timing(
            fadeAnim,
            {
                toValue: showItems ? 1 : 0,
                useNativeDriver: true,
                duration: 500
            }
        ).start();

        Animated.timing(rotationAnimation, {
            useNativeDriver: true,
            toValue: showItems ? 1 : 0,
            duration: 500,
        }).start()
    }

    const spin = rotationAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '0deg']
    })

    const animatedStyles = {
        rotation: {
            transform: [{rotate: spin}]
        }
    }


    return (
        <View style={{...styles.checkboxlist, ...style as {}}}>

            <View style={styles.header} onTouchEnd={toggleShowItems}>
                <TextInputComponent
                    id={id}
                    label={label}
                    value={getInputTextValue()}
                    multiLine={true}
                    maxLength={1000}
                    error={err}
                    style={{marginTop: 0, paddingRight: 50}}

                />

                <Animated.View style={[styles.icon, animatedStyles.rotation]}>
                    <MaterialCommunityIcons
                        name="chevron-down"
                        color={theme.colors.accent}
                        size={35}
                        style={
                            {
                                transform:
                                    [
                                        showItems ?
                                            {rotateZ: showItems ? "180deg" : "0deg"} :
                                            {rotateZ: showItems ? "0deg" : "180deg"}
                                    ]
                            }
                        }
                    />
                </Animated.View>
            </View>

            {showItemsContent && <Animated.View style={{...styles.content, opacity: fadeAnim}}>
                {
                    items.map(item =>
                        <View key={item.id}>
                            <CheckBoxComponent
                                name={item.name}
                                label={item.name}
                                imageName={item.image}
                                value={item.value}
                                onChange={updateItemStatus}
                            />
                        </View>)
                }
            </Animated.View>}

        </View>
    )
}

export default withTheme(CheckBoxListComponent)
