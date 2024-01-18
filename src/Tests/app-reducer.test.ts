import {appReducer, InitialStateType, RequestStatusType, setAppErrorAC, setAppStatusAC} from "../app/app-reducer";

let startState: InitialStateType

beforeEach(() => {
    startState = {
        error: null as null | string,
        status: 'loading' as RequestStatusType,
        isInitialized: false
    }
})


test('correct error message should be set', () => {
    const endState = appReducer(startState, setAppErrorAC('Some error'))
    expect(endState.error).toBe('Some error')
})

test('correct status should be set', () => {
    const endState = appReducer(startState, setAppStatusAC('loading'))
    expect(endState.error).toBe('loading')
})
