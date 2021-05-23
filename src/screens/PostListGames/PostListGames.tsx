import React from "react";
import PostListScreen from "../PostList";
import {connect} from "react-redux";
import {withTheme} from "react-native-paper";
import {PostType} from "../../types/PostsTypes";

class PostListGames extends PostListScreen {}

const mapStateToProps = (state: any) => {
    return {
        user: state.user,
        postType: PostType.GAMES
    }
}


export default connect(mapStateToProps)(withTheme(PostListGames))

