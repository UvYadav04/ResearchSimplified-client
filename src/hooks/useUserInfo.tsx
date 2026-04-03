import React from 'react'
import { useGetUserInfoQuery } from '../services/userSlice'

function useUserInfo() {
    const { data, isLoading: gettingUserInfo } = useGetUserInfoQuery()
    const { userInfo } = data || {}
    return { userInfo, gettingUserInfo }
}

export default useUserInfo
