import { useState } from "react";

export const useCanvasDrawing = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    context: CanvasRenderingContext2D | null
) => {
    const [isDrawing, setIsDrawing] = useState(false);

    const getCanvasCoordinates = (clientX: number, clientY: number) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        return {
            x: clientX - (rect?.left || 0),
            y: clientY - (rect?.top || 0),
        };
    };

    const startDrawing = (
        e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
    ) => {
        if (!context) return;

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
    };
};