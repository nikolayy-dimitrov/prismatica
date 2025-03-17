import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { faAt, faUser } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { handleAnonymousLogin, handleGoogleLogin } from "../../utils/handleLogin";

export const SignUp: React.FC = () => {
    return (
        <motion.section
            id="sign-up"
            className="min-h-screen flex flex-col items-center justify-center bg-dark text-neutral px-4"
            initial="hidden"
            animate="visible"
        >
            <div className="bg-charcoal p-8 rounded-3xl shadow-lg w-full max-w-md">
                <h1 className="text-4xl font-bold mb-6 text-center">Sign Up</h1>
                <p className="text-lg text-center mb-6">
                    Join our Digital Art Gallery and showcase your creativity.
                </p>
                <div className="flex flex-col gap-4">
                    <Link
                        to="/sign-up/email"
                        className="flex items-center justify-between bg-plum text-white px-4 py-3 rounded-xl transition-transform duration-150 active:scale-95"
                    >
                        <FontAwesomeIcon icon={faAt} />
                        <span>Continue with Email</span>
                        <div></div>
                    </Link>
                    <div
                        className="flex items-center justify-between bg-plum text-white px-4 py-3 rounded-xl transition-transform duration-150 active:scale-95 cursor-pointer"
                        onClick={handleGoogleLogin}
                    >
                        <FontAwesomeIcon icon={faGoogle} className="ml-2" />
                        <span>Continue with Google</span>
                        <div></div>
                    </div>
                    <div
                        className="flex items-center justify-between bg-plum text-white px-4 py-3 rounded-xl transition-transform duration-150 active:scale-95 cursor-pointer"
                        onClick={handleAnonymousLogin}
                    >
                        <FontAwesomeIcon icon={faUser} className="ml-2" />
                        <span>Continue Anonymously</span>
                        <div></div>
                    </div>
                </div>
                <div className="border-t border-neutral mt-6 pt-4 text-center">
                    <Link to="/sign-in" className="text-white hover:underline">
                        Already have an account? Sign In
                    </Link>
                </div>
            </div>
        </motion.section>
    );
};
