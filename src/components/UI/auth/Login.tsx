import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";

interface LoginProps {
    onBack: () => void;
}

export const Login = ({ onBack }: LoginProps) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const validateInputs = (): boolean => {
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('A valid email is required.');
            return false;
        }
        if (password.length < 6) {
            setError('Invalid password.');
            return false;
        }

        return true;
    };

    const handleEmailLogin = async () => {
        setError('');
        if (!validateInputs()) return;

        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = '/';
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            {error && <div
                className="text-xs text-red-500/80">{error}</div>}
            <div className="relative">
                <FontAwesomeIcon
                    icon={faEnvelope}
                    size="lg"
                    className="w-5 border-r border-neutral/60 pr-2 absolute top-1/2 transform -translate-y-1/2 left-3 text-neutral"
                />
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-dark/60 border border-charcoal rounded-md w-full py-2 pl-12 pr-3
                    text-white/80 placeholder:text-neutral/60 placeholder:text-sm focus:outline-none"
                    placeholder="Enter valid email address"
                />
            </div>
            <div className="relative">
                <FontAwesomeIcon
                    icon={faLock}
                    size="lg"
                    className="w-5 border-r border-neutral/60 pr-2 absolute top-1/2 transform -translate-y-1/2 left-3 text-neutral"
                />
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-dark/60 border border-charcoal rounded-md w-full py-2 pl-12 pr-3
                    text-white/80 placeholder:text-neutral/60 placeholder:text-sm focus:outline-none"
                    placeholder="Enter your password"
                />
            </div>
            <div className="flex items-center justify-between py-2 w-full">
                <button
                    className="bg-plum-100 text-white/80 py-2 px-4 rounded-md transition w-full"
                    type="button"
                    onClick={handleEmailLogin}
                >
                    <span className="text-sm">Login</span>
                </button>
            </div>
            <div className="flex items-center justify-center gap-1 text-xs">
                <p className="text-white/60">Forgot password?</p>
                <button>
                    <span className="text-plum-100/80 hover:underline">
                        Click here to reset
                    </span>
                </button>
            </div>
            <div className="flex items-center justify-center w-full mb-2">
                <button onClick={onBack}>
                    <span className="text-xs text-white/60">
                        Go back
                    </span>
                </button>
            </div>
        </div>
    )
}