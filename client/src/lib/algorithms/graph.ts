export interface GraphNode {
  id: string;
  x: number;
  y: number;
  distance?: number;
  previous?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
}

export interface GraphStep {
  nodes: GraphNode[];
  edges: GraphEdge[];
  currentNode?: string;
  visitedNodes: string[];
  exploringEdges?: string[];
  shortestPath?: string[];
  description: string;
}

export function dijkstraVisualization(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNode: string
): GraphStep[] {
  const steps: GraphStep[] = [];
  const nodeMap = new Map(nodes.map(node => [node.id, { ...node, distance: Infinity, previous: undefined }]));
  const visited = new Set<string>();
  const unvisited = new Set(nodes.map(n => n.id));

  // Initialize
  nodeMap.get(startNode)!.distance = 0;
  steps.push({
    nodes: Array.from(nodeMap.values()),
    edges: [...edges],
    visitedNodes: [],
    description: `Starting Dijkstra's algorithm from node ${startNode}`,
  });

  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let currentNode: string | undefined;
    let minDistance = Infinity;
    
    for (const nodeId of unvisited) {
      const node = nodeMap.get(nodeId)!;
      if (node.distance < minDistance) {
        minDistance = node.distance;
        currentNode = nodeId;
      }
    }

    if (!currentNode || minDistance === Infinity) break;

    unvisited.delete(currentNode);
    visited.add(currentNode);

    steps.push({
      nodes: Array.from(nodeMap.values()),
      edges: [...edges],
      currentNode,
      visitedNodes: Array.from(visited),
      description: `Visiting node ${currentNode} with distance ${minDistance}`,
    });

    // Update distances to neighbors
    const outgoingEdges = edges.filter(edge => edge.from === currentNode);
    const exploringEdges = outgoingEdges.map(edge => `${edge.from}-${edge.to}`);

    steps.push({
      nodes: Array.from(nodeMap.values()),
      edges: [...edges],
      currentNode,
      visitedNodes: Array.from(visited),
      exploringEdges,
      description: `Exploring neighbors of ${currentNode}`,
    });

    for (const edge of outgoingEdges) {
      const neighbor = nodeMap.get(edge.to)!;
      const newDistance = nodeMap.get(currentNode)!.distance + edge.weight;

      if (newDistance < neighbor.distance) {
        neighbor.distance = newDistance;
        neighbor.previous = currentNode;

        steps.push({
          nodes: Array.from(nodeMap.values()),
          edges: [...edges],
          currentNode,
          visitedNodes: Array.from(visited),
          description: `Updated distance to ${edge.to}: ${newDistance}`,
        });
      }
    }
  }

  steps.push({
    nodes: Array.from(nodeMap.values()),
    edges: [...edges],
    visitedNodes: Array.from(visited),
    description: 'Dijkstra\'s algorithm completed',
  });

  return steps;
}

export function breadthFirstSearch(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNode: string
): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<string>();
  const queue: string[] = [startNode];

  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visitedNodes: [],
    description: `Starting BFS from node ${startNode}`,
  });

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    
    if (visited.has(currentNode)) continue;
    
    visited.add(currentNode);

    steps.push({
      nodes: [...nodes],
      edges: [...edges],
      currentNode,
      visitedNodes: Array.from(visited),
      description: `Visiting node ${currentNode}`,
    });

    // Add neighbors to queue
    const neighbors = edges
      .filter(edge => edge.from === currentNode)
      .map(edge => edge.to)
      .filter(nodeId => !visited.has(nodeId));

    queue.push(...neighbors);

    if (neighbors.length > 0) {
      steps.push({
        nodes: [...nodes],
        edges: [...edges],
        currentNode,
        visitedNodes: Array.from(visited),
        description: `Added neighbors [${neighbors.join(', ')}] to queue`,
      });
    }
  }

  steps.push({
    nodes: [...nodes],
    edges: [...edges],
    visitedNodes: Array.from(visited),
    description: 'BFS traversal completed',
  });

  return steps;
}
