import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import Logo from "../../assets/prismatica-logo.png";
import useMediaQuery from "../../hooks/useMediaQuery.ts";
import { auth } from "../../config/firebaseConfig.ts";
import { AuthContext } from "../../context/AuthContext.tsx";
import { Auth } from "./auth/Auth.tsx";

export const Navbar = () => {
    const { user } = useContext(AuthContext);

    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
    const [isLoginToggled, setIsLoginToggled] = useState<boolean>(false);

    const toggleMenu = () => {
        setIsMenuToggled(!isMenuToggled);
    };

    const toggleLogin = () => {
        setIsLoginToggled(!isLoginToggled);
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

    return (<nav className="md:w-full mx-auto relative flex items-center justify-between py-4 px-8 font-Inter">
        <Link to="/" className="z-40 transition duration-300 active:scale-95 flex items-center gap-2 max-md:mt-1">
            <img src={Logo} alt="Logo" className="w-6 h-6" />
            {isAboveMediumScreens &&
                <span className="transition duration-200 text-plum-100 text-xl font-extrabold brightness-200 tracking-wider">
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
                                    <Link
                                        onClick={toggleMenu}
                                        to="/profile">View Profile</Link>
                                    <Link
                                        onClick={toggleMenu}
                                        to="/gallery">Gallery</Link>
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
                    <button
                        onClick={toggleLogin}
                        className="text-plum brightness-200 px-4">
                        <FontAwesomeIcon icon={faUser} />
                    </button>
                )}
            </div>
        ) : (
            // Hamburger Menu
            <button className="flex items-center z-40" onClick={toggleMenu}>
                <div
                    className={`relative w-7 h-5 z-40 transform transition-transform duration-500 ease-in-out`}
                >
                    <span
                        className={`block absolute h-[2px] w-full bg-white/60 rounded-[9px] top-0 right-0 transition-all duration-250 ease-in-out`}
                    ></span>
                    <span
                        className={`block absolute h-[2px] w-3/4 top-[10px] bg-white/60 rounded-[9px] right-0 transition-all duration-250 ease-in-out`}
                    ></span>
                    <span
                        className={`block absolute h-[2px] w-1/2 bg-white/60 rounded-[9px] top-[20px] right-0 transition-all duration-250 ease-in-out`}
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
                        bg-dark/60 border border-plum backdrop-blur rounded-xl"
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
                        <button onClick={()=> {
                            toggleLogin();
                            toggleMenu();
                        }}>
                            <span>Sign In</span>
                        </button>
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

        {/* Authentication component */}
        {isLoginToggled && !user && (
            <Auth
                onClose={() => toggleLogin()}
            />
        )}
    </nav>
    )
}