import React from 'react';

export const GlobalContext = React.createContext({
    token: "",
    loginOpen: false,
    handleChange: null,
    username: "",
    drawerOpen: false,
    toastMessage: "",
    toastOpen: false,
})
