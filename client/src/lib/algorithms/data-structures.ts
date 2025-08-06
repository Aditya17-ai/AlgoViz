export interface StackStep {
  stack: number[];
  operation: 'push' | 'pop' | 'peek' | 'init';
  value?: number;
  description: string;
}

export interface QueueStep {
  queue: number[];
  operation: 'enqueue' | 'dequeue' | 'front' | 'init';
  value?: number;
  description: string;
}

export class StackVisualization {
  private steps: StackStep[] = [];
  private stack: number[] = [];

  constructor() {
    this.steps.push({
      stack: [...this.stack],
      operation: 'init',
      description: 'Initialized empty stack',
    });
  }

  push(value: number): void {
    this.stack.push(value);
    this.steps.push({
      stack: [...this.stack],
      operation: 'push',
      value,
      description: `Pushed ${value} onto the stack`,
    });
  }

  pop(): number | undefined {
    const value = this.stack.pop();
    this.steps.push({
      stack: [...this.stack],
      operation: 'pop',
      value,
      description: value !== undefined ? `Popped ${value} from the stack` : 'Stack is empty, cannot pop',
    });
    return value;
  }

  peek(): number | undefined {
    const value = this.stack[this.stack.length - 1];
    this.steps.push({
      stack: [...this.stack],
      operation: 'peek',
      value,
      description: value !== undefined ? `Top element is ${value}` : 'Stack is empty',
    });
    return value;
  }

  getSteps(): StackStep[] {
    return this.steps;
  }
}

export class QueueVisualization {
  private steps: QueueStep[] = [];
  private queue: number[] = [];

  constructor() {
    this.steps.push({
      queue: [...this.queue],
      operation: 'init',
      description: 'Initialized empty queue',
    });
  }

  enqueue(value: number): void {
    this.queue.push(value);
    this.steps.push({
      queue: [...this.queue],
      operation: 'enqueue',
      value,
      description: `Enqueued ${value} to the queue`,
    });
  }

  dequeue(): number | undefined {
    const value = this.queue.shift();
    this.steps.push({
      queue: [...this.queue],
      operation: 'dequeue',
      value,
      description: value !== undefined ? `Dequeued ${value} from the queue` : 'Queue is empty, cannot dequeue',
    });
    return value;
  }

  front(): number | undefined {
    const value = this.queue[0];
    this.steps.push({
      queue: [...this.queue],
      operation: 'front',
      value,
      description: value !== undefined ? `Front element is ${value}` : 'Queue is empty',
    });
    return value;
  }

  getSteps(): QueueStep[] {
    return this.steps;
  }
}
