import { useContext } from "react";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../config/firebaseConfig";
import { AuthContext } from "../context/AuthContext";

export const useFirebaseArtwork = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    const { user } = useContext(AuthContext);

    const handleUpload = async () => {
        if (!canvasRef.current || !user) return;

        canvasRef.current.toBlob(
            async (blob) => {
                if (!blob) return;

                try {
                    const fileName = `${Date.now()}.png`;
                    const fileRef = ref(storage, `artworks/${user.uid}/${fileName}`);
                    await uploadBytes(fileRef, blob);
                    const downloadURL = await getDownloadURL(fileRef);

                    await addDoc(collection(db, "artworks"), {
                        uid: user.uid,
                        fileName,
                        downloadURL,
                        createdAt: serverTimestamp(),
                    });

                    toast.success("Artwork uploaded successfully!");
                    handleClear();
                } catch (error) {
                    toast.error("Error uploading artwork");
                    console.error(error);
                }
            },
            "image/png",
            1
        );
    };

    const handleClear = () => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx || !canvasRef.current) return;

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    return { handleUpload, handleClear };
};