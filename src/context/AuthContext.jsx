// src/context/AuthContext.js
import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const user = useSelector((state) => state.user); // Assuming your Redux store is set up with `user` slice

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
