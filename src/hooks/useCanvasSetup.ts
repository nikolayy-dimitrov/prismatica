import { useEffect, useState } from "react";

export const useCanvasSetup = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    containerRef: React.RefObject<HTMLDivElement | null>,
    isMobile: boolean,
    aspectRatio: number
) => {
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const updateCanvasSize = () => {
            if (!canvasRef.current || !containerRef.current) return;

            const { clientWidth: containerWidth } = containerRef.current;
            const isMobileLayout = isMobile && containerWidth;

            canvasRef.current.width = isMobileLayout ? containerWidth : 800;
            canvasRef.current.height = isMobileLayout
                ? containerWidth * aspectRatio + 250
                : 500;

            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
                ctx.lineCap = "round";
                setContext(ctx);
            }
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);
        return () => window.removeEventListener("resize", updateCanvasSize);
    }, [canvasRef, containerRef, isMobile, aspectRatio]);

    return context;
};