export type BaseResponseType<D = {}> = {
    resultCode: 0
    messages: Array<string>
    data: D
}
