import React from 'react'
import {StyleSheet, View} from "react-native"
import {Theme} from "react-native-paper/lib/typescript/types"
//import Markdown, {MarkdownIt} from "react-native-markdown-display"
import {Text, withTheme} from "react-native-paper"
import {Comment} from "../../types/PostsTypes"
import RoundButtonComponent from "../RoundButtonComponent/RoundButtonComponent"
// @ts-ignore
import Markdown from 'react-native-simple-markdown'

interface ReplyToProperties {
    theme: Theme
    comment: Comment | null
    close: () => void
}

const ReplyToComponent: React.FC<ReplyToProperties> = ({theme, comment, close}) => {
    const styles = StyleSheet.create({
        replyTo: {
            backgroundColor: theme.colors.surface,
        },
        header: {
            borderBottomWidth: 2,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            borderBottomColor: theme.colors.text,
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        },
        content: {
            paddingBottom: 6,
            marginTop: 6,
            paddingHorizontal: 12
        },
        title: {
            fontSize: 20,
            marginRight: 'auto'
        },
        author: {
            color: theme.colors.accent,
        }
    })

    return (
        <>
            {
                !!comment &&
                <View style={styles.replyTo}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Reply to <Text
                            style={styles.author}>@{comment.author?.name}</Text></Text>
                        <RoundButtonComponent
                            icon={'close'}
                            onPress={() => close()}
                        />
                    </View>
                    <View style={styles.content}>
                        <Markdown
                            styles={{
                                text: {
                                    color: theme.colors.text,
                                },
                                blockquote: {
                                    backgroundColor: theme.colors.background,
                                    marginTop: 12,
                                    paddingTop: 0
                                }
                            }}
                        >
                            {comment.text}
                        </Markdown>
                    </View>
                </View>
            }
        </>
    )
}

export default withTheme(ReplyToComponent)
