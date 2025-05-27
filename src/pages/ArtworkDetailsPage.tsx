import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrashCan,
    faFloppyDisk,
    faCircleUser,
    faPenToSquare, faX
} from "@fortawesome/free-solid-svg-icons";
import { faCircleDown, faComment, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../context/AuthContext";
import { useArtwork } from "../hooks/useArtwork";

export const ArtworkDetails = () => {
    const { id } = useParams<{ id: string }>();

    const {
        artwork,
        deleteArtwork,
        loading,
        error,
        toggleLike,
        addComment,
        comments,
        updateLabel,
        updateDescription
    } = useArtwork(id);
    const { user } = useContext(AuthContext);

    // States for comment input
    const [commentText, setCommentText] = useState("");
    const [, setLocalError] = useState("");

    // States for label
    const [editMode, setEditMode] = useState(false);
    const [newLabel, setNewLabel] = useState(artwork?.label || "");
    const [, setLabelError] = useState("");

    // States for description
    const [newDescription, setNewDescription] = useState(artwork?.description || "");
    const [, setDescriptionError] = useState("");

    if (loading) return <p className="text-center text-white mt-10 text-xl">Loading artwork...</p>;
    if (error) return <p className="text-center text-red-500 mt-10 text-xl">Error: {error}</p>;
    if (!artwork) return <p className="text-center text-white mt-10 text-xl">Artwork not found.</p>;

    const isOwner = user?.uid === artwork.uid;
    const hasLiked = artwork.likes?.includes(user?.uid || "");

    const handleSaveLabel = async () => {
        // Validate label
        if (newLabel.length > 100) {
            setLabelError("Label cannot exceed 100 characters.");
            return;
        }

        try {
            await updateLabel(newLabel.trim());
            setLabelError("");
        } catch (err) {
            setLabelError("Failed to update label. Please try again.");
            console.error("Error updating label: ", err);
        }
    };

    const handleSaveDescription = async () => {
        // Validate description
        if (newDescription.length > 1000) {
            setDescriptionError("Description cannot exceed 1000 characters.");
            return;
        }
        try {
            await updateDescription(newDescription);
            artwork.description = newDescription.trim();
            setDescriptionError("");
        } catch (err) {
            setDescriptionError("Failed to update description. Please try again.");
            console.error("Error updating description: ", err);
        }
    };

    const handleSaveEdit = async () => {
        if (!artwork) return;
        await handleSaveLabel();
        await handleSaveDescription();
        setEditMode(false);
    };

    const handleCancelEdit = () => {
        setNewLabel(artwork.label || "");
        setNewDescription(artwork.description || "");
        setEditMode(false);
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate comment text
        if (!commentText || commentText.trim() === "") {
            setLocalError("Comment cannot be empty.");
            return;
        }
        if (commentText.length > 500) {
            setLocalError("Comment cannot exceed 500 characters.");
            return;
        }
        try {
            await addComment(commentText);
            setCommentText("");
            setLocalError("");
        } catch (err) {
            setLocalError("Failed to add comment. Please try again.");
            console.error("Error adding comment:", err);
        }
    };

    const formatTimeAgo = (date: Date) => {
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return "just now"
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        return `${Math.floor(diffInSeconds / 86400)}d ago`
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

    return (
        <section id="artwork-deails" className="w-11/12 mx-auto p-4 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Image Section */}
                <div className="lg:col-span-2">
                    <div className="relative bg-charcoal rounded-lg overflow-hidden">
                        <img
                            src={artwork.downloadURL}
                            alt={artwork.fileName}
                        />
                        {/* AI/User Tag */}
                        <div className="absolute left-4 top-4">
                            <span className="bg-neutral/80 text-white/80 text-xs rounded-sm py-1 px-2">
                                {artwork.isAIGenerated ? 'AI Generated' : 'User Created'}
                            </span>
                        </div>
                        {/* Utility Buttons */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            {/* Download Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(artwork.downloadURL, artwork.fileName || "artwork.jpg");
                                }}
                                className="py-1 px-2 bg-charcoal/60 text-white/80 rounded-lg">
                                <FontAwesomeIcon icon={faCircleDown} />
                            </button>
                            {/* Delete Button */}
                            <button
                                onClick={async () => {
                                    await deleteArtwork(artwork.id);
                                }}
                                hidden={!isOwner}
                                disabled={!isOwner}
                                className="py-1 px-2 bg-charcoal/60 text-white/80 rounded-lg"
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 p-4 bg-charcoal rounded-lg">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleLike}
                                disabled={isOwner}
                                className={`hover:text-red-400 hover:bg-dark p-2 rounded-lg
                                ${hasLiked ? 'text-red-400' : 'text-white/60'}`}
                            >
                                <FontAwesomeIcon
                                    icon={hasLiked ? faSolidHeart : faHeart}
                                    className="mr-2"
                                />
                                <span className="text-sm">{artwork.likes?.length ?? 0} likes</span>
                            </button>
                            <div className="flex items-center text-white/60">
                                <FontAwesomeIcon icon={faComment} className="mr-2" />
                                <span className="text-sm">{comments.length ?? 0} comments</span>
                            </div>
                        </div>
                        <div className="text-sm text-white/60">
                            {formatTimeAgo(artwork.createdAt!.toDate())}
                        </div>
                    </div>
                </div>
                {/* Details Section */}
                <div className="space-y-6">
                    {/* Owner Info */}
                    <div className="bg-charcoal rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faCircleUser} size='2xl' className="text-white" />
                                <div>
                                    <h3 className="font-semibold text-white">{artwork.ownerName}</h3>
                                    <p className="text-sm text-gray-400">Artist</p>
                                </div>
                            </div>
                            {isOwner && !editMode && (
                                <button
                                    className="text-white/80 hover:text-neutral"
                                    onClick={() => {
                                        setNewLabel(artwork.label || "");
                                        setNewDescription(artwork.description || "");
                                        setEditMode(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                </button>
                            )}
                        </div>

                        {/* Label and Description */}
                        {editMode ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Label</label>
                                    <input
                                        value={newLabel}
                                        onChange={(e) => setNewLabel(e.target.value)}
                                        className="bg-dark border border-neutral text-white
                                        p-2 rounded-lg w-full
                                        focus:outline-white/80"
                                        placeholder="Artwork label..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <textarea
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        className="bg-dark border border-neutral text-white
                                        resize-none p-2 rounded-lg w-full
                                        focus:outline-white/80"
                                        placeholder="Add a description..."
                                        rows={6}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleSaveEdit}
                                            className="bg-[#894389] text-dark hover:bg-[#894389]/80
                                            py-2 px-4 rounded-lg flex items-center gap-2 text-sm">
                                        <FontAwesomeIcon
                                            icon={faFloppyDisk}
                                        />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="bg-dark border border-neutral text-white hover:bg-neutral/20
                                        py-2 px-4 rounded-lg flex items-center gap-2 text-sm"
                                    >
                                        <FontAwesomeIcon
                                            icon={faX}
                                        />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-3">{artwork.label}</h1>
                                {artwork.description && (
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{artwork.description}</p>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Comment Section */}
                    <div className="bg-charcoal rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Comments ({comments.length ?? 0})
                        </h2>

                        {/* Add Comment */}
                        {user && (
                            <form onSubmit={handleAddComment} className="mb-6">
                                <div className="flex gap-3">
                                    <FontAwesomeIcon icon={faCircleUser} size='2xl' className="text-white" />
                                    <div className="flex-1 space-y-2">
                                        <textarea
                                            placeholder="Write a comment..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            className="resize-none w-full flex-1 p-2 bg-dark text-white text-sm
                                            rounded-md border border-gray-600 focus:outline-white/80"
                                            rows={3}
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                disabled={!user || commentText.length === 0}
                                                className={`bg-dark border border-neutral text-white
                                                    py-2 px-8 rounded-lg flex items-center gap-2 text-sm
                                                    ${commentText.length === 0 ? '' : 'hover:bg-neutral/20'}
                                                    `}
                                            >
                                                Post
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* Comments List */}
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                    <FontAwesomeIcon icon={faCircleUser} size='2xl' className="text-white" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`font-medium
                                                ${comment.uid === user?.uid ? 'text-plum brightness-200' : 'text-white'}   
                                            `}>
                                                {comment.ownerName}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {formatTimeAgo(comment.createdAt!.toDate())}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 break-words">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
