import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { AuthContext } from "../context/AuthContext.tsx";
import { useGallery } from "../hooks/useGallery.ts";

export const Profile = () => {
    const { user } = useContext(AuthContext);
    const { artworks , loading } = useGallery(user?.uid);

    if (loading) return <p className="text-white mt-20 text-center font-semibold text-2xl">Loading profile...</p>;

    return <section
        id="gallery"
        className="container mx-auto px-4 py-8 font-Inter">
        <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, ease: "easeOut"}}
        >
            {artworks.map((art) => (
                <Link
                    key={art.id}
                    to={`/gallery/${art.id}`}
                    className="transition duration-300 hover:scale-105
                    border border-transparent bg-gradient-to-br from-neutral/20 to-charcoal/20 bg-clip-border drop-shadow-lg"
                >
                    <img
                        src={art.downloadURL}
                        alt={art.fileName}
                        className="w-full h-64 object-cover" />
                </Link>
            ))}
        </motion.div>
    </section>
}