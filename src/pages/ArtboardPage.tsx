import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { storage, db } from "../config/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const Artboard = () => {
    const { user } = useContext(AuthContext);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!user) {
            console.error("User is not authenticated.");
            return;
        }
        try {
            // Create a unique file name
            const fileName = file.name + "_" + new Date().getTime().toString();
            // Create a storage reference based on the user's UID and file name
            const fileRef = ref(storage, `artworks/${user.uid}/${fileName}`);
            // Upload the file to Firebase Storage
            const snapshot = await uploadBytes(fileRef, file);
            // Get the downloadable URL of the uploaded file
            const downloadURL = await getDownloadURL(snapshot.ref);
            // Save file metadata and user UID to Firestore
            await addDoc(collection(db, "artworks"), {
                uid: user.uid,
                fileName,
                downloadURL,
                createdAt: serverTimestamp(),
            });
            console.log("File uploaded successfully");
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <motion.section
            id="artboard"
            className="max-h-full md:mt-40 max-md:mt-20 mx-auto flex flex-col items-center justify-center text-white/80 px-4"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, y: -50 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-b from-plum to-midnight bg-clip-text text-transparent brightness-200">
                Create Your Masterpiece
            </h1>
            <div className="flex flex-col justify-center items-center sm:flex-row gap-8">
                {/* Option 1: Upload Artwork */}
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-gradient-to-tl from-plum to-midnight
            border-t-2 border-l-2 border-b-4 border-r-4 border-t-midnight/40 border-l-midnight/40 border-plum
            shadow-lg rounded-3xl p-8 md:w-1/3"
                >
                    <h2 className="text-2xl font-semibold mb-4">Upload Artwork</h2>
                    <p className="mb-4">
                        Select an artwork file from your device to showcase your art.
                    </p>
                    {/* Hidden input triggers the file selection */}
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </label>
                {/* Option 2: Create New Artwork */}
                <Link
                    to="/create"
                    className="bg-gradient-to-tl from-plum to-midnight
            border-t-2 border-l-2 border-b-4 border-r-4 border-t-midnight/40 border-l-midnight/40 border-plum
            shadow-lg rounded-3xl p-8 md:w-1/3"
                >
                    <h2 className="text-2xl font-semibold mb-4">Create New Artwork</h2>
                    <p className="mb-4">
                        Start a new creation using our digital tools and express your vision.
                    </p>
                </Link>
            </div>
        </motion.section>
    );
};
