import PostListScreen from "../PostList";
import {PostType} from "../../types/PostsTypes";
import {connect} from "react-redux";
import {withTheme} from "react-native-paper";

class PostListOnline extends PostListScreen {
}

const mapStateToProps = (state: any) => {
    return {
        user: state.user,
        postType: PostType.ONLINE
    }
}
export default connect(mapStateToProps)(withTheme(PostListOnline))
