import { useCallback, useEffect } from "react";

export function useCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const draw = useCallback((drawFunction: (ctx: CanvasRenderingContext2D) => void) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawFunction(ctx);
  }, [canvasRef]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width - 32; // Account for padding
    canvas.height = 400;
  }, [canvasRef]);

  useEffect(() => {
    resizeCanvas();
    
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas]);

  return {
    draw,
    clearCanvas,
    resizeCanvas,
  };
}
