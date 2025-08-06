export interface SortingStep {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  description: string;
}

export function bubbleSort(arr: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;

  steps.push({
    array: [...array],
    description: "Starting Bubble Sort",
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        description: `Comparing elements at positions ${j} and ${j + 1}`,
      });

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push({
          array: [...array],
          swapping: [j, j + 1],
          description: `Swapping elements at positions ${j} and ${j + 1}`,
        });
      }
    }
    
    steps.push({
      array: [...array],
      sorted: [n - i - 1],
      description: `Element at position ${n - i - 1} is now in correct position`,
    });
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: "Array is now fully sorted!",
  });

  return steps;
}

export function quickSort(arr: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const array = [...arr];

  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  }

  function partition(low: number, high: number): number {
    const pivot = array[high];
    let i = low - 1;

    steps.push({
      array: [...array],
      comparing: [high],
      description: `Using element at position ${high} (${pivot}) as pivot`,
    });

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...array],
        comparing: [j, high],
        description: `Comparing ${array[j]} with pivot ${pivot}`,
      });

      if (array[j] <= pivot) {
        i++;
        if (i !== j) {
          [array[i], array[j]] = [array[j], array[i]];
          steps.push({
            array: [...array],
            swapping: [i, j],
            description: `Swapping elements at positions ${i} and ${j}`,
          });
        }
      }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    steps.push({
      array: [...array],
      swapping: [i + 1, high],
      description: `Placing pivot in correct position ${i + 1}`,
    });

    return i + 1;
  }

  steps.push({
    array: [...array],
    description: "Starting Quick Sort",
  });

  quickSortHelper(0, array.length - 1);

  steps.push({
    array: [...array],
    sorted: Array.from({ length: array.length }, (_, i) => i),
    description: "Array is now fully sorted!",
  });

  return steps;
}
