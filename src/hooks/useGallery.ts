import { useEffect, useState } from "react";
import { collection, onSnapshot, query, Timestamp, where } from "firebase/firestore";

import { db } from "../config/firebaseConfig.ts";

interface Artwork {
    id: string;
    uid: string;
    fileName: string;
    downloadURL: string;
    createdAt: Timestamp;
}

export const useGallery = (userId: string | undefined) => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const artworksRef = collection(db, "artworks");
        const q = query(artworksRef, where("uid", "==", userId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const artworksData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Artwork[];

            setArtworks(artworksData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    return { artworks, setArtworks, loading }
}