import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, Timestamp, where } from "firebase/firestore";

import { db } from "../config/firebaseConfig.ts";

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
    commentsCount: number;
}

export const useGallery = (userId?: string | null) => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const artworksRef = collection(db, "artworks");
        let q;
        if (userId) {
            q = query(artworksRef, where("uid", "==", userId));
        } else {
            q = query(artworksRef);
        }

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const promises = querySnapshot.docs.map(async (doc) => {
                const artData = doc.data();
                const commentsRef = collection(db, "artworks", doc.id, "comments");
                const commentsSnap = await getDocs(commentsRef);

                return {
                    id: doc.id,
                    ...artData,
                    commentsCount: commentsSnap.size,
                };
            });

            const artworksData = await Promise.all(promises);

            setArtworks(artworksData as Artwork[]);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    return { artworks, setArtworks, loading }
};