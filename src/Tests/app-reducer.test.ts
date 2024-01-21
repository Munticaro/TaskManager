import {appActions, RequestStatusType, setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {createSlice} from "@reduxjs/toolkit";

let startState: InitialStateType

beforeEach(() => {
    startState = {
        error: null as null | string,
        status: 'loading' as RequestStatusType,
        isInitialized: false
    }
})


test('correct error message should be set', () => {
    const endState = appActions(startState, setAppErrorAC({error:'Some error'}))
    expect(endState.error).toBe('Some error')
})

test('correct status should be set', () => {
    const endState = createSlice(startState, setAppStatusAC({status:'loading'}))
    expect(endState.error).toBe('loading')
})
