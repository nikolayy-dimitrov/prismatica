import React, { useRef, useEffect, useState, useContext } from "react";
import { faPaintBrush, faPalette, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AuthContext } from "../context/AuthContext";

import useMediaQuery from "../hooks/useMediaQuery";
import { useCanvasSetup } from "../hooks/useCanvasSetup";
import { useUploadArtwork } from "../hooks/useUploadArtworks";
import { useCanvasDrawing } from "../hooks/useCanvasDrawing";

export const CreateArt = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isMobile = useMediaQuery("(max-width: 640px)");

    const [strokeColor, setStrokeColor] = useState<string>("white");
    const [colorModal, setColorModal] = useState<boolean>(false);
    const [strokeSize, setStrokeSize] = useState<number>(5);
    const [strokeSizeModal, setStrokeSizeModal] = useState<boolean>(false);

    const aspectRatio = 500 / 800;

    const { user } = useContext(AuthContext);

    const context = useCanvasSetup(canvasRef, containerRef, isMobile, aspectRatio);
    const { handleUpload, handleClear } = useUploadArtwork(canvasRef);
    const { startDrawing, draw, endDrawing, handleUndo } = useCanvasDrawing(
        canvasRef,
        context,
    );

    // Update context when strokeColor/strokeSize changes
    useEffect(() => {
        if (context) {
            context.strokeStyle = strokeColor;
            context.lineWidth = strokeSize;
        }
    }, [strokeColor, context, strokeSize]);

    const toggleColorModal = () => {
        setStrokeSizeModal(false);
        setColorModal(!colorModal);
    };

    const toggleStrokeSizeModal = () => {
        setColorModal(false);
        setStrokeSizeModal(!strokeSizeModal);
    };

    if (!user) return;

    return (
        <div
            ref={containerRef}
            className="md:mt-8 max-md:mt-12 w-11/12 mx-auto flex flex-col items-center justify-center text-white px-4"
        >
            <button
                onClick={handleUndo}
                className="py-2 px-3 mb-6 border-2 rounded-full"
            >
                <FontAwesomeIcon icon={faRotateLeft}/>
            </button>
            <canvas
                ref={canvasRef}
                className="border-2 border-gray-300 bg-dark mb-4 touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
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
                        ${strokeColor === 'white' ? "border-white" : "border-dark"}`}
                    ></button>
                    <button
                        onClick={() => setStrokeColor("black")}
                        className={`bg-black p-3 border-2 border-transparent rounded-md
                        ${strokeColor === 'black' ? "border-white" : "border-dark"}`}
                    ></button>
                    <button
                        onClick={() => setStrokeColor("red")}
                        className={`bg-red-700 p-3 border-2 border-transparent rounded-md
                        ${strokeColor === 'red' ? "border-white" : "border-dark"}`}
                    ></button>
                    <button
                        onClick={() => setStrokeColor("green")}
                        className={`bg-green-800 p-3 border-2 border-transparent rounded-md
                         ${strokeColor === 'green' ? "border-white" : "border-dark"}`}
                    ></button>
                    <button
                        onClick={() => setStrokeColor("blue")}
                        className={`bg-blue-800 p-3 border-2 border-transparent rounded-md
                        ${strokeColor === 'blue' ? "border-white" : "border-dark"}`}
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
                    <FontAwesomeIcon icon={faPalette}/>
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
                                ? `bg-${strokeColor} border`
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
                                ? `bg-${strokeColor} border`
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
                                ? `bg-${strokeColor} border`
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
                                ? `bg-${strokeColor} border`
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
