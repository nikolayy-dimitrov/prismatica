import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";

import { auth } from "../../config/firebaseConfig.ts";
import { AuthContext } from "../../context/AuthContext.tsx";
import Logo from "../../assets/prismatica-logo.png";
import useMediaQuery from "../../hooks/useMediaQuery.ts";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Navbar = () => {
    const { user } = useContext(AuthContext);

    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false)

    const toggleMenu = () => {
        setIsMenuToggled(!isMenuToggled);
    };

    const handleLogout = async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            await signOut(auth);
            window.location.href = '/';
        } catch (error) {
            console.error(error);
        }
    };

    return <nav className="md:w-full mx-auto relative flex items-center justify-between py-4 px-8 font-Inter">
        <Link to="/" className="z-40 transition duration-300 active:scale-95 flex items-center gap-2 max-md:mt-1">
            <img src={Logo} alt="Logo" className="w-6 h-6" />
            {isAboveMediumScreens &&
                <span className="transition duration-200 text-midnight text-xl font-extrabold brightness-200 tracking-wider">
                    PRISMATICA
                </span>
            }
        </Link>
        {/* Main menu */}
        {isAboveMediumScreens ? (
            <div className="flex items-center gap-2">
                {/* Link to view all pictures */}
                <Link to="/gallery">
                    <span className="text-plum brightness-200 uppercase text-sm">Gallery</span>
                </Link>

                {/* Auth menu */}
                {user ? (
                    <>
                        <button
                            onClick={toggleMenu}
                            className="text-plum brightness-200 px-4">
                            <FontAwesomeIcon icon={faUser} />
                        </button>
                        {isMenuToggled && (
                            <div className="absolute top-12 right-10 bg-plum/80 border border-plum rounded-lg py-4 pl-12 pr-6 z-40">
                                <div className="flex flex-col items-end gap-4 text-white/90">
                                    <Link to="/profile">View Profile</Link>
                                    <Link to="/gallery">Gallery</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full border-t border-neutral/20 pt-2 text-right"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <Link
                        to="/sign-up"
                        className="text-plum brightness-200 px-4">
                        <FontAwesomeIcon icon={faUser} />
                    </Link>
                )}
            </div>
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
                className="fixed top-20 z-30 w-10/12 h-[60vh] flex flex-col items-center justify-center
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
                    {!user ? (
                        <Link to="/sign-in">
                            <button onClick={toggleMenu}>
                                Sign In
                            </button>
                        </Link>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-20">
                            <Link
                                to="/profile">
                                <button onClick={toggleMenu}>
                                    Profile
                                </button>
                            </Link>
                            <button onClick={async (e) => {
                                toggleMenu();
                                await handleLogout(e)
                            }}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        )}
    </nav>
}