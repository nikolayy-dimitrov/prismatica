import { useContext, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { AuthContext } from "../context/AuthContext.tsx";
import { storage, db } from "../config/firebaseConfig.ts";

// Types for API requests
interface ImageGenerationRequest {
    model: string;
    prompt: string;
    n: number;
    size: string;
    response_format: string;
}

export const AIArt = () => {
    const { user } = useContext(AuthContext);
    const [prompt, setPrompt] = useState("");
    const [imageData, setImageData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFollowUp, setIsFollowUp] = useState(false);
    const [followUpPrompt, setFollowUpPrompt] = useState("");
    const [previousPrompt, setPreviousPrompt] = useState("");
    const [generationHistory, setGenerationHistory] = useState<string[]>([]);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Create a canvas element for image processing
    useEffect(() => {
        if (!canvasRef.current) {
            canvasRef.current = document.createElement('canvas');
        }
    }, []);

    // Function to convert base64 to PNG with transparency
    const convertToRGBA = (base64Image: string): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current!;
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d')!;

                // Fill with white background to ensure alpha channel
                ctx.fillStyle = 'rgba(255, 255, 255, 0)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw the image
                ctx.drawImage(img, 0, 0);

                // Convert to blob with PNG format (which supports transparency)
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to convert image to RGBA format'));
                    }
                }, 'image/png');
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = `data:image/png;base64,${base64Image}`;
        });
    };

    const generateInitialImage = async (initialPrompt: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const requestBody: ImageGenerationRequest = {
                model: 'dall-e-2',
                prompt: initialPrompt.trim(),
                n: 1,
                size: "1024x1024",
                response_format: "b64_json"
            };

            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            setImageData(data.data[0].b64_json);

            // Add the prompt to history
            setGenerationHistory([initialPrompt]);
            setPreviousPrompt(initialPrompt);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate image");
        } finally {
            setIsLoading(false);
        }
    };

    const editImage = async (editPrompt: string) => {
        if (!imageData) return;

        setIsLoading(true);
        setError(null);

        try {
            // Convert base64 to RGBA format Blob
            const imageBlob = await convertToRGBA(imageData);

            // Need a mask image (white with transparency where changes should be allowed)
            // For now, using a transparent mask to allow changes anywhere
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = 1024;
            maskCanvas.height = 1024;
            const maskCtx = maskCanvas.getContext('2d')!;
            maskCtx.fillStyle = 'rgba(255, 255, 255, 0.001)'; // Nearly transparent white
            maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

            // Convert mask to blob
            const maskBlob = await new Promise<Blob>((resolve) => {
                maskCanvas.toBlob((blob) => {
                    resolve(blob!);
                }, 'image/png');
            });

            // Create FormData for the edit request
            const formData = new FormData();
            formData.append('image', imageBlob, 'image.png');
            formData.append('mask', maskBlob, 'mask.png');
            formData.append('prompt', editPrompt.trim());
            formData.append('n', '1');
            formData.append('size', '1024x1024');
            formData.append('response_format', 'b64_json');

            const response = await fetch("https://api.openai.com/v1/images/edits", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            setImageData(data.data[0].b64_json);

            // Add the prompt to history
            setGenerationHistory(prev => [...prev, editPrompt]);
            setPreviousPrompt(editPrompt);

            // Return to main UI
            setIsFollowUp(false);
            setFollowUpPrompt("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to edit image");
            console.error("Error details:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        // Reset state for a new generation
        setGenerationHistory([]);
        setPreviousPrompt("");
        setImageData(null);

        await generateInitialImage(prompt);
    };

    const handleFollowUpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!followUpPrompt.trim()) return;

        await editImage(followUpPrompt);
    };

    const handleFollowUpClick = () => {
        if (imageData) {
            setIsFollowUp(true);
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
                prompt: generationHistory.length > 0 ? generationHistory[generationHistory.length - 1] : prompt,
                promptHistory: generationHistory,
                isAIGenerated: true,
                createdAt: serverTimestamp()
            });

            toast.success("Artwork saved successfully!");
        } catch (error) {
            toast.error("Error saving artwork");
            console.error(error);
        }
    };

    const imageUrl = imageData ? `data:image/png;base64,${imageData}` : null;

    return (
        <motion.section
            id="ai-art"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl w-full mx-auto p-2 space-y-8 mt-12"
        >

            {!isFollowUp ? (
                <>
                    <motion.h2
                        className="text-4xl font-bold text-center mb-4 text-plum brightness-200"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                    >
                        AI Art Generator
                    </motion.h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="prompt-input"
                                className="block text-md font-light text-gray-200/80"
                            >
                                Describe your imagination
                            </label>
                            <div className="flex items-center justify-between
                            border border-plum focus:border-midnight focus:ring-2 focus:ring-midnight
                            transition-all rounded-lg">
                                <input
                                    id="prompt-input"
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="A futuristic cityscape at sunset..."
                                    disabled={isLoading}
                                    className="w-full p-3 rounded-lg bg-transparent outline-none focus:ring-0
                                    text-white/80 placeholder-gray-200/60"
                                />
                                <motion.button
                                    type="submit"
                                    disabled={isLoading || !prompt.trim()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="cursor-pointer p-3"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                                            />
                                        </div>
                                    ) : (
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </form>
                </>
            ) : (
                <form onSubmit={handleFollowUpSubmit} className="space-y-2 md:mt-20 max-md:mt-12">
                    <div className="space-y-2">
                        <label
                            htmlFor="followup-input"
                            className="block text-lg font-medium text-gray-200/80"
                        >
                            Describe your changes
                        </label>
                        <div className="mb-2 text-sm text-gray-400 italic">
                            {previousPrompt &&
                                <span>Previous prompt: "{previousPrompt}"</span>
                            }
                        </div>
                        <div className="flex items-center justify-between
                            border border-plum focus:border-midnight focus:ring-2 focus:ring-midnight
                            transition-all rounded-lg">
                            <input
                                id="followup-input"
                                type="text"
                                value={followUpPrompt}
                                onChange={(e) => setFollowUpPrompt(e.target.value)}
                                placeholder="Add more trees and make it more vibrant..."
                                disabled={isLoading}
                                className="w-full p-3 rounded-lg bg-transparent outline-none focus:ring-0
                                    text-white/80 placeholder-gray-200/60"
                            />
                            <motion.button
                                type="submit"
                                disabled={isLoading || !followUpPrompt.trim()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="cursor-pointer p-3"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                                        />
                                    </div>
                                ) : (
                                    <FontAwesomeIcon icon={faArrowRight} />
                                )}
                            </motion.button>
                        </div>
                    </div>


                    <button
                        type="button"
                        onClick={() => setIsFollowUp(false)}
                        className="w-1/2 mx-auto flex justify-center py-2 rounded-lg font-light text-white transition-colors hover:bg-neutral/20"
                    >
                        Cancel
                    </button>
                </form>
            )}

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
                                alt={`AI generated art`}
                                className="w-full h-auto object-cover rounded-xl"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    className="text-white bg-dark/60 p-4 rounded-xl cursor-pointer hover:bg-dark/90 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                    onClick={handleFollowUpClick}
                                    title="Edit this image"
                                />
                                {user &&
                                    <FontAwesomeIcon
                                        icon={faFloppyDisk}
                                        className="text-white bg-dark/60 p-4 rounded-xl cursor-pointer hover:bg-dark/90 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                                        onClick={handleSave}
                                        title="Save this image"
                                    />
                                }
                            </div>
                        </motion.div>
                        {generationHistory.length > 0 && (
                            <div className="text-sm text-gray-400 p-2">
                                <p>Prompt history:</p>
                                <ul className="list-disc pl-5">
                                    {generationHistory.map((historyPrompt, index) => (
                                        <li key={index} className="truncate">
                                            {historyPrompt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
};