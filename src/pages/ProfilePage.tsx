import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faListUl, faMagnifyingGlass, faPlus, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { faCircleDown, faComment, faEye, faHeart } from "@fortawesome/free-regular-svg-icons";

import { AuthContext } from "../context/AuthContext.tsx";
import { useGallery } from "../hooks/useGallery.ts";

export const Profile = () => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [filterType, setFilterType] = useState<"all" | "generated" | "created">("all")

    const { user } = useContext(AuthContext);
    const { artworks , loading } = useGallery(user?.uid);

    const filteredArtworks = artworks.filter((artwork) => {
        const matchesSearch =
            artwork.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            artwork.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter =
            filterType === "all" ||
            (filterType === "generated" && artwork.isAIGenerated) ||
            (filterType === "created" && !artwork.isAIGenerated);
        return matchesSearch && matchesFilter
    });

    const getTypeLabel = (ai: boolean) => {
        let type;
        if (ai) {
            type = "generated";
        } else {
            type = "created";
        }
        switch (type) {
            case "generated":
                return "AI Generated"
            case "created":
                return "Created"
            default:
                return "Uploaded"
        }
    };

    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return "just now"
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        return `${Math.floor(diffInSeconds / 86400)}d ago`
    };

    if (!user) return;
    if (loading) return <p className="text-white mt-20 text-center font-semibold text-2xl">Loading profile...</p>;

    return <section
        id="gallery"
        className="container mx-auto px-4 py-8 text-white">
        <div className="bg-[#2E2E2E] rounded-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <FontAwesomeIcon icon={faCircleUser} className="w-24 h-24" />
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                        <button className="bg-plum-100 text-dark hover:bg-plum-100/80 mt-4 sm:mt-0 py-2 px-4 rounded-lg">
                            Edit Profile
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span>📅 Joined {user.metadata.creationTime}</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral/30">
                <div className="text-center">
                    <div className="text-2xl font-bold text-plum-100">{artworks.length}</div>
                    <div className="text-sm text-gray-400">Artworks</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-plum-100">0</div>
                    <div className="text-sm text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-plum-100">0</div>
                    <div className="text-sm text-gray-400">Following</div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-white">My Artworks</h2>
                    <Link
                        to="/"
                        className="bg-plum-100 text-dark hover:bg-plum-100/80 py-2 px-4 rounded-lg">
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Create New
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            placeholder="Search artworks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-charcoal border border-neutral text-white
                            w-64 p-2 rounded-lg focus:outline-plum-100"
                        />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-charcoal rounded-lg p-1">
                        <button
                            className={`h-8 w-8 rounded-lg 
                            ${viewMode === "grid" ? "bg-plum-100 text-dark" : "text-gray-400 hover:bg-midnight"}`}
                            onClick={() => setViewMode("grid")}
                        >
                            <FontAwesomeIcon icon={faTableCells} />
                        </button>
                        <button
                            className={`h-8 w-8 rounded-lg
                            ${viewMode === "list" ? "bg-plum-100 text-dark" : "text-gray-400 hover:bg-midnight"}`}
                            onClick={() => setViewMode("list")}
                        >
                            <FontAwesomeIcon icon={faListUl} />
                        </button>
                    </div>
                </div>
            </div>
            {/* Filter Tabs */}
            <div className="flex">
                <div className="bg-charcoal p-1 rounded-lg flex items-center gap-2">
                    <button
                        onClick={() => setFilterType("all")}
                        className={`px-4 py-2 rounded-md ${
                            filterType === "all"
                                ? "bg-plum-100 text-white/80" : "text-neutral/80 hover:bg-midnight/80"
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterType("generated")}
                        className={`px-4 py-2 rounded-md ${
                            filterType === "generated"
                                ? "bg-plum-100 text-white/80" : "text-neutral/80 hover:bg-midnight/80"
                        }`}
                    >
                        AI Generated
                    </button>
                    <button
                        onClick={() => setFilterType("created")}
                        className={`px-4 py-2 rounded-md ${
                            filterType === "created"
                                ? "bg-plum-100 text-white/80" : "text-neutral/80 hover:bg-midnight/80"
                        }`}
                    >
                        User Created
                    </button>
                </div>
            </div>
            <div>
                {/* Grid View */}
                {viewMode === "grid" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredArtworks.map((artwork) => (
                            <Link key={artwork.id} to={`/gallery/${artwork.id}`}>
                                <div className="md:h-[375px] h-full bg-charcoal rounded-lg overflow-hidden hover:border-plum-100/30 border border-transparent transition-colors group">
                                    <div className="relative aspect-square bg-dark">
                                        <img
                                            src={artwork.downloadURL}
                                            alt={artwork.description}
                                            className="h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-2 left-2">
                                            <span className="bg-dark/80 text-white/80 text-xs px-2 py-1 rounded">
                                              {getTypeLabel(artwork.isAIGenerated)}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 group-hover:scale-105 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <FontAwesomeIcon icon={faEye} />
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-white truncate">
                                            {!artwork.label?.trim() ? 'Artwork' : artwork.label }
                                        </h3>
                                        <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                                            <span>{formatTimeAgo(artwork.createdAt!.toDate())}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faHeart} />
                                                    {artwork.likes?.length ?? 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faComment} />
                                                    {artwork.commentsCount ?? 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {/* List View */}
                {viewMode === "list" && (
                    <div className="space-y-4 flex flex-col gap-1">
                        {filteredArtworks.map((artwork) => (
                            <Link key={artwork.id} to={`/gallery/${artwork.id}`}>
                                <div className="bg-charcoal rounded-lg p-4 hover:border-plum-100/30 border border-transparent transition-colors group">
                                    <div className="flex gap-4">
                                        <div className="relative w-20 h-20 bg-dark rounded-lg overflow-hidden flex-shrink-0 m-auto">
                                            <img
                                                src={artwork.downloadURL}
                                                alt={artwork.description}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-1 left-1">
                                                <span className="bg-dark/80 text-white/80 text-xs px-1 py-0.5 rounded">
                                                    {getTypeLabel(artwork.isAIGenerated).split(" ")[0]}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 my-auto">
                                            <div className="flex items-center justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-white truncate">
                                                        {!artwork.label?.trim() ? 'Artwork' : artwork.label }
                                                    </h3>
                                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{artwork.description}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                                        <span>{formatTimeAgo(artwork.createdAt!.toDate())}</span>
                                                        <span className="flex items-center gap-1">
                                                            <FontAwesomeIcon icon={faHeart} />
                                                            {artwork.likes?.length}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <FontAwesomeIcon icon={faComment} />
                                                            {artwork.commentsCount}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDownload(artwork.downloadURL, artwork.fileName || "artwork.jpg");
                                                        }}
                                                        className="h-8 w-8 text-gray-400 hover:text-plum-100"
                                                    >
                                                        <FontAwesomeIcon icon={faCircleDown} size="lg" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {filteredArtworks.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            {searchQuery ? "No artworks match your search." : "No artworks found."}
                        </div>
                        <button className="bg-plum-100 text-dark hover:bg-plum-100/80 py-2 px-4 rounded-lg">
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Create Your First Artwork
                        </button>
                    </div>
                )}
            </div>
        </div>
    </section>
}