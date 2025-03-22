import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faTrashCan, faCheck } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import { useArtwork } from "../hooks/useArtwork";

export const ArtworkDetails = () => {
    const { id } = useParams<{ id: string }>();

    const { artwork, deleteArtwork, loading, error, toggleLike, addComment, deleteComment, comments, updateLabel } = useArtwork(id);
    const { user } = useContext(AuthContext);

    const [commentText, setCommentText] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [newLabel, setNewLabel] = useState(artwork?.label || "");

    if (loading) return <p className="text-center text-white mt-10 text-xl">Loading artwork...</p>;
    if (error) return <p className="text-center text-red-500 mt-10 text-xl">Error: {error}</p>;
    if (!artwork) return <p className="text-center text-white mt-10 text-xl">Artwork not found.</p>;

    const isOwner = user?.uid === artwork.uid;

    const handleSaveLabel = async () => {
        await updateLabel(newLabel);
        artwork.label = newLabel;
        setEditMode(false);
    };

    return (
        <section id="artwork-details" className="max-w-4xl mx-auto p-4 mt-8">
            <div className="flex items-center justify-center py-3">
                {editMode ? (
                    <div className="flex items-center justify-center gap-2 w-full">
                        <input
                            type="text"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            className="flex items-center py-1 px-2 bg-dark text-white text-2xl text-center"
                        />
                        <button onClick={handleSaveLabel} className="py-1 px-2 bg-neutral text-dark text-sm rounded-xl">
                            <FontAwesomeIcon icon={faCheck} />
                        </button>
                    </div>
                ) : (
                    <button
                        disabled={!isOwner}
                        onClick={() => {
                            setNewLabel(artwork.label || "");
                            setEditMode(true);
                        }}
                    >
                        <span
                            className="text-3xl text-center font-bold tracking-widest text-gray-300"
                        >
                            {artwork.label || (!artwork.label && isOwner && 'Label')}
                        </span>
                    </button>
                )}
            </div>
            <img
                src={artwork.downloadURL}
                alt={artwork.fileName}
                className="w-auto h-96 mx-auto object-contain mb-4 p-0.5 rounded-md border-2 border-white/80 drop-shadow bg-gradient-to-tl from-midnight/10 to-neutral/5"
            />
            <div className="space-y-2 text-white w-11/12 mx-auto">
                {artwork.description && <p>{artwork.description}</p>}
                <div className="flex items-center justify-between">
                    <div className="flex justify-center items-center gap-4 text-2xl text-neutral brightness-200">
                        <button
                            onClick={toggleLike}
                            disabled={isOwner}
                        >
                            <FontAwesomeIcon icon={faThumbsUp} />
                        </button>
                        <span>{artwork.likes?.length ?? 0}</span>
                    </div>
                    <div>
                        <button
                            onClick={() => deleteArtwork(artwork.id)}
                            hidden={!isOwner}
                            disabled={!isOwner}
                        >
                            <FontAwesomeIcon icon={faTrashCan} className="text-red-800 text-xl" />
                        </button>
                    </div>
                </div>
                {artwork.ownerName && <p className="text-gray-300">By: {artwork.ownerName}</p>}

                {/* Comments Section */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Comments</h2>
                    <div className="space-y-4">
                        {comments.map(comment => (
                            <div key={comment.id} className="border border-gray-500 p-2 rounded-md">
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-400">
                                        {comment.ownerName}
                                        {comment.uid === artwork.uid && <span> &#32;• Author</span>}
                                    </p>
                                    <button
                                        onClick={() => deleteComment(artwork.id, comment.id)}
                                        hidden={!(user?.uid === comment.uid)}
                                        className="text-sm text-neutral/80 px-1"
                                    >
                                        X
                                    </button>
                                </div>
                                <p className="text-lg">{comment.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="flex-1 p-2 bg-charcoal text-white rounded-md border border-gray-600 focus:border-white"
                        />
                        <button
                            onClick={() => {
                                addComment(commentText);
                                setCommentText("");
                            }}
                            className="bg-gradient-to-br from-charcoal/40 to-neutral/20 border px-8 py-2 rounded-md"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
