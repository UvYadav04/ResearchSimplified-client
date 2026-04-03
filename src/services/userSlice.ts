import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LogInIcon } from "lucide-react";
import type { userInfo } from "../pages/Home/components/Navbar";

export interface BaseResponse {
    status: number,
    success: boolean,
    message: string,
    error: boolean
}

export interface TUserInfo extends BaseResponse {
    userInfo: userInfo,
    success: boolean
}

export const userSlice = createApi({
    reducerPath: "userSlice",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URI,
        credentials: "include"
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getUserInfo: builder.query<TUserInfo, void>({
            query: () => ({
                url: "/user-info",
                method: "GET",
                credentials: "include",
                timeout: 10000
            }),
            providesTags: ["User"]
        }),
        login: builder.mutation<BaseResponse, { email: string, name: string }>({
            query: ({ email, name }) => ({
                url: "/login",
                method: "POST",
                body: { email, name },
                credentials: 'include',
                timeout: 10000
            }),
            invalidatesTags: ["User"],
        }),
        logout: builder.mutation<BaseResponse, void>({
            query: () => ({
                url: "/logout",
                method: "POST",
                credentials: 'include',
                timeout: 10000
            }),
            invalidatesTags: ["User"],
        }),
    })
})

export const {
    useGetUserInfoQuery,
    useLoginMutation,
    useLogoutMutation
} = userSlice