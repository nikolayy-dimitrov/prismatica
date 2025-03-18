import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthGuard: React.FC = () => {
    const { user } = useContext(AuthContext);

    if (user) {
        return <Navigate to="/artboard" replace />;
    }

    return <Outlet />;
};

export default AuthGuard;