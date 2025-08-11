import React, { createContext, useState, useContext } from 'react';

const UserPreferencesContext = createContext();

export const UserPreferencesProvider = ({ children }) => {
    const [preferences, setPreferences] = useState({
        gender: null,
        ageGroup: null,
        relationshipStatus: null,
        livingSituation: null,
    });

    return (
        <UserPreferencesContext.Provider value={{ preferences, setPreferences }}>
            {children}
        </UserPreferencesContext.Provider>
    );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);
