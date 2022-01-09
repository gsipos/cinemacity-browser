import { createContext } from 'react'
import { AppStore } from '../data/store'

export const appStore = new AppStore()

export const AppStoreContext = createContext(appStore)
