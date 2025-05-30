import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";

import { handleGoogleLogin } from "../../../utils/handleLogin.ts";
import { Login } from "./Login.tsx";
import { SignUp } from "./SignUp.tsx";

type AuthMode = 'login' | 'signup';

interface AuthProps {
    authMode?: AuthMode;
    onClose: () => void;
}

export const Auth = ({ onClose }: AuthProps) => {
    const [authMode, setAuthMode] = useState<AuthMode>("login");
    const [emailAuthView, setEmailAuthView] = useState<'login' | 'signup' | null>(null);

    const toggleAuthMode = (mode: AuthMode) => {
        setAuthMode(mode);
        if (emailAuthView) {
            setAuthMode(mode);
            setEmailAuthView(mode);
        }
    };

    const toggleEmailAuth = () => {
        if (authMode === "login") {
            setEmailAuthView('login');
        } else if (authMode === "signup") {
            setEmailAuthView('signup');
        }
    };

    return (
        <div
            className="fixed inset-0 bg-dark bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}>
            <div
                className={`relative bg-dark/60 border border-plum/40 rounded-lg text-white
                    max-w-4xl w-full lg:w-1/3 md:w-1/2 max-h-[90vh] py-12
                    flex flex-col items-center justify-center overflow-hidden shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    className="absolute top-4 right-4 z-40"
                    onClick={onClose}
                >
                    <FontAwesomeIcon icon={faX}/>
                </button>

                <div className="relative flex flex-col items-center justify-center p-2 gap-2">
                    {/* Header */}
                    <div className="flex flex-col items-center p-2 gap-2">
                        <h1 className="text-3xl font-semibold text-white/80 tracking-wide">
                            {authMode === "login" ? 'Login' : 'Sign Up'}
                        </h1>
                        <p className="text-xs font-light text-gray-400 tracking-wide">
                            Please sign up or login with your details
                        </p>
                    </div>

                    {/* Auth view toggle */}
                    <div className="flex items-center border border-charcoal rounded-md p-1 gap-1">
                        <button
                            className={`rounded-md w-24 h-8
                            ${authMode === "login" ? "bg-plum-100 text-white/80" : "text-gray-400 hover:bg-plum"}`}
                            onClick={() => toggleAuthMode('login')}
                        >
                            <span className="text-sm">Login</span>
                        </button>
                        <button
                            className={`rounded-md w-24 h-8 text-sm
                            ${authMode === "signup" ? "bg-plum-100 text-white/80" : "text-gray-400 hover:bg-plum"}`}
                            onClick={() => toggleAuthMode('signup')}
                        >
                            <span className="text-sm">Sign Up</span>
                        </button>
                    </div>

                    {emailAuthView === 'login' && authMode === 'login' ? (
                        <Login onBack={() => setEmailAuthView(null)} />
                    ) : emailAuthView === 'signup' && authMode === 'signup' ? (
                        <SignUp onBack={() => setEmailAuthView(null)} />
                    ) : (
                        <>
                            {/* Google auth button */}
                            <div className="border border-charcoal rounded-md px-1 py-3 w-52 hover:bg-white/10">
                                <button
                                    onClick={handleGoogleLogin}
                                    className="flex items-center justify-center gap-2 mx-auto"
                                >
                                    <FontAwesomeIcon icon={faGoogle} />
                                    <span className="text-xs">
                                        Continue with Google
                                    </span>
                                </button>
                            </div>
                            {/* Email auth button */}
                            <button
                                onClick={toggleEmailAuth}
                            >
                                <span className="text-xs text-white/80">
                                    {authMode === "login" ? 'Or login with email' : 'Or signup with email'}
                                </span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}