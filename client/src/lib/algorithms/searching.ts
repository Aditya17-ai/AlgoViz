export interface SearchStep {
  array: number[];
  target: number;
  searching?: number[];
  found?: number;
  eliminated?: number[];
  description: string;
}

export function linearSearch(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const array = [...arr];

  steps.push({
    array: [...array],
    target,
    description: `Starting Linear Search for ${target}`,
  });

  for (let i = 0; i < array.length; i++) {
    steps.push({
      array: [...array],
      target,
      searching: [i],
      description: `Checking element at position ${i}: ${array[i]}`,
    });

    if (array[i] === target) {
      steps.push({
        array: [...array],
        target,
        found: i,
        description: `Found ${target} at position ${i}!`,
      });
      return steps;
    }

    steps.push({
      array: [...array],
      target,
      eliminated: Array.from({ length: i + 1 }, (_, j) => j),
      description: `${array[i]} ≠ ${target}, continuing search`,
    });
  }

  steps.push({
    array: [...array],
    target,
    eliminated: Array.from({ length: array.length }, (_, i) => i),
    description: `${target} not found in the array`,
  });

  return steps;
}

export function binarySearch(arr: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const array = [...arr].sort((a, b) => a - b); // Ensure array is sorted
  let left = 0;
  let right = array.length - 1;

  steps.push({
    array: [...array],
    target,
    description: `Starting Binary Search for ${target} (array sorted)`,
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    steps.push({
      array: [...array],
      target,
      searching: [mid],
      eliminated: [
        ...Array.from({ length: left }, (_, i) => i),
        ...Array.from({ length: array.length - right - 1 }, (_, i) => right + 1 + i),
      ],
      description: `Checking middle element at position ${mid}: ${array[mid]}`,
    });

    if (array[mid] === target) {
      steps.push({
        array: [...array],
        target,
        found: mid,
        description: `Found ${target} at position ${mid}!`,
      });
      return steps;
    }

    if (array[mid] < target) {
      left = mid + 1;
      steps.push({
        array: [...array],
        target,
        eliminated: Array.from({ length: mid + 1 }, (_, i) => i),
        description: `${array[mid]} < ${target}, searching right half`,
      });
    } else {
      right = mid - 1;
      steps.push({
        array: [...array],
        target,
        eliminated: Array.from({ length: array.length - mid }, (_, i) => mid + i),
        description: `${array[mid]} > ${target}, searching left half`,
      });
    }
  }

  steps.push({
    array: [...array],
    target,
    eliminated: Array.from({ length: array.length }, (_, i) => i),
    description: `${target} not found in the array`,
  });

  return steps;
}
