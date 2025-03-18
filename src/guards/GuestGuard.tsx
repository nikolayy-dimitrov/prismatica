import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const GuestGuard: React.FC = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
};

export default GuestGuard;