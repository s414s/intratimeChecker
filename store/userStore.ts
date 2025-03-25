import { create } from 'zustand';
import { jwtDecode } from "jwt-decode";


export interface UserInfo {
    id: number;
    name: string;
    surname: string;
    email: string;
}

// export interface User {
//     id: number;
//     name: string;
//     email: string;
// }

interface AppState {
    jwtToken?: string;
    setUser: (jwtToken?: string) => void,
    getUserInfo: () => UserInfo | undefined,
    removeUser: () => void,
    isUserLoggedIn: () => boolean,
}

export const useAppStore = create<AppState>()((set, get) => ({
    jwtToken: undefined,
    setUser: (jwtToken?: string) => { set({ jwtToken }); },
    getUserInfo: () => {
        const { jwtToken } = get();

        if (!jwtToken)
            return undefined;

        return jwtDecode<UserInfo>(jwtToken);
    },
    removeUser: () => { set({ jwtToken: undefined }); },
    isUserLoggedIn: () => get().getUserInfo() !== undefined,
}));