import {createContext} from 'react'

export interface ISecurityContext {
    isAuthenticated: () => boolean
    userId: string | undefined
    userEmail: string | undefined
    userName: string | undefined
    userUsername: string | undefined
    login: () => void
    logout: () => void
    loading: boolean,
    roles?: string[],
    hasRole: (roleName: string) => boolean;
}

export default createContext<ISecurityContext>({
    isAuthenticated: () => false,
    userId: undefined,
    userEmail: undefined,
    userName:  undefined,
    userUsername: undefined,
    login: () => {},
    logout: () => {},
    loading: true,
    roles: [],
    hasRole: () => false
})