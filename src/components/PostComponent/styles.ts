import {StyleSheet} from "react-native"

export default StyleSheet.create({
    post: {
        display: "flex",
        paddingTop: 10,
        paddingBottom: 8,
        paddingLeft: 6,
        paddingRight: 10,
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
        flexDirection: "row",
        marginBottom: 6
    },
    avatar: {
        alignSelf: "center",
        marginRight: 12
    },
    game: {
        flex: 4,
        justifyContent: "space-between",
    },
    details: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 1
    },
    text: {
        textAlign: "right",
        flex: 1
    },
    label: {
        flex: 1
    },
    counter: {}
})
