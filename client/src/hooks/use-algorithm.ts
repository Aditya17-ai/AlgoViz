
import { useState, useCallback, useEffect, useMemo } from "react";
import type { Algorithm } from "@shared/schema";
import { bubbleSort, quickSort } from "@/lib/algorithms/sorting";
import { dijkstraVisualization } from "@/lib/algorithms/graph";

interface AlgorithmState {
  isPlaying: boolean;
  isPaused: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  inputData: any;
  metrics: {
    comparisons: number;
    swaps: number;
    timeElapsed: number;
    memoryUsed: number;
  };
}

export function useAlgorithm(algorithm: Algorithm | undefined) {
  const [state, setState] = useState<AlgorithmState>({
    isPlaying: false,
    isPaused: false,
    speed: 1,
    currentStep: 0,
    totalSteps: 0,
    inputData: { array: [5, 2, 8, 1, 9, 3, 7, 4, 6] },
    metrics: {
      comparisons: 0,
      swaps: 0,
      timeElapsed: 0,
      memoryUsed: 0,
    },
  });

  // Generate real steps for sorting algorithms
  const generateSteps = useCallback((algorithm: Algorithm, inputData: any) => {
    if (!algorithm || !inputData) return [];
    if (algorithm.category === "sorting" && inputData.array) {
      if (algorithm.name.toLowerCase() === "bubble sort") {
        return bubbleSort(inputData.array);
      } else if (algorithm.name.toLowerCase() === "quick sort") {
        return quickSort(inputData.array);
      }
    }
    if (
      algorithm.category === "graph" &&
      (algorithm.name.toLowerCase() === "dijkstra's algorithm" || algorithm.name.toLowerCase() === "dijkstra") &&
      inputData.nodes && inputData.edges && inputData.startNode
    ) {
      // Use dijkstraVisualization to generate steps and map to VisualizationStep format
      const graphSteps = dijkstraVisualization(inputData.nodes, inputData.edges, inputData.startNode);
      return graphSteps.map((step: any, index: number) => {
        return {
          id: index,
          description: step.description,
          data: { nodes: step.nodes, edges: step.edges },
          highlightedElements: Array.isArray(step.visitedNodes) ? step.visitedNodes : [],
          comparingElements: step.currentNode ? [step.currentNode] : undefined,
          shortestPath: step.shortestPath,
        };
      });
    }
    return [];
  }, []);

  // Store the steps in state
  const [steps, setSteps] = useState<any[]>([]);

  // Reset to initial state
  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentStep: 0,
      metrics: {
        comparisons: 0,
        swaps: 0,
        timeElapsed: 0,
        memoryUsed: 0,
      },
    }));
  }, []);

  // Play algorithm
  const play = useCallback(() => {
    if (!algorithm) return;
    
    setState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
    }));
  }, [algorithm]);

  // Pause algorithm
  const pause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: true,
    }));
  }, []);

  // Stop algorithm
  const stop = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentStep: 0,
    }));
  }, []);

  // Step forward
  const stepForward = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps),
      metrics: {
        ...prev.metrics,
        comparisons: prev.metrics.comparisons + 1,
      },
    }));
  }, []);

  // Step backward
  const stepBackward = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  // Set speed
  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({
      ...prev,
      speed,
    }));
  }, []);

  // Set input data
  const setInputData = useCallback((inputData: any) => {
    setState(prev => ({
      ...prev,
      inputData,
      currentStep: 0,
      isPlaying: false,
      isPaused: false,
    }));
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (!state.isPlaying || !algorithm) return;

    const interval = setInterval(() => {
      setState(prev => {
        if (prev.currentStep >= prev.totalSteps) {
          return {
            ...prev,
            isPlaying: false,
          };
        }
        
        return {
          ...prev,
          currentStep: prev.currentStep + 1,
          metrics: {
            ...prev.metrics,
            comparisons: prev.metrics.comparisons + 1,
            timeElapsed: prev.metrics.timeElapsed + (1000 / prev.speed),
          },
        };
      });
    }, 1000 / state.speed);

    return () => clearInterval(interval);
  }, [state.isPlaying, state.speed, algorithm]);

  // Update steps and totalSteps when algorithm or input changes
  useEffect(() => {
    if (algorithm && state.inputData) {
      const generatedSteps = generateSteps(algorithm, state.inputData);
      setSteps(generatedSteps);
      setState(prev => ({
        ...prev,
        totalSteps: generatedSteps.length,
        currentStep: 0,
      }));
    }
  }, [algorithm, state.inputData, generateSteps]);

  // Provide the current step's data for visualization
  const currentStepData = useMemo(() => {
    if (steps.length === 0) return null;
    return steps[Math.min(state.currentStep, steps.length - 1)];
  }, [steps, state.currentStep]);

  return {
    isPlaying: state.isPlaying,
    isPaused: state.isPaused,
    speed: state.speed,
    currentStep: state.currentStep,
    totalSteps: state.totalSteps,
    inputData: state.inputData,
    metrics: state.metrics,
    play,
    pause,
    stop,
    stepForward,
    stepBackward,
    setSpeed,
    setInputData,
    reset,
    currentStepData,
  };
}
