import React, { useRef, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { faPaintBrush, faPalette } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { storage, db } from "../config/firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import useMediaQuery from "../hooks/useMediaQuery";

export const CreateArt = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery("(max-width: 640px)");
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    const [strokeColor, setStrokeColor] = useState<string>("white");
    const [colorModal, setColorModal] = useState<boolean>(false);
    const [strokeSize, setStrokeSize] = useState<number>(5);
    const [strokeSizeModal, setStrokeSizeModal] = useState<boolean>(false);

    const { user } = useContext(AuthContext);

    const aspectRatio = 500 / 800;

    // Canvas dimensions
    const updateCanvasSize = () => {
        if (canvasRef.current) {
            if (isMobile && containerRef.current) {
                // Mobile
                const containerWidth = containerRef.current.clientWidth;
                const newWidth = containerWidth;
                const newHeight = containerWidth * aspectRatio;
                canvasRef.current.width = newWidth;
                canvasRef.current.height = newHeight + 250;
            } else {
                // Desktop
                canvasRef.current.width = 800;
                canvasRef.current.height = 500;
            }
            if (context) {
                context.lineCap = "round";
                context.lineWidth = strokeSize;
                context.strokeStyle = strokeColor;
            }
        }
    };

    // Setup canvas on mount and whenever the view changes
    useEffect(() => {
        if (canvasRef.current) {
            updateCanvasSize();
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
                setContext(ctx);
                ctx.lineCap = "round";
                ctx.lineWidth = strokeSize;
                ctx.strokeStyle = strokeColor;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile]);

    // Update canvas dimensions on window resize
    useEffect(() => {
        window.addEventListener("resize", updateCanvasSize);
        return () => window.removeEventListener("resize", updateCanvasSize);
    }, [isMobile, context, strokeColor]);

    // When strokeColor/strokeSize changes, update the context
    useEffect(() => {
        if (context) {
            context.strokeStyle = strokeColor;
            context.lineWidth = strokeSize;
        }
    }, [strokeColor, context, strokeSize]);

    // Mouse event handlers
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!context) return;
        setIsDrawing(true);
        context.beginPath();
        const rect = canvasRef.current!.getBoundingClientRect();
        context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !context) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        context.stroke();
    };

    const endDrawing = () => {
        if (!context) return;
        context.closePath();
        setIsDrawing(false);
    };

    // Touch event handlers for mobile
    const startTouchDrawing = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!context) return;
        setIsDrawing(true);
        context.beginPath();
        const touch = e.touches[0];
        const rect = canvasRef.current!.getBoundingClientRect();
        context.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    };

    const touchDraw = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !context) return;
        const touch = e.touches[0];
        const rect = canvasRef.current!.getBoundingClientRect();
        context.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
        context.stroke();
    };

    const endTouchDrawing = () => {
        if (!context) return;
        context.closePath();
        setIsDrawing(false);
    };

    // Clear canvas
    const handleClear = () => {
        if (context && canvasRef.current) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    // Handle canvas upload to Firebase
    const handleUpload = async () => {
        if (!canvasRef.current || !user) return;
        const canvas = canvasRef.current;
        canvas.toBlob(
            async (blob) => {
                if (!blob) return;
                try {
                    const fileName = new Date().getTime().toString() + ".png";
                    const fileRef = ref(storage, `artworks/${user.uid}/${fileName}`);
                    const snapshot = await uploadBytes(fileRef, blob);
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    await addDoc(collection(db, "artworks"), {
                        uid: user.uid,
                        fileName,
                        downloadURL,
                        createdAt: serverTimestamp(),
                    });
                    toast.success("Artwork uploaded successfully!");
                    handleClear();
                } catch (error) {
                    console.error("Error uploading artwork:", error);
                    toast.error("Error uploading artwork");
                }
            },
            "image/png",
            1
        );
    };

    const toggleColorModal = () => {
        setStrokeSizeModal(false);
        setColorModal(!colorModal);
    };

    const toggleStrokeSizeModal = () => {
        setColorModal(false);
        setStrokeSizeModal(!strokeSizeModal);
    };

    return (
        <div
            ref={containerRef}
            className="md:mt-8 max-md:mt-16 w-11/12 mx-auto flex flex-col items-center justify-center bg-dark text-white px-4"
        >
            <h1 className="text-4xl font-bold mb-8">Create Your Art</h1>
            <canvas
                ref={canvasRef}
                className="border-2 border-gray-300 mb-4 touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={startTouchDrawing}
                onTouchMove={touchDraw}
                onTouchEnd={endTouchDrawing}
            />
            <div className="flex gap-4">
                <button
                    onClick={handleUpload}
                    className="bg-gradient-to-tl from-plum to-midnight px-4 py-2 rounded-xl shadow hover:opacity-90 transition"
                >
                    Upload Art
                </button>
                <button
                    onClick={handleClear}
                    className="bg-charcoal px-4 py-2 rounded-xl shadow hover:opacity-90 transition"
                >
                    Clear Canvas
                </button>
            </div>
            {colorModal && !strokeSizeModal ? (
                <div
                    className="absolute md:right-32 max-md:bottom-20 flex md:flex-col max-md:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => setStrokeColor("white")}
                        className={`bg-white p-3 border-2 border-transparent rounded-md
                        ${strokeColor === 'white' && "border-black"}`}
                    ></button>
                    <button
                        onClick={() => setStrokeColor("black")}
                        className={`bg-black p-3 border-2 border-transparent rounded-md
                        ${strokeColor === 'black' && "border-white"}`}
                    ></button>
                    <button
                        onClick={() => setStrokeColor("red")}
                        className={`bg-red-700 p-3 border-2 border-transparent rounded-md
                        ${strokeColor === 'red' && "border-white"}`}
                    ></button>
                    <button
                        onClick={() => setStrokeColor("green")}
                        className={`bg-green-800 p-3 border-2 border-transparent rounded-md
                         ${strokeColor === 'green' && "border-white"}`}
                    ></button>
                    <button
                        onClick={() => setStrokeColor("blue")}
                        className={`bg-blue-800 p-3 border-2 border-transparent rounded-md
                        ${strokeColor === 'blue' && "border-white"}`}
                    ></button>
                    <button
                        onClick={toggleColorModal}
                        className={`border-2 border-neutral rounded-full px-2 py-[0.1vh] text-neutral font-semibold`}
                    >
                        X
                    </button>
                </div>
            ) : (!isMobile || (isMobile && !strokeSizeModal)) && (
                <button
                    onClick={toggleColorModal}
                    className="px-3 py-2 border-2 rounded-full
                    absolute max-md:bottom-20 md:right-32 max-md:right-1/4"
                >
                    <FontAwesomeIcon icon={faPalette} />
                </button>
            )}

            {strokeSizeModal && !colorModal ? (
                <div
                    className="absolute md:left-32 max-md:bottom-20 flex md:flex-col max-md:flex-row-reverse items-center justify-center gap-4">
                    <button
                        onClick={() => setStrokeSize(20)}
                        className={`p-3 border-2 border-transparent rounded-full
                        ${strokeSize === 20 && "border-x-neutral"}`}
                    >
                        <div className={`p-3 ${
                            strokeColor === "white" || strokeColor === "black"
                                ? `bg-${strokeColor}`
                                : `bg-${strokeColor}-700`
                        } rounded-full`}></div>
                    </button>
                    <button
                        onClick={() => setStrokeSize(15)}
                        className={`p-3 border-2 border-transparent rounded-full
                        ${strokeSize === 15 && `border-x-neutral`}`}
                    >
                        <div className={`p-2.5 ${
                            strokeColor === "white" || strokeColor === "black"
                                ? `bg-${strokeColor}`
                                : `bg-${strokeColor}-700`
                        } rounded-full`}></div>
                    </button>
                    <button
                        onClick={() => setStrokeSize(10)}
                        className={`p-3 border-2 border-transparent rounded-full
                        ${strokeSize === 10 && "border-x-neutral"}`}
                    >
                        <div className={`p-1.5 ${
                            strokeColor === "white" || strokeColor === "black"
                                ? `bg-${strokeColor}`
                                : `bg-${strokeColor}-700`
                        } rounded-full`}></div>
                    </button>
                    <button
                        onClick={() => setStrokeSize(5)}
                        className={`p-3 border-2 border-transparent rounded-full
                        ${strokeSize === 5 && "border-x-neutral"}`}
                    >
                        <div className={`p-1 ${
                            strokeColor === "white" || strokeColor === "black"
                                ? `bg-${strokeColor}`
                                : `bg-${strokeColor}-700`
                        } rounded-full`}></div>
                    </button>
                    <button
                        onClick={toggleStrokeSizeModal}
                        className={`border-2 border-neutral rounded-full px-2 py-[0.1vh] text-neutral font-semibold`}
                    >
                        X
                    </button>
                </div>
            ) : (!isMobile || (isMobile && !colorModal)) && (
                <button
                    onClick={toggleStrokeSizeModal}
                    className="px-3 py-2 border-2 rounded-full
                    absolute max-md:bottom-20 md:left-32 max-md:left-1/4"
                >
                    <FontAwesomeIcon icon={faPaintBrush}/>
                </button>
            )}
        </div>
    );
};
