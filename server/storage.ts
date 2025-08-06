import { type Algorithm, type InsertAlgorithm, type VisualizationSession, type InsertVisualizationSession, type UserProgress, type InsertUserProgress } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Algorithms
  getAlgorithms(): Promise<Algorithm[]>;
  getAlgorithmsByCategory(category: string): Promise<Algorithm[]>;
  getAlgorithm(id: string): Promise<Algorithm | undefined>;
  createAlgorithm(algorithm: InsertAlgorithm): Promise<Algorithm>;
  
  // Visualization Sessions
  createVisualizationSession(session: InsertVisualizationSession): Promise<VisualizationSession>;
  getVisualizationSession(id: string): Promise<VisualizationSession | undefined>;
  
  // User Progress
  getUserProgress(sessionId: string): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
}

export class MemStorage implements IStorage {
  private algorithms: Map<string, Algorithm>;
  private visualizationSessions: Map<string, VisualizationSession>;
  private userProgress: Map<string, UserProgress>;

  constructor() {
    this.algorithms = new Map();
    this.visualizationSessions = new Map();
    this.userProgress = new Map();
    this.seedAlgorithms();
  }

  private seedAlgorithms() {
    const algorithms: InsertAlgorithm[] = [
      {
        name: "Bubble Sort",
        category: "sorting",
        difficulty: "beginner",
        description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        implementation: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
        visualization: {
          type: "array",
          animationDuration: 500,
          colors: {
            comparing: "#ff6b6b",
            swapping: "#4ecdc4",
            sorted: "#45b7d1",
            default: "#f8f9fa"
          }
        }
      },
      {
        name: "Quick Sort",
        category: "sorting",
        difficulty: "intermediate",
        description: "An efficient divide-and-conquer sorting algorithm that picks a pivot and partitions the array around it.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(log n)",
        implementation: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}`,
        visualization: {
          type: "array",
          animationDuration: 400,
          colors: {
            pivot: "#ff6b6b",
            comparing: "#feca57",
            swapping: "#4ecdc4",
            sorted: "#45b7d1",
            default: "#f8f9fa"
          }
        }
      },
      {
        name: "Binary Search",
        category: "searching",
        difficulty: "beginner",
        description: "An efficient algorithm for finding an item from a sorted list by repeatedly dividing the search interval in half.",
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
        implementation: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
        visualization: {
          type: "array",
          animationDuration: 600,
          colors: {
            searching: "#ff6b6b",
            found: "#2ecc71",
            eliminated: "#95a5a6",
            default: "#f8f9fa"
          }
        }
      },
      {
        name: "Dijkstra's Algorithm",
        category: "graph",
        difficulty: "advanced",
        description: "Finds the shortest paths between nodes in a graph, which may represent road networks.",
        timeComplexity: "O((V + E) log V)",
        spaceComplexity: "O(V)",
        implementation: `function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  const pq = new PriorityQueue();
  
  distances[start] = 0;
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    const current = pq.dequeue();
    if (visited.has(current)) continue;
    visited.add(current);
    
    for (const neighbor of graph[current]) {
      const distance = distances[current] + neighbor.weight;
      if (distance < (distances[neighbor.node] || Infinity)) {
        distances[neighbor.node] = distance;
        pq.enqueue(neighbor.node, distance);
      }
    }
  }
  return distances;
}`,
        visualization: {
          type: "graph",
          animationDuration: 800,
          colors: {
            current: "#ff6b6b",
            visited: "#2ecc71",
            exploring: "#f39c12",
            path: "#3498db",
            default: "#ecf0f1"
          }
        }
      }
    ];

    algorithms.forEach(algo => this.createAlgorithm(algo));
  }

  async getAlgorithms(): Promise<Algorithm[]> {
    return Array.from(this.algorithms.values());
  }

  async getAlgorithmsByCategory(category: string): Promise<Algorithm[]> {
    return Array.from(this.algorithms.values()).filter(algo => algo.category === category);
  }

  async getAlgorithm(id: string): Promise<Algorithm | undefined> {
    return this.algorithms.get(id);
  }

  async createAlgorithm(insertAlgorithm: InsertAlgorithm): Promise<Algorithm> {
    const id = randomUUID();
    const algorithm: Algorithm = {
      ...insertAlgorithm,
      id,
      created_at: new Date(),
    };
    this.algorithms.set(id, algorithm);
    return algorithm;
  }

  async createVisualizationSession(insertSession: InsertVisualizationSession): Promise<VisualizationSession> {
    const id = randomUUID();
    const session: VisualizationSession = {
      ...insertSession,
      id,
      created_at: new Date(),
    };
    this.visualizationSessions.set(id, session);
    return session;
  }

  async getVisualizationSession(id: string): Promise<VisualizationSession | undefined> {
    return this.visualizationSessions.get(id);
  }

  async getUserProgress(sessionId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.sessionId === sessionId);
  }

  async updateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = {
      ...insertProgress,
      id,
      created_at: new Date(),
    };
    this.userProgress.set(id, progress);
    return progress;
  }
}

export const storage = new MemStorage();
