import { useEffect, useRef } from "react";
import type { Algorithm } from "@shared/schema";
import { useCanvas } from "@/hooks/use-canvas";

interface AlgorithmCanvasProps {
  algorithm: Algorithm;
  inputData: any;
  currentStep: number;
  isPlaying: boolean;
}

export default function AlgorithmCanvas({
  algorithm,
  inputData,
  currentStep,
  isPlaying,
}: AlgorithmCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { draw, clearCanvas } = useCanvas(canvasRef);

  useEffect(() => {
    if (!algorithm || !inputData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth - 32; // Account for padding
      canvas.height = 400;
    }

    clearCanvas();
    
    if (algorithm.category === "sorting" && inputData.array) {
      drawArrayVisualization(ctx, inputData.array, currentStep, algorithm);
    } else if (algorithm.category === "searching" && inputData.array) {
      drawSearchVisualization(ctx, inputData.array, currentStep, algorithm);
    } else if (algorithm.category === "graph" && inputData.graph) {
      drawGraphVisualization(ctx, inputData.graph, currentStep, algorithm);
    }
  }, [algorithm, inputData, currentStep, draw, clearCanvas]);

  const drawArrayVisualization = (
    ctx: CanvasRenderingContext2D,
    array: number[],
    step: number,
    algorithm: Algorithm
  ) => {
    const canvas = ctx.canvas;
    const barWidth = Math.min((canvas.width - 40) / array.length, 60);
    const barGap = 2;
    const maxHeight = canvas.height - 80;
    const maxValue = Math.max(...array);

    array.forEach((value, index) => {
      const x = 20 + index * (barWidth + barGap);
      const height = (value / maxValue) * maxHeight;
      const y = canvas.height - height - 20;

      // Determine color based on algorithm state
      let color = algorithm.visualization.colors.default;
      
      // Simple state simulation based on step
      if (step > 0) {
        if (index < step / 2) {
          color = algorithm.visualization.colors.sorted || color;
        } else if (index === Math.floor(step / 2)) {
          color = algorithm.visualization.colors.comparing || color;
        } else if (index === Math.floor(step / 2) + 1) {
          color = algorithm.visualization.colors.swapping || color;
        }
      }

      // Draw bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, height);

      // Draw value
      ctx.fillStyle = "#000";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(value.toString(), x + barWidth / 2, canvas.height - 5);
    });
  };

  const drawSearchVisualization = (
    ctx: CanvasRenderingContext2D,
    array: number[],
    step: number,
    algorithm: Algorithm
  ) => {
    const canvas = ctx.canvas;
    const barWidth = Math.min((canvas.width - 40) / array.length, 60);
    const barGap = 2;
    const barHeight = 60;

    array.forEach((value, index) => {
      const x = 20 + index * (barWidth + barGap);
      const y = canvas.height / 2 - barHeight / 2;

      // Determine color based on search state
      let color = algorithm.visualization.colors.default;
      
      if (step > 0) {
        const searchIndex = Math.floor(step / 2);
        if (index === searchIndex) {
          color = algorithm.visualization.colors.searching || color;
        } else if (index < searchIndex) {
          color = algorithm.visualization.colors.eliminated || color;
        }
      }

      // Draw bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value
      ctx.fillStyle = "#000";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(value.toString(), x + barWidth / 2, y + barHeight / 2 + 5);
    });
  };

  const drawGraphVisualization = (
    ctx: CanvasRenderingContext2D,
    graph: any,
    step: number,
    algorithm: Algorithm
  ) => {
    // Simple graph visualization placeholder
    const canvas = ctx.canvas;
    const nodes = [
      { id: "A", x: 100, y: 100 },
      { id: "B", x: 200, y: 150 },
      { id: "C", x: 300, y: 100 },
      { id: "D", x: 250, y: 250 },
    ];

    // Draw edges
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(nodes[0].x, nodes[0].y);
    ctx.lineTo(nodes[1].x, nodes[1].y);
    ctx.moveTo(nodes[1].x, nodes[1].y);
    ctx.lineTo(nodes[2].x, nodes[2].y);
    ctx.moveTo(nodes[1].x, nodes[1].y);
    ctx.lineTo(nodes[3].x, nodes[3].y);
    ctx.stroke();

    // Draw nodes
    nodes.forEach((node, index) => {
      let color = algorithm.visualization.colors.default;
      
      if (step > 0 && index < step) {
        color = algorithm.visualization.colors.visited || color;
      } else if (index === step) {
        color = algorithm.visualization.colors.current || color;
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.id, node.x, node.y + 5);
    });
  };

  return (
    <div className="w-full h-96 bg-background border border-border rounded-lg p-4 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </div>
  );
}
