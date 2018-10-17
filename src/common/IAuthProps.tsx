import { Role } from "../user/Roles";

export interface IUserData {
    exp: number,
    iat: number,
    identity: string,
    iss: string,
    name: string,
    scope: Role[],
    sub: string,
}

export const emptyUser: IUserData = {
    exp: 0,
    iat: 0,
    identity: "",
    iss: "",
    name: "",
    scope: [],
    sub: "",
}

export function userFromToken(token: string): IUserData {
    return JSON.parse(atob(token.split(".")[1]));
}

export interface IAuthProps {
    token: string,
    toast: (message: string) => void,
    user: IUserData,
}
