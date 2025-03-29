import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../context/AuthContext.tsx";
import { storage, db } from "../config/firebaseConfig";

export const AIArt = () => {
    const { user } = useContext(AuthContext);
    const [prompt, setPrompt] = useState("");
    const [imageData, setImageData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError(null);
        setImageData(null);

        try {
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'dall-e-2',
                    prompt: prompt.trim(),
                    n: 1,
                    size: "1024x1024",
                    response_format: "b64_json"
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            setImageData(data.data[0].b64_json);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate image");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!imageData || !user) return;

        try {
            // Convert base64 to Blob
            const byteCharacters = atob(imageData);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' });

            // Upload to Firebase
            const fileName = `ai-art-${Date.now()}.png`;
            const fileRef = ref(storage, `artworks/${user.uid}/${fileName}`);
            await uploadBytes(fileRef, blob);

            // Get download URL and save to Firestore
            const downloadURL = await getDownloadURL(fileRef);
            await addDoc(collection(db, "artworks"), {
                uid: user.uid,
                ownerName: user.displayName,
                fileName,
                downloadURL,
                prompt,
                isAIGenerated: true,
                createdAt: serverTimestamp()
            });

            toast.success("Artwork saved successfully!");
        } catch (error) {
            toast.error("Error saving artwork");
            console.error(error);
        }
    };

    if (!user) return null;

    const imageUrl = imageData ? `data:image/png;base64,${imageData}` : null;

    return (
        <motion.section
            id="ai-art"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto p-6 space-y-8"
        >
            <motion.h2
                className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
            >
                AI Art Generator
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label
                        htmlFor="prompt-input"
                        className="block text-lg font-medium text-gray-200"
                    >
                        Describe your imagination
                    </label>
                    <input
                        id="prompt-input"
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A futuristic cityscape at sunset..."
                        disabled={isLoading}
                        className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder-gray-400 disabled:opacity-50"
                    />
                </div>

                <motion.button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity relative"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Generating...
                        </div>
                    ) : (
                        "Create Art"
                    )}
                </motion.button>
            </form>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {imageUrl && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="space-y-4"
                    >
                        <motion.div
                            className="overflow-hidden shadow-xl w-11/12 mx-auto relative"
                        >
                            <img
                                src={imageUrl}
                                alt={`AI generated art for: ${prompt}`}
                                className="w-full h-auto object-cover rounded-xl"
                            />
                            <FontAwesomeIcon
                                icon={faFloppyDisk}
                                className="absolute top-2 right-2 text-white bg-dark/60 p-4 rounded-xl cursor-pointer
                                 hover:bg-dark/90 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                onClick={handleSave}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
};