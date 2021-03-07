import React, {useEffect, useState} from 'react'
import ButtonPageComponent from "../ButtonPageComponent"
import {StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
import {withTheme} from "react-native-paper"


export interface PaginationProperties {
    number: number
    totalPages: number | undefined
    onPageChange: (newPage: number) => void
    theme: Theme
}

interface DataPage {
    id: number
    label: number
    isCurrentPage: boolean
}

const PaginationComponent: React.FC<PaginationProperties> = ({
                                                                 number,
                                                                 totalPages,
                                                                 onPageChange
                                                             }) => {

    const styles = StyleSheet.create({
        pagination: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 10,
            marginBottom: 4
        }
    })

    const [pages, setPages] = useState<DataPage[]>([])

    const getPagination = (number: number, totalPages: number) => {
        let values: any[] = []

        for (let i = 0; i < totalPages; i++) {
            values.push({label: i + 1, isCurrentPage: i === number})
        }

        let first: any[] = []
        let mid: any[] = []
        let last: any[] = []
        if (values.length > 5) {
            first.push(values[0])
            if (number > 1 && number + 2 < totalPages) {
                mid.push(values[number - 1])
                mid.push(values[number])
                mid.push(values[number + 1])
            } else if (number === 1) {
                mid.push(values[number])
                mid.push(values[number + 1])
                mid.push(values[number + 2])
            } else if (number + 2 >= totalPages) {
                let index = totalPages - 4
                for (let i = 1; i <= 3; i++) {
                    mid.push(values[index++])
                }
            } else {
                for (let i = 1; i <= 3; i++) {
                    mid.push(values[number + i])
                }
            }

            last.push(values[values.length - 1])
            return first.concat(mid).concat(last)
        }

        return values
    }

    useEffect(() => {
        setPages(getPagination(number, totalPages!))
    }, [])

    useEffect(() => {
        setPages(getPagination(number, totalPages!))
    }, [number])

    return (
        <View style={styles.pagination}>
            {pages.map((page, index) => (
                <ButtonPageComponent
                    key={index}
                    label={page.label}
                    isCurrentPage={page.isCurrentPage}
                    onClick={(page: number) => onPageChange(page - 1)}
                />
            ))}
        </View>
    )

}

export default withTheme(PaginationComponent)
