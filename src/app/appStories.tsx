import React from 'react'
import App from 'app/app'
import { ReduxStoreProviderDecorator } from 'app/reduxStoreProviderDecorator'

export default {
    title: 'TODOLISTS/App',
    component: App,
    decorators: [ReduxStoreProviderDecorator],
}

export const AppStory = (props: any) => <App demo={true} />
