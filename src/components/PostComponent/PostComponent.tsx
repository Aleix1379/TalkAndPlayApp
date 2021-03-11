import React from 'react'
import {Image, StyleSheet, View} from "react-native"
import {Text, withTheme} from 'react-native-paper'
import UserUtils from "../../utils/UserUtils"
import Time from "../../utils/Time"
import {Theme} from "react-native-paper/lib/typescript/types"
import {Option, PostInfo} from "../../types/PostsTypes"

interface PostProperties {
    post: PostInfo,
    onClick: (id: number, title: string) => void,
    theme: Theme
}

const PostComponent: React.FC<PostProperties> = ({post, onClick, theme}) => {
    const {id, title, game, platforms, user, language, lastUpdate} = post

    const styles = StyleSheet.create({
        post: {
            backgroundColor: theme.colors.primary,
            display: "flex",
            flexDirection: "row",
            marginHorizontal: 6,
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
        user: {
            display: "flex",
            alignItems: "center",
            marginRight: 12
        },
        avatar: {
            borderRadius: 50,
            width: 50,
            height: 50,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: theme.colors.background
        },
        game: {
            flex: 1,
            justifyContent: "space-between",
            color: theme.colors.accent
        },
        details: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
        },
        text: {
            color: theme.colors.text
        },
        label: {
            flex: 1,
            color: theme.colors.text
        }
    })

    return (
        <View
            style={styles.post}
            onTouchEnd={() => onClick(id, title)}>

            <View style={styles.user}>
                <Image
                    style={styles.avatar}
                    source={{uri: UserUtils.getImageUrl(user)}}/>
                <Text style={styles.text}>{user?.name}</Text>
            </View>

            <View style={styles.game}>
                <Text style={styles.text}>{title}</Text>

                <View style={styles.details}>
                    <Text style={styles.label}>{game}</Text>
                    <Text style={styles.text}>{platforms.map((platform: Option) => platform.name).join(', ')}</Text>
                </View>

                <View style={styles.details}>
                    <Text style={styles.label}>{language.name}</Text>
                    <Text style={styles.text}>{Time.diff(lastUpdate)}</Text>
                </View>
            </View>
        </View>
    )

}

export default withTheme(PostComponent)
