import React from 'react'
import App from 'app/ui/app'
import { ReduxStoreProviderDecorator } from 'app/ui/reduxStoreProviderDecorator'

export default {
  title: 'TODOLISTS/App',
  component: App,
  decorators: [ReduxStoreProviderDecorator],
}

export const AppStory = (props: any) => <App />
