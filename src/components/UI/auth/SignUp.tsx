import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, UserCredential } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";

interface SignUpProps {
    onBack: () => void;
}

export const SignUp = ({ onBack }: SignUpProps) => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const validateInputs = (): boolean => {
        if (!name.trim()) {
            setError('Name is required.');
            return false;
        }
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('A valid email is required.');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        setError('');
        if (!validateInputs()) return;

        try {
            const auth = getAuth();
            const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User registered:', userCredential.user);
            window.location.href = '/sign-in';
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            {error && <div
                className="text-xs text-red-500/80">{error}</div>
            }

            <div className="relative">
                <FontAwesomeIcon
                    icon={faUser}
                    size="lg"
                    className="w-5 border-r border-neutral/60 pr-2 absolute top-1/2 transform -translate-y-1/2 left-3 text-neutral"
                />
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-dark/60 border border-charcoal rounded-md w-full py-2 pl-12 pr-3
                    text-white/80 placeholder:text-neutral/60 placeholder:text-sm focus:outline-none"
                    placeholder="Enter your name"
                />
            </div>
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
            <div className="relative">
                <FontAwesomeIcon
                    icon={faLock}
                    size="lg"
                    className="w-5 border-r border-neutral/60 pr-2 absolute top-1/2 transform -translate-y-1/2 left-3 text-neutral"
                />
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-dark/60 border border-charcoal rounded-md w-full py-2 pl-12 pr-3
                    text-white/80 placeholder:text-neutral/60 placeholder:text-sm focus:outline-none"
                    placeholder="Re-enter your password"
                />
            </div>
            <div className="flex items-center justify-between py-2 w-full">
                <button
                    className="bg-plum-100 text-white/80 py-2 px-4 rounded-md transition w-full"
                    type="button"
                    onClick={handleRegister}
                >
                    <span className="text-sm">Sign Up</span>
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