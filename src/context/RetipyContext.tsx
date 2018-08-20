import * as React from "react";

interface IRetipyContext {
    token: string,
    username: string,
    toast: (message: string) => void,
}

const context = React.createContext<IRetipyContext | null>(null);

export const RetipyContextProvider = context.Provider;
export const RetipyContextConsumer = context.Consumer;
