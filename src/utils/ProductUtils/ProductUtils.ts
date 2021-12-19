interface InstantGamingSiz {
    width: number
    height: number
}

class ProductUtils {

    public static getInstantGamingSize(width: number): InstantGamingSiz {
        const instantGamingImageWidth = width
        const imageRatio = 1.396296296

        // if (style) {
        //     return {
        //         width: width,
        //         height: width * imageRatio
        //     }
        // }

        return {
            width: instantGamingImageWidth,
            height: instantGamingImageWidth * imageRatio
        }
    }

}

export default ProductUtils
