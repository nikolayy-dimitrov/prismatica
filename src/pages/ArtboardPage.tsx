import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

import { storage, db } from "../config/firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import { AIArt } from "../components/AIArt.tsx";

export const Artboard = () => {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!user) {
            console.error("User is not authenticated.");
            toast.error("User is not authenticated");
            navigate('/sign-up');
            return;
        }
        try {
            // Create a unique file name
            const fileName = file.name + "_" + new Date().getTime().toString();
            // Create a storage reference based on the user's UID and file name
            const fileRef = ref(storage, 'artworks/${user.uid}/${fileName}');
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
            <div className="flex flex-col gap-8 md:w-8/12 max-md:w-11/12">
                <AIArt />
                <div className="relative md:w-10/12 max-md:w-full mx-auto">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-plum/60"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-black px-4 text-xs text-white/60">or</span>
                    </div>
                </div>
                <div className="flex max-md:flex-col items-center justify-center gap-4">
                    {/* Option 1: Upload Artwork */}
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-charcoal/40
                        border border-plum/80 rounded-lg py-2 md:px-12 max-md:px-20
                        hover:bg-charcoal/30 transition-colors duration-200
                        "
                    >
                        <h2 className="text-md font-medium text-plum brightness-200">
                            Upload Artwork
                        </h2>
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
                        className="cursor-pointer bg-charcoal/40
                        border border-plum/80 rounded-lg py-2 md:px-12 max-md:px-20
                        hover:bg-charcoal/30 transition-colors duration-200
                        "
                    >
                        <h2 className="text-md font-medium text-plum brightness-200">
                            Create Artwork
                        </h2>
                    </Link>
                </div>
            </div>
        </motion.section>
    );
};
