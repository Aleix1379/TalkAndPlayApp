import React from 'react'
import {Comment} from "../../types/PostsTypes"
import {Image, StyleSheet, View} from "react-native"
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
            <Text>{comment.text}</Text>
        </View>
    )
}

export default withTheme(CommentComponent)
