import { faFacebook, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="bg-gradient-to-t from-dark/80 to-midnight/10 text-white py-12 font-Inter">
            <div className="container mx-auto px-4">
                {/* Top Section */}
                <div className="grid md:grid-cols-3 gap-8 items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold">PRISMATICA</h2>
                        <p className="text-sm mt-2">A dynamic digital art gallery for creative minds</p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex justify-center gap-4">
                        <a href="#hero" className="hover:underline">Home</a>
                        <a href="#about" className="hover:underline">About</a>
                        <a href="#functionality" className="hover:underline">Functionality</a>
                        <Link to="/gallery" className="hover:underline">Gallery</Link>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex justify-center md:justify-end gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} size="xl" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faXTwitter} size="xl" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} size="xl" />
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 mt-4"></div>

                {/* Bottom Section */}
                <div className="mt-4 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Prismatica. All rights reserved.</p>
                    <p>
                        Crafted with passion by <a href="https://nikolay-dimitrov.xyz" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Nikolay Dimitrov
                    </a>.
                    </p>
                </div>
            </div>
        </footer>
    );
};
