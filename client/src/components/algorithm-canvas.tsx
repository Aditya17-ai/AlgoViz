import { useEffect, useRef } from "react";
import type { Algorithm } from "@shared/schema";
import { useCanvas } from "@/hooks/use-canvas";


interface AlgorithmCanvasProps {
  algorithm: Algorithm;
  inputData: any;
  currentStep: number;
  isPlaying: boolean;
  currentStepData?: any; // Pass the current step's data for accurate visualization
}

export default function AlgorithmCanvas({
  algorithm,
  inputData,
  currentStep,
  isPlaying,
  currentStepData,
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
    
    if (algorithm.category === "sorting" && currentStepData) {
      drawArrayVisualization(
        ctx,
        currentStepData.array,
        currentStepData,
        algorithm
      );
    } else if (algorithm.category === "searching" && inputData.array) {
      drawSearchVisualization(ctx, inputData.array, currentStep, algorithm);
    } else if (algorithm.category === "graph" && inputData.graph) {
      drawGraphVisualization(ctx, inputData.graph, currentStep, algorithm);
    }
  }, [algorithm, inputData, currentStep, draw, clearCanvas]);

  const drawArrayVisualization = (
    ctx: CanvasRenderingContext2D,
    array: number[],
    stepData: any,
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

      // Determine color based on stepData
      // Fix: Cast visualization to expected type
      const viz = algorithm.visualization as any;
      let color = viz.colors?.default;
      if (stepData.sorted && stepData.sorted.includes(index)) {
        color = viz.colors?.sorted || color;
      } else if (stepData.swapping && stepData.swapping.includes(index)) {
        color = viz.colors?.swapping || color;
      } else if (stepData.comparing && stepData.comparing.includes(index)) {
        color = viz.colors?.comparing || color;
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
      const viz = algorithm.visualization as any;
      let color = viz.colors?.default;
      
      if (step > 0) {
        const searchIndex = Math.floor(step / 2);
        if (index === searchIndex) {
          color = viz.colors?.searching || color;
        } else if (index < searchIndex) {
          color = viz.colors?.eliminated || color;
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

  // Maze-style visualization for Dijkstra's algorithm
  const drawGraphVisualization = (
    ctx: CanvasRenderingContext2D,
    graph: any,
    step: number,
    algorithm: Algorithm
  ) => {
    const canvas = ctx.canvas;
    // Expecting graph to be { nodes, edges } and stepData to be currentStepData
    // Use currentStepData if available for more accurate state
    const stepData = currentStepData;
    if (!stepData || !stepData.data || !stepData.data.nodes) return;
    const nodes = stepData.data.nodes;
    const edges = stepData.data.edges;
    // Determine grid size
    const gridSize = Math.ceil(Math.sqrt(nodes.length));
    const cellSize = Math.min(canvas.width, canvas.height) / gridSize;

    // Build a map of node positions
    const nodeMap = new Map(nodes.map((n: any) => [n.id, n]));
    // Build a 2D grid for maze
    const grid: (any | null)[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    nodes.forEach((node: any) => {
      if (typeof node.x === 'number' && typeof node.y === 'number') {
        grid[node.y][node.x] = node;
      }
    });

    // Draw grid
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const node = grid[y][x];
        let color = '#fff';
        if (node) {
          // Visited
          if (stepData.highlightedElements && stepData.highlightedElements.includes(node.id)) {
            color = '#90cdf4'; // blue for visited
          }
          // Current
          if (stepData.comparingElements && stepData.comparingElements.includes(node.id)) {
            color = '#f6e05e'; // yellow for current
          }
          // Start
          if (node.distance === 0) {
            color = '#68d391'; // green for start
          }
          // Wall (optional, if you want to support walls)
          // if (node.isWall) color = '#2d3748';
        } else {
          color = '#2d3748'; // wall
        }
        ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        // Draw border
        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    // Optionally, draw shortest path if available
    if (stepData.shortestPath && Array.isArray(stepData.shortestPath)) {
      ctx.strokeStyle = '#f56565';
      ctx.lineWidth = 4;
      ctx.beginPath();
      let started = false;
      for (const nodeId of stepData.shortestPath) {
        const node = nodeMap.get(nodeId);
        if (node) {
          const cx = node.x * cellSize + cellSize / 2;
          const cy = node.y * cellSize + cellSize / 2;
          if (!started) {
            ctx.moveTo(cx, cy);
            started = true;
          } else {
            ctx.lineTo(cx, cy);
          }
        }
      }
      ctx.stroke();
    }
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
