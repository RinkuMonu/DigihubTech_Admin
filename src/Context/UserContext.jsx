import React, { createContext, useState, useContext, useEffect } from "react";
import { apiGet } from "../api/apiMethods";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([])
    const [logoURL, setLogoURL] = useState("")
    const token = sessionStorage.getItem('accessToken')

    const initializeUser = async () => {
        try {
            const response = await apiGet("api/auth/userInfo");
            if (response.status === 200) {
                setUser(response.data?.user);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error.message);
        }
    };

    useEffect(() => {
        if (token) {
            initializeUser();
        }
    }, [token]);

    useEffect(() => {
        (async () => {
            try {
                if (!user) return;
                const { data } = await apiGet(`/api/website/${user.referenceWebsite}`)
                setCategories(data.website.categories);
                setLogoURL(data.logoUrl);
            } catch (error) {
                console.log(error.message)
            }
        })()
    }, [user])

    return (
        <UserContext.Provider value={{ user, setUser, initializeUser, categories, setCategories, logoURL }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
