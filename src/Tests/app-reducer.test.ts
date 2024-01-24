import {appActions, appReducer, AppState, RequestStatusType} from "../app/app-reducer";

let startState: AppState

beforeEach(() => {
    startState = {
        error: null as null | string,
        status: 'loading' as RequestStatusType,
        isInitialized: false
    }
})


test('correct error message should be set', () => {
    const endState = appReducer(startState, appActions.setAppError({error:'Some error'}))
    expect(endState.error).toBe('Some error')
})

test('correct status should be set', () => {
    const endState = appReducer(startState, appActions.setAppStatus({status:'loading'}))
    expect(endState.status).toBe('loading')
})
