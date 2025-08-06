import { useState, useCallback, useEffect } from "react";
import type { Algorithm } from "@shared/schema";

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

  // Generate steps based on algorithm and input data
  const generateSteps = useCallback((algorithm: Algorithm, inputData: any) => {
    if (!algorithm || !inputData) return [];
    
    // This is a simplified step generation
    // In a real implementation, you would have algorithm-specific step generators
    if (algorithm.category === "sorting" && inputData.array) {
      return Array.from({ length: inputData.array.length * 2 }, (_, i) => ({
        step: i,
        description: `Step ${i + 1}`,
        data: [...inputData.array],
      }));
    }
    
    return [];
  }, []);

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

  // Update total steps when algorithm or input changes
  useEffect(() => {
    if (algorithm && state.inputData) {
      const steps = generateSteps(algorithm, state.inputData);
      setState(prev => ({
        ...prev,
        totalSteps: steps.length,
        currentStep: 0,
      }));
    }
  }, [algorithm, state.inputData, generateSteps]);

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
  };
}
