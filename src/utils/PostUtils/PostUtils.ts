import {ErrorType} from "../Validator/types";
import {PostInfo, PostType} from "../../types/PostsTypes";

export interface Errors {
    title: ErrorType
    game?: ErrorType
    text: ErrorType
    platforms?: ErrorType
    language: ErrorType
    channels?: ErrorType
}

class PostUtils {

    public static getErrors(postType: PostType): Errors {
        switch (postType) {
            case PostType.GENERAL:
                return {
                    title: {
                        message: '',
                        touched: false,
                        label: 'Title',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    game: {
                        message: '',
                        touched: false,
                        label: 'Game',
                        validations: [
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    text: {
                        message: '',
                        touched: false,
                        label: 'Message',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 5000,
                            },
                        ],
                    },
                    language: {
                        message: '',
                        touched: false,
                        label: 'Language',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                    platforms: {
                        message: '',
                        touched: false,
                        label: 'Platforms',
                        validations: [],
                    },
                    channels: {
                        message: '',
                        touched: false,
                        label: 'Channels',
                        validations: []
                    }
                }
            case PostType.STREAMERS:
                return {
                    title: {
                        message: '',
                        touched: false,
                        label: 'Title',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    text: {
                        message: '',
                        touched: false,
                        label: 'Message',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 5000,
                            },
                        ],
                    },
                    language: {
                        message: '',
                        touched: false,
                        label: 'Language',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    }
                }
            case PostType.SETUP:
                return {
                    title: {
                        message: '',
                        touched: false,
                        label: 'Title',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    text: {
                        message: '',
                        touched: false,
                        label: 'Message',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 5000,
                            },
                        ],
                    },
                    language: {
                        message: '',
                        touched: false,
                        label: 'Language',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                    platforms: {
                        message: '',
                        touched: false,
                        label: 'Platforms',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ]
                    }
                }
            case PostType.ONLINE:
                return {
                    title: {
                        message: '',
                        touched: false,
                        label: 'Title',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    text: {
                        message: '',
                        touched: false,
                        label: 'Message',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 5000,
                            },
                        ],
                    },
                    platforms: {
                        message: '',
                        touched: false,
                        label: 'Platforms',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                    language: {
                        message: '',
                        touched: false,
                        label: 'Language',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                }
            case PostType.HARDWARE:
                return {
                    title: {
                        message: '',
                        touched: false,
                        label: 'Title',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    text: {
                        message: '',
                        touched: false,
                        label: 'Message',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 5000,
                            },
                        ],
                    },
                    platforms: {
                        message: '',
                        touched: false,
                        label: 'Platforms',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                    language: {
                        message: '',
                        touched: false,
                        label: 'Language',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                }
            default:
                return {
                    title: {
                        message: '',
                        touched: false,
                        label: 'Title',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    game: {
                        message: '',
                        touched: false,
                        label: 'Game',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 40,
                            },
                        ],
                    },
                    text: {
                        message: '',
                        touched: false,
                        label: 'Message',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                            {
                                key: 'MAX_LENGTH',
                                value: 5000,
                            },
                        ],
                    },
                    platforms: {
                        message: '',
                        touched: false,
                        label: 'Platforms',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                    language: {
                        message: '',
                        touched: false,
                        label: 'Language',
                        validations: [
                            {
                                key: 'REQUIRED',
                            },
                        ],
                    },
                }
        }
    }

    public static isButtonEnabled (postType: PostType,post: PostInfo, errors: Errors, untouched: boolean): boolean {
        switch (postType) {
            case PostType.GENERAL:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.text.message ||
                    !!errors.language.message ||
                    !post.language.name
            case PostType.GAMES:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.game?.message ||
                    !!errors.text.message ||
                    !!errors.language.message ||
                    !post.language.name ||
                    !!errors.platforms?.message
            case PostType.ONLINE:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.text.message ||
                    !!errors.language.message ||
                    !post.language.name ||
                    !!errors.platforms?.message
            case PostType.STREAMERS:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.text.message ||
                    !!errors.language.message ||
                    !post.language.name
            case PostType.SETUP:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.text.message ||
                    !!errors.language.message ||
                    !post.language.name ||
                    !!errors.platforms?.message
            case PostType.HARDWARE:
                return untouched ||
                    !!errors.title.message ||
                    !!errors.text.message ||
                    !!errors.language.message ||
                    !post.language.name ||
                    !!errors.platforms?.message
            default:
                return true
        }
    }

}

export default PostUtils
