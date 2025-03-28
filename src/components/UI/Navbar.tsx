import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";

import { auth } from "../../config/firebaseConfig.ts";
import { AuthContext } from "../../context/AuthContext.tsx";
import Logo from "../../assets/prismatica-logo.png";
import useMediaQuery from "../../hooks/useMediaQuery.ts";

export const Navbar = () => {
    const { user } = useContext(AuthContext);

    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false)

    const toggleMenu = () => {
        setIsMenuToggled(!isMenuToggled);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '/';
        } catch (error) {
            console.error(error);
        }
    };

    return <nav className="md:w-11/12 mx-auto relative flex items-center justify-between py-4 px-8 font-Inter">
        <Link to="/" className="z-40 transition duration-300 active:scale-95 flex items-center gap-4 max-md:mt-1">
            <img src={Logo} alt="Logo" className="w-8 h-8" />
            <span className="transition duration-300 bg-clip-text bg-gradient-to-l from-midnight to-plum text-transparent text-2xl font-extrabold brightness-200 tracking-wider">
                PRISMATICA
            </span>
        </Link>
        {/* Main menu */}
        {isAboveMediumScreens ? (
            <>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-12 font-light bg-gradient-to-l from-plum to-midnight bg-clip-text text-transparent brightness-200 z-40">
                <Link to="/gallery">
                    Gallery
                </Link>
                <Link to="/">
                    Home
                </Link>
                <Link to="/artboard">
                    Artboard
                </Link>
            </div>
            {/* Auth menu */}
            {user ? (
                <div className="flex items-center gap-8 z-40">
                    <Link
                        to="/profile"
                        className="font-normal tracking-wide text-plum brightness-200">
                        {user.displayName ? `Welcome, ${user.displayName} ` : 'Welcome to Prismatica'}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-neutral font-light border-2 border-neutral/35 px-4 rounded-lg">
                        Logout
                    </button>
                </div>
            ) : (
                <div>
                    <Link
                        to="/sign-up"
                        className="text-plum brightness-150 border-2 border-plum/60 px-4 rounded-lg py-1">
                        Join Now
                    </Link>
                </div>
            )}
        </>
        ) : (
            // Hamburger Menu
            <button className="flex items-center z-40" onClick={toggleMenu}>
                <div
                    className={`relative w-[30px] h-[20px] z-40 transform transition-transform duration-500 ease-in-out ${
                        isMenuToggled ? "rotate-0" : ""
                    }`}
                >
                        <span
                            className={`block absolute h-[3px] w-full bg-gradient-to-r from-midnight to-plum rounded-[9px] left-0 transition-all duration-250 ease-in-out ${
                                isMenuToggled ? "top-[10px] rotate-[135deg]" : "top-0"
                            }`}
                        ></span>
                    <span
                        className={`block absolute h-[3px] w-full top-[10px] bg-gradient-to-r from-midnight to-plum rounded-[9px] left-0 transition-all duration-250 ease-in-out ${
                            isMenuToggled ? "opacity-0 left-[-60px]" : ""
                        }`}
                    ></span>
                    <span
                        className={`block absolute h-[3px] w-full bg-gradient-to-r from-midnight to-plum rounded-[9px] left-0 transition-all duration-250 ease-in-out ${
                            isMenuToggled ? "top-[10px] rotate-[-135deg]" : "top-[20px]"
                        }`}
                    ></span>
                </div>
            </button>
        )}
        {/* Mobile Menu Modal */}
        {!isAboveMediumScreens && isMenuToggled && (
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed top-20 z-30 w-10/12 h-[50vh] flex flex-col items-center justify-center
                        bg-gradient-to-b from-midnight/80 to-plum/80 backdrop-blur rounded-3xl"
            >
                <div className="flex flex-col items-center justify-center gap-16
                        text-white/80 text-3xl font-normal">
                    <Link to="/">
                        <button onClick={toggleMenu}>
                            Home
                        </button>
                    </Link>
                    <Link to="/gallery">
                        <button onClick={toggleMenu}>
                            Gallery
                        </button>
                    </Link>
                    <Link to="/artboard">
                        <button onClick={toggleMenu}>
                            Artboard
                        </button>
                    </Link>
                    {!user ? (
                        <Link to="/sign-in">
                            <button onClick={toggleMenu}>
                                Sign In
                            </button>
                        </Link>
                    ) : (
                        <Link
                            to="/profile"
                            className="text-content">
                            Profile
                        </Link>
                    )}
                </div>
            </motion.div>
        )}
    </nav>
}