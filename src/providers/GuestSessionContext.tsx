"use client";

import { getGuestSession } from "@/services/auth/getGuestSession";
import { createContext, useContext, useEffect, useState } from "react";

// Crea un contexto global
const GetSessionContext = createContext<{
    guestSessionId: string | null;
    setGuestSessionId: (id: string) => void;
}>({
    guestSessionId: null,
    setGuestSessionId: () => {}
});

// Wrapper que provee el contexto a todo lo que envuelve
export const GuestSessionProvider = ({ children }: { children: React.ReactNode }) => {

    const [guestSessionId, setGuestSessionIdState] = useState<string | null>(null);

    // Guarda id de la sesión en localStorage y estado react
    const setGuestSessionId = (id: string) => {
        localStorage.setItem("guestSessionId", id);
        setGuestSessionIdState(id);
    };

    const fetchGuestSession = async () => {
        const data = await getGuestSession();
        if(data.guest_session_id) {
            setGuestSessionId(data.guest_session_id);
        }
    };

    // Crear o cargar sesión
    useEffect(() => {
        const existingId = localStorage.getItem("guestSessionId");
        if (existingId) {
            setGuestSessionIdState(existingId);
        }
        else {
            fetchGuestSession();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }, []);

    return (
        <GetSessionContext.Provider value = {{ guestSessionId, setGuestSessionId }}>
            {children}
        </GetSessionContext.Provider>
    );
};

export const useGuestSession = () => useContext(GetSessionContext);