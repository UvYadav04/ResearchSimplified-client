import { configureStore } from "@reduxjs/toolkit"
import {userSlice} from '../services/userSlice'
export const store = configureStore({
    reducer: {
        [userSlice.reducerPath]: userSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([userSlice.middleware])
})