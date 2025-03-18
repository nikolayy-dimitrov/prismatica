import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { faAt } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { handleGoogleLogin } from "../../utils/handleLogin";

export const SignIn: React.FC = () => {
    return (
        <motion.div
            id="sign-up"
            className="w-11/12 mx-auto flex items-center justify-center md:mt-12 max-md:mt-24 font-Inter text-white"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, y: -50 },
                visible: { opacity: 1, y: 0 },
            }}
        >
            <div className="bg-gradient-to-tl from-plum to-midnight
            border-t-2 border-l-2 border-b-4 border-r-4 border-t-midnight/40 border-l-midnight/40 border-plum
            shadow-lg rounded-3xl p-8 w-full max-w-md">
                <h1 className="text-4xl font-bold mb-6 text-center tracking-wide">Sign In</h1>
                <p className="text-lg text-center mb-6 tracking-wide">
                    Welcome back to your Digital Art Gallery!
                </p>
                <div className="flex flex-col gap-4">
                    <Link
                        to="/sign-in/email"
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
                </div>
                <div className="border-t border-neutral mt-6 pt-4 text-center">
                    <Link to="/sign-up" className="text-neutral hover:underline">
                        Don't have an account? Sign Up
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};
