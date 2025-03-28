import { useState } from "react";

export const useCanvasDrawing = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    context: CanvasRenderingContext2D | null
) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState<ImageData[]>([]);

    const getCanvasCoordinates = (clientX: number, clientY: number) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        return {
            x: clientX - (rect?.left || 0),
            y: clientY - (rect?.top || 0),
        };
    };

    const saveToHistory = () => {
        if (context && canvasRef.current) {
            const snapshot = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            setHistory((prev) => [...prev, snapshot]);
        }
    };

    const handleUndo = () => {
        if (!context || history.length === 0) return;
        const prevState = history.pop();
        if (prevState && canvasRef.current) {
            context.putImageData(prevState, 0, 0);
            setHistory([...history]);
        }
    };

    const startDrawing = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
        if (!context) return;

        saveToHistory();

        setIsDrawing(true);
        context.beginPath();

        const { clientX, clientY } =
            "touches" in e ? e.touches[0] : e.nativeEvent;
        const { x, y } = getCanvasCoordinates(clientX, clientY);
        context.moveTo(x, y);
    };

    const draw = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
        if (!isDrawing || !context) return;

        const { clientX, clientY } =
            "touches" in e ? e.touches[0] : e.nativeEvent;
        const { x, y } = getCanvasCoordinates(clientX, clientY);
        context.lineTo(x, y);
        context.stroke();
    };

    const endDrawing = () => {
        if (!context) return;
        context.closePath();
        setIsDrawing(false);
    };

    return {
        isDrawing,
        startDrawing,
        draw,
        endDrawing,
        handleUndo
    };
};