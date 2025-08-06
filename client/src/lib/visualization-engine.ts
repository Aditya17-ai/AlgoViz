import type { Algorithm } from "@shared/schema";
import { bubbleSort, quickSort } from "./algorithms/sorting";
import { linearSearch, binarySearch } from "./algorithms/searching";
import { StackVisualization, QueueVisualization } from "./algorithms/data-structures";
import { dijkstraVisualization, breadthFirstSearch } from "./algorithms/graph";

export interface VisualizationStep {
  id: number;
  description: string;
  data: any;
  highlightedElements?: number[];
  comparingElements?: number[];
  swappingElements?: number[];
  sortedElements?: number[];
}

export class VisualizationEngine {
  private algorithm: Algorithm;
  private inputData: any;
  private steps: VisualizationStep[] = [];
  private currentStepIndex = 0;

  constructor(algorithm: Algorithm, inputData: any) {
    this.algorithm = algorithm;
    this.inputData = inputData;
    this.generateSteps();
  }

  private generateSteps(): void {
    switch (this.algorithm.name.toLowerCase()) {
      case "bubble sort":
        this.steps = this.generateBubbleSortSteps();
        break;
      case "quick sort":
        this.steps = this.generateQuickSortSteps();
        break;
      case "binary search":
        this.steps = this.generateBinarySearchSteps();
        break;
      case "linear search":
        this.steps = this.generateLinearSearchSteps();
        break;
      default:
        this.steps = this.generateGenericSteps();
    }
  }

  private generateBubbleSortSteps(): VisualizationStep[] {
    if (!this.inputData.array) return [];
    
    const sortSteps = bubbleSort(this.inputData.array);
    return sortSteps.map((step, index) => ({
      id: index,
      description: step.description,
      data: step.array,
      comparingElements: step.comparing,
      swappingElements: step.swapping,
      sortedElements: step.sorted,
    }));
  }

  private generateQuickSortSteps(): VisualizationStep[] {
    if (!this.inputData.array) return [];
    
    const sortSteps = quickSort(this.inputData.array);
    return sortSteps.map((step, index) => ({
      id: index,
      description: step.description,
      data: step.array,
      comparingElements: step.comparing,
      swappingElements: step.swapping,
      sortedElements: step.sorted,
    }));
  }

  private generateBinarySearchSteps(): VisualizationStep[] {
    if (!this.inputData.array || this.inputData.target === undefined) return [];
    
    const searchSteps = binarySearch(this.inputData.array, this.inputData.target);
    return searchSteps.map((step, index) => ({
      id: index,
      description: step.description,
      data: step.array,
      highlightedElements: step.searching,
      comparingElements: step.found !== undefined ? [step.found] : undefined,
    }));
  }

  private generateLinearSearchSteps(): VisualizationStep[] {
    if (!this.inputData.array || this.inputData.target === undefined) return [];
    
    const searchSteps = linearSearch(this.inputData.array, this.inputData.target);
    return searchSteps.map((step, index) => ({
      id: index,
      description: step.description,
      data: step.array,
      highlightedElements: step.searching,
      comparingElements: step.found !== undefined ? [step.found] : undefined,
    }));
  }

  private generateGenericSteps(): VisualizationStep[] {
    // Fallback for algorithms without specific implementations
    const data = this.inputData.array || [1, 2, 3, 4, 5];
    return data.map((_, index) => ({
      id: index,
      description: `Step ${index + 1}`,
      data: [...data],
      highlightedElements: [index],
    }));
  }

  public getSteps(): VisualizationStep[] {
    return this.steps;
  }

  public getCurrentStep(): VisualizationStep | null {
    return this.steps[this.currentStepIndex] || null;
  }

  public nextStep(): VisualizationStep | null {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
    }
    return this.getCurrentStep();
  }

  public previousStep(): VisualizationStep | null {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
    return this.getCurrentStep();
  }

  public goToStep(stepIndex: number): VisualizationStep | null {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.currentStepIndex = stepIndex;
    }
    return this.getCurrentStep();
  }

  public reset(): void {
    this.currentStepIndex = 0;
  }

  public getTotalSteps(): number {
    return this.steps.length;
  }

  public getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }
}
