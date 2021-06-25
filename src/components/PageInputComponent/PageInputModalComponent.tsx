import React from 'react'
import {Dimensions, StyleSheet, View} from "react-native"
import PageInputComponent from "./PageInputComponent"

interface PageInputProperties {
    visible: boolean
    max?: number
    initialValue: number
    onPageSelected: (newPage: number) => void
}

const PageInputModalComponent: React.FC<PageInputProperties> = ({
                                                                    visible,
                                                                    max = 0,
                                                                    initialValue,
                                                                    onPageSelected
                                                                }) => {
    const styles = StyleSheet.create({
        pageInput: {
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10000000,
            height: Dimensions.get('screen').height,
            width: Dimensions.get('screen').width,
            backgroundColor: 'rgba(15,15,15,0.45)',
            justifyContent: "center",
            alignItems: "center"
        }
    })

    return (
        <>
            {
                visible &&
                (
                    <View style={styles.pageInput}>
                        <PageInputComponent
                            initialValue={initialValue + 1}
                            max={max}
                            onPageSelected={onPageSelected}
                        />
                    </View>
                )
            }
        </>
    )
}

export default PageInputModalComponent
