import { useEffect, useState, useContext } from "react";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs, deleteDoc, addDoc, Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { db } from "../config/firebaseConfig";
import { AuthContext } from "../context/AuthContext.tsx";

interface Comment {
    id: string;
    uid: string;
    text: string;
    createdAt: Timestamp;
    ownerName?: string;
}

interface Artwork {
    id: string;
    uid: string;
    fileName: string;
    downloadURL: string;
    label?: string;
    description?: string;
    ownerName?: string;
    likes?: string[];
    createdAt?: Timestamp;
    prompt: string;
    isAIGenerated: boolean;
}

export const useArtwork = (artworkId: string | undefined) => {
    const { user } = useContext(AuthContext);

    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);

    const userId = user?.uid;

    const navigate = useNavigate();

    useEffect(() => {
        if (!artworkId) {
            setLoading(false);
            return;
        }

        const fetchArtwork = async () => {
            try {
                const docRef = doc(db, "artworks", artworkId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setArtwork({ id: docSnap.id, ...docSnap.data() } as Artwork);
                } else {
                    setError("Artwork not found");
                }
            } catch (err) {
                setError("Failed to fetch artwork");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                const commentsRef = collection(db, "artworks", artworkId, "comments");
                const querySnapshot = await getDocs(commentsRef);
                const fetchedComments = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Comment[];
                setComments(fetchedComments);
            } catch (err) {
                console.error("Failed to fetch comments", err);
            }
        };

        fetchArtwork();
        fetchComments();
    }, [artworkId]);

    const toggleLike = async () => {
        if (!userId || !artwork || !artworkId) return;

        const docRef = doc(db, "artworks", artworkId);
        const updatedLikes = artwork.likes?.includes(userId)
            ? arrayRemove(userId)
            : arrayUnion(userId);

        try {
            await updateDoc(docRef, { likes: updatedLikes });
            setArtwork((prev) => prev ? { ...prev, likes: prev.likes?.includes(userId) ? prev.likes.filter(id => id !== userId) : [...(prev.likes ?? []), userId] } : prev);
        } catch (err) {
            console.error("Error updating likes:", err);
        }
    };

    const addComment = async (text: string) => {
        if (!userId || !artworkId || !text) return;

        const newComment: Omit<Comment, "id"> = {
            uid: userId,
            text,
            createdAt: Timestamp.now(),
            ownerName: user?.displayName || "Anonymous",
        };

        try {
            const docRef = await addDoc(collection(db, "artworks", artworkId, "comments"), newComment);

            setComments((prev) => [...prev, { id: docRef.id, ...newComment }]);
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };

    const deleteComment = async (artworkId: string, commentId: string) => {
        if (!user) return;

        try {
            await deleteDoc(doc(db, "artworks", artworkId, "comments", commentId));
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
            toast.success("Comment deleted successfully!");
        } catch (error) {
            console.error("Error deleting comment:", error, commentId);
            toast.error("Error deleting comment.");
        }
    };

    const updateLabel = async (label: string) => {
        if (!user || !label || !artworkId) return;

        if (label !== artwork?.label) {
            try {
                const artworkRef = doc(db, "artworks", artworkId);
                await updateDoc(artworkRef, { label: label });
            } catch (error) {
                console.error("Error updating label:", error);
                toast.error("Error updating label.");
            }
        }
    };

    const updateDescription = async (description: string) => {
        if (!user || !description || !artworkId) return;

        if (description !== artwork?.description) {
            try {
                const artworkRef = doc(db, "artworks", artworkId);
                await updateDoc(artworkRef, { description: description });
            } catch (error) {
                console.error("Error updating description:", error);
                toast.error("Error updating description:");
            }
        }
    };

    const deleteArtwork = async (artworkId: string) => {
        if (!user || !artwork || (userId !== artwork.uid)) return;

        try {
            await deleteDoc(doc(db, "artworks", artworkId));
            setArtwork(null);
            toast.success("Artwork deleted successfully!");
            navigate(-1);
        } catch (error) {
            console.error("Error deleting artwork:", error);
            toast.error("Error deleting artwork.");
        }
    };

    return {
        artwork,
        deleteArtwork,
        loading,
        error,
        toggleLike,
        addComment,
        deleteComment,
        comments,
        updateLabel,
        updateDescription
    };
};
