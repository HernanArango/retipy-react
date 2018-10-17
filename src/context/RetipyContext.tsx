import * as React from "react";
import { IUserData } from "../common/IAuthProps";

interface IRetipyContext {
    token: string,
    user: IUserData,
    toast: (message: string) => void,
}

const context = React.createContext<IRetipyContext | null>(null);

export const RetipyContextProvider = context.Provider;
export const RetipyContextConsumer = context.Consumer;
