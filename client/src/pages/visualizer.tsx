import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import AlgorithmSelector from "@/components/algorithm-selector";
import AlgorithmCanvas from "@/components/algorithm-canvas";
import AlgorithmControls from "@/components/algorithm-controls";
import ComplexityDisplay from "@/components/complexity-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Algorithm } from "@shared/schema";
import { useAlgorithm } from "@/hooks/use-algorithm";

export default function Visualizer() {
  const [, params] = useRoute("/visualizer/:algorithmId");
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<string | null>(
    params?.algorithmId || null
  );

  const { data: algorithms = [], isLoading } = useQuery<Algorithm[]>({
    queryKey: ["/api/algorithms"],
  });

  const selectedAlgorithm = algorithms.find(
    (algo) => algo.id === selectedAlgorithmId
  );

  const {
    isPlaying,
    isPaused,
    speed,
    currentStep,
    totalSteps,
    play,
    pause,
    stop,
    stepForward,
    stepBackward,
    setSpeed,
    inputData,
    setInputData,
    metrics,
    reset,
    currentStepData,
  } = useAlgorithm(selectedAlgorithm);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Algorithm Visualizer
            </h1>
            <p className="text-muted-foreground">
              Interactive visualization of data structures and algorithms
            </p>
          </div>
          {selectedAlgorithm && (
            <div className="flex items-center space-x-2">
              <Badge className={getDifficultyColor(selectedAlgorithm.difficulty)}>
                {selectedAlgorithm.difficulty}
              </Badge>
              <Badge variant="outline">{selectedAlgorithm.category}</Badge>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Algorithm Selector */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Select Algorithm</CardTitle>
            </CardHeader>
            <CardContent>
              <AlgorithmSelector
                algorithms={algorithms}
                selectedId={selectedAlgorithmId}
                onSelect={setSelectedAlgorithmId}
              />
            </CardContent>
          </Card>

          {/* Main Visualization Area */}
          <div className="lg:col-span-3 space-y-6">
            {selectedAlgorithm ? (
              <>
                {/* Algorithm Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedAlgorithm.name}</span>
                      <ComplexityDisplay algorithm={selectedAlgorithm} metrics={metrics} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {selectedAlgorithm.description}
                    </p>
                    <div className="flex space-x-4 text-sm">
                      <div>
                        <span className="font-medium">Time:</span>{" "}
                        <code className="bg-muted px-2 py-1 rounded">
                          {selectedAlgorithm.timeComplexity}
                        </code>
                      </div>
                      <div>
                        <span className="font-medium">Space:</span>{" "}
                        <code className="bg-muted px-2 py-1 rounded">
                          {selectedAlgorithm.spaceComplexity}
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Controls */}
                <AlgorithmControls
                  isPlaying={isPlaying}
                  isPaused={isPaused}
                  speed={speed}
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  onPlay={play}
                  onPause={pause}
                  onStop={stop}
                  onStepForward={stepForward}
                  onStepBackward={stepBackward}
                  onSpeedChange={setSpeed}
                  inputData={inputData}
                  onInputChange={setInputData}
                  onReset={reset}
                />

                {/* Visualization Canvas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Visualization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AlgorithmCanvas
                      algorithm={selectedAlgorithm}
                      inputData={inputData}
                      currentStep={currentStep}
                      isPlaying={isPlaying}
                      currentStepData={currentStepData}
                    />
                  </CardContent>
                </Card>

                {/* Algorithm Details */}
                <Card>
                  <CardContent>
                    <Tabs defaultValue="code" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="code">Implementation</TabsTrigger>
                        <TabsTrigger value="explanation">Step-by-Step</TabsTrigger>
                        <TabsTrigger value="complexity">Complexity Analysis</TabsTrigger>
                      </TabsList>
                      <TabsContent value="code" className="space-y-4">
                        <h3 className="text-lg font-semibold">Algorithm Implementation</h3>
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                          <code>{selectedAlgorithm.implementation}</code>
                        </pre>
                      </TabsContent>
                      <TabsContent value="explanation" className="space-y-4">
                        <h3 className="text-lg font-semibold">How it Works</h3>
                        <div className="space-y-2">
                          <p className="text-muted-foreground">
                            Step {currentStep} of {totalSteps}
                          </p>
                          <Separator />
                          <p className="text-sm">
                            Follow along with the visualization to understand each step of the algorithm.
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="complexity" className="space-y-4">
                        <h3 className="text-lg font-semibold">Complexity Analysis</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Time Complexity</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {selectedAlgorithm.timeComplexity}
                            </p>
                            <p className="text-sm">
                              Best case, average case, and worst case analysis of time complexity.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Space Complexity</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {selectedAlgorithm.spaceComplexity}
                            </p>
                            <p className="text-sm">
                              Additional memory requirements beyond the input data.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="lg:col-span-3">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                      Select an Algorithm
                    </h3>
                    <p className="text-muted-foreground">
                      Choose an algorithm from the sidebar to start visualizing
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
