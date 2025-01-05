import React, { createContext, useContext, useEffect, useState } from 'react';

interface RoleContextType {
    roles: string[];
    currentRole: string;
    switchRole: (role: string) => void;
    setRoles: (roles: string[]) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [roles, setRoles] = useState<string[]>([]);
    const [currentRole, setCurrentRole] = useState<string>('Student'); // Default value

    useEffect(() => {
        // This code runs only in the client
        const storedRoles = localStorage.getItem('roles');
        const storedCurrentRole = localStorage.getItem('currentRole');

        if (storedRoles) {
            setRoles(JSON.parse(storedRoles)); // Set roles from localStorage
        }

        if (storedCurrentRole) {
            setCurrentRole(storedCurrentRole); // Set currentRole from localStorage
        }
    }, []);

    const switchRole = (role: string) => {
        setCurrentRole(role);
        localStorage.setItem('currentRole', role); // Persist the role in localStorage
    };

    return (
        <RoleContext.Provider value={{ roles, currentRole, switchRole, setRoles }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("useRole must be used within a RoleProvider");
    }
    return context;
};
