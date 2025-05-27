import { Link } from "react-router-dom";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faCircleUser, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faComment, faCircleDown } from "@fortawesome/free-regular-svg-icons";

import { useAllArtworks } from "../hooks/useGallery.ts";
import { AuthContext } from "../context/AuthContext.tsx";

export const Gallery = () => {
    const { artworks , loading } = useAllArtworks();
    const { user } = useContext(AuthContext);

    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <p className="text-white mt-20 text-center font-semibold text-2xl">Loading artworks...</p>;

    return <section
        id="gallery"
        className="container mx-auto px-4 py-8 font-Inter">
        <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, ease: "easeOut"}}
        >
            {artworks.map((art) => (
                <div
                    key={art.id}
                    className="flex flex-col justify-between min-h-[400px]
                    transition duration-300 hover:border-plum/60
                    border border-transparent rounded-lg
                    bg-gradient-to-br from-neutral/20 to-charcoal/20 bg-clip-border drop-shadow-lg"
                >
                    <div className="relative">
                        {/* AI/User Tag */}
                        <div className="absolute top-0 left-0 p-2">
                            <span className="bg-neutral/80 text-white/80 text-xs rounded-sm py-1 px-2">
                                {art.isAIGenerated ? 'AI Generated' : 'User Created'}
                            </span>
                        </div>
                        {/* Download Button */}
                        <div className="absolute top-0 right-0 p-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(art.downloadURL, art.fileName || "artwork.jpg");
                                }}
                                className="py-1 px-2 bg-charcoal/60 text-white/80 rounded-lg">
                                <FontAwesomeIcon icon={faCircleDown} size='lg' />
                            </button>
                        </div>
                        <Link
                            to={`/gallery/${art.id}`}
                        >
                            <img
                                src={art.downloadURL}
                                alt={art.fileName}
                                className="w-full h-64 object-cover rounded-t-lg"
                            />
                        </Link>
                        <div className="p-4 flex flex-col gap-4 flex-grow">
                            <div className="flex items-center justify-between text-white gap-3">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCircleUser} size='2xl'/>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">
                                            {art.ownerName}
                                        </span>
                                        <span className="text-xs font-light text-neutral/70">
                                            {art.createdAt!.toDate().toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                {art.uid === user?.uid &&
                                    <Link
                                        to={`/gallery/${art.id}`}
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare} className="text-neutral/70" />
                                    </Link>
                                }
                            </div>
                            <div className="text-white">
                                <h3 className="font-medium mb-1 text-lg">{art.label}</h3>
                                <p className="font-light text-white/60 text-sm">{art.description}</p>
                            </div>
                            <div
                                className="border-t border-charcoal/60
                                flex items-center justify-start gap-4
                                text-neutral px-2 py-4 mt-auto">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faHeart} />
                                    <span className="text-xs">{art.likes?.length ?? 0}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faComment} />
                                    <span className="text-xs">{art.commentsCount ?? 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </motion.div>
    </section>;
}