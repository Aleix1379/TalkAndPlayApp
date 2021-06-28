import React, {useEffect, useState} from 'react'
import {Dimensions, StyleSheet, TextInput, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Text, withTheme} from "react-native-paper"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

interface PageInputProperties {
    theme: Theme
    min?: number
    max: number
    initialValue: number
    onPageSelected: (newPage: number) => void
}

const PageInputComponent: React.FC<PageInputProperties> = ({
                                                               theme,
                                                               min = 1,
                                                               max,
                                                               initialValue,
                                                               onPageSelected
                                                           }) => {
    const styles = StyleSheet.create({
        pageInputContainer: {
            backgroundColor: 'rgba(15,15,15,0.95)',
            borderRadius: 15,
            width: Dimensions.get('screen').width * 0.80,
            alignItems: "center",
        },
        pageInput: {
            width: Dimensions.get('screen').width * 0.80,

            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "space-around",
        },
        input: {
            color: theme.colors.accent,
            textAlign: "center",
            fontSize: 40
        },
        icon: {},
        text: {
            color: '#0F0F0FFF',
            backgroundColor: theme.colors.accent,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 6,
            marginBottom: 10,
        }
    })

    const [pageInterval, setPageInterval] = useState<NodeJS.Timeout>()
    const [value, setValue] = useState(initialValue)
    const intervalTime = 250

    useEffect(() => {
        return () => {
            if (pageInterval) {
                clearInterval(pageInterval)
            }
        }
    }, [])

    const getNextValue = (prevValue: number, type: 'add' | 'subtract'): number => {
        const newValue = type === 'add' ? (prevValue + 1) : (prevValue - 1)
        if (newValue < min || newValue > max) {
            return prevValue
        }
        return newValue
    }

    const onTouchStart = (type: 'add' | 'subtract') => {
        setPageInterval(
            setInterval(() => {
                setValue(prevValue => getNextValue(prevValue, type))
            }, intervalTime)
        )
    }

    const onTouchEnd = () => {
        if (pageInterval) {
            setTimeout(() => {
                clearInterval(pageInterval)
            }, intervalTime)
        }
    }

    const getIconColor = (type: 'add' | 'subtract') => {
        const disabled = 'rgba(45, 45, 45, 0.5)'
        if (type === 'subtract' && value === min) {
            return disabled
        } else if (type === 'add' && value === max) {
            return disabled
        }
        return theme.colors.accent
    }

    return (
        <View style={styles.pageInputContainer}>
            <View style={styles.pageInput}>

                <View
                    onTouchStart={() => onTouchStart('subtract')}
                    onTouchEnd={onTouchEnd}
                >
                    <MaterialCommunityIcons name='minus-box' color={getIconColor('subtract')} size={50}/>
                </View>


                <View>
                    <TextInput
                        style={styles.input}
                        value={value.toString()}
                        keyboardType={'number-pad'}
                        editable={false}
                        maxLength={5}
                    />
                </View>

                <View
                    onTouchStart={() => onTouchStart('add')}
                    onTouchEnd={onTouchEnd}
                >
                    <MaterialCommunityIcons name='plus-box' color={getIconColor('add')} size={50}/>
                </View>

            </View>

            <View onTouchEnd={() => onPageSelected(value)}>
                <Text style={styles.text}>Go!</Text>
            </View>
        </View>
    )
}

export default withTheme(PageInputComponent)
