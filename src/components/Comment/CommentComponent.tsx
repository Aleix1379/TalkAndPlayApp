import React from 'react'
import {Comment} from "../../types/PostsTypes"
import {Image, StyleProp, StyleSheet, TextStyle, View} from "react-native"
import {Text, withTheme} from 'react-native-paper'
import UserUtils from "../../utils/UserUtils"
import {Theme} from "react-native-paper/lib/typescript/types"
import Time from "../../utils/Time"
// @ts-ignore
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import RoundButtonComponent from "../RoundButtonComponent";
// @ts-ignore
import InView from "react-native-component-inview";

interface CommentProperties {
    comment: Comment
    theme: Theme
    checkVisible: () => void
}

interface Item {
    type?: '*' | '_' | '~'
    value: string
    start: number
    end: number
}

const CommentComponent: React.FC<CommentProperties> = ({comment, theme, checkVisible}) => {
    const imageSize = 50
    const styles = StyleSheet.create({
        comment: {
            backgroundColor: theme.colors.primary,
            paddingTop: 12,
            paddingBottom: 8,
            paddingHorizontal: 12,
            borderRadius: 4,
            shadowColor: theme.colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        details: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12
        },
        date: {
            marginLeft: "auto"
        },
        image: {
            height: imageSize,
            width: imageSize,
            borderRadius: imageSize / 2,
            marginRight: 16,
            borderWidth: 1,
            borderColor: theme.colors.background
        },
        options: {}
    })

    const findSpecialCharacters = (specialCharacters: Item[], message: string, char: '*' | '_' | '~') => {
        for (let i = 0; i < message.length; i++) {
            if (message[i] === char) {
                let index = message.indexOf(char, i + 1)
                if (index >= 0) {
                    specialCharacters.push({
                        type: char,
                        value: message.substring(i + 1, index),
                        start: i + 1,
                        end: index
                    })
                    i = index
                }
            }
        }
    }

    const findNormalText = (specialCharacters: Item[], message: string) => {
        const last = specialCharacters[specialCharacters.length - 1]?.end + 1
        specialCharacters.forEach((sp, index) => {
            specialCharacters.push({
                value: message.substring(specialCharacters[index - 1]?.end + 1, sp.start - 1),
                start: specialCharacters[index - 1] ? specialCharacters[index - 1].end + 1 : 0,
                end: sp.start - 1
            })
        })

        specialCharacters.push({
            value: message.substring(last),
            start: specialCharacters[specialCharacters.length - 1]?.end + 2,
            end: message.length
        })
    }

    const getStyleByCharacter = (char?: '*' | '_' | '~'): StyleProp<TextStyle> => {
        const style: StyleProp<TextStyle> = {}
        if (char === '*') {
            style.fontWeight = 'bold'
        }
        if (char === '_') {
            style.fontStyle = 'italic'
        }
        if (char === '~') {
            style.textDecorationLine = 'line-through'
        }
        return style
    }

    const buildText = (text: string) => {
        let specialCharacters: Item[] = []

        findSpecialCharacters(specialCharacters, text, "*")
        findSpecialCharacters(specialCharacters, text, "_")
        findSpecialCharacters(specialCharacters, text, "~")
        findNormalText(specialCharacters, text)

        specialCharacters = specialCharacters.sort(((a, b) => a.start > b.start ? 1 : a.start < b.start ? -1 : 0))

        return (
            specialCharacters.map(it => <Text key={it.start} style={getStyleByCharacter(it.type)}>{it.value}</Text>)
        )
    }

    return (
        <View style={styles.comment} onLayout={(_) => checkVisible()}>
            <View style={styles.details}>
                <Image style={styles.image} source={{uri: UserUtils.getImageUrl(comment.author)}}/>
                <Text>{comment.author.name}</Text>
                <Text style={styles.date}>{Time.diff(comment.lastUpdate)}</Text>
                <RoundButtonComponent
                    icon="dots-vertical"
                    style={{marginLeft: 6}}
                    iconSize={20}
                    containerSize={25}
                    onPress={() => console.log('open options...')}
                />
            </View>
            <Text>{buildText(comment.text)}</Text>
        </View>
    )
}

export default withTheme(CommentComponent)
