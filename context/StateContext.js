import React, { createContext, useState } from "react";

const StateContext = createContext(null);

export const StateProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false);

    console.log("StateProvider is rendering...");

    return (
        <StateContext.Provider value={{ isLogin, setIsLogin, loading, setLoading }}>
            {children}
        </StateContext.Provider>
    );
};

export default StateContext;
