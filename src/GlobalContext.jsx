import React from 'react';

export const GlobalContext = React.createContext({
    token: "",
    user_name: "",
    drawerOpen: false,
    toastMessage: "",
    toastOpen: false,
})