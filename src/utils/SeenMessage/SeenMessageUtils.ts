class SeenMessageUtils {
    public static mergeSeenMessages(
        localData: { [id: number]: number },
        userData: { [id: number]: number }
    ): { [id: number]: number } {
        let keys: number[] = Object.keys(localData).concat(Object.keys(userData).filter(it => Object.keys(localData).findIndex(el => el === it) < 0)).map(it => Number(it))


        console.log('keys => ' + keys)

        let result: { [id: number]: number } = {}

        keys.forEach((key: number) => {
            if (!userData[key]) {
                result[key] = localData[key]
            } else if (!localData[key]) {
                result[key] = userData[key]
            } else {
                if (userData[key] > localData[key]) {
                    result[key] = userData[key]
                } else {
                    result[key] = localData[key]
                }
            }
        })

        return result
    }
}

export default SeenMessageUtils
