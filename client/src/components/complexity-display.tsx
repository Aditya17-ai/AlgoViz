import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, BarChart3 } from "lucide-react";
import type { Algorithm } from "@shared/schema";

interface ComplexityDisplayProps {
  algorithm: Algorithm;
  metrics?: {
    comparisons?: number;
    swaps?: number;
    timeElapsed?: number;
    memoryUsed?: number;
  };
}

export default function ComplexityDisplay({ algorithm, metrics }: ComplexityDisplayProps) {
  const getComplexityColor = (complexity: string) => {
    if (complexity.includes("O(1)") || complexity.includes("O(log n)")) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    } else if (complexity.includes("O(n)")) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    } else if (complexity.includes("O(n²)") || complexity.includes("O(n^2)")) {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Time Complexity */}
      <Card className="border-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Time Complexity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className={getComplexityColor(algorithm.timeComplexity)}>
            {algorithm.timeComplexity}
          </Badge>
          {metrics?.timeElapsed && (
            <p className="text-xs text-muted-foreground mt-2">
              Executed in {metrics.timeElapsed}ms
            </p>
          )}
        </CardContent>
      </Card>

      {/* Space Complexity */}
      <Card className="border-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Zap className="h-4 w-4" />
            <span>Space Complexity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className={getComplexityColor(algorithm.spaceComplexity)}>
            {algorithm.spaceComplexity}
          </Badge>
          {metrics?.memoryUsed && (
            <p className="text-xs text-muted-foreground mt-2">
              Memory: {metrics.memoryUsed} KB
            </p>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="border-2">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <BarChart3 className="h-4 w-4" />
            <span>Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm">
            {metrics?.comparisons !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comparisons:</span>
                <span className="font-medium">{metrics.comparisons}</span>
              </div>
            )}
            {metrics?.swaps !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Swaps:</span>
                <span className="font-medium">{metrics.swaps}</span>
              </div>
            )}
            {!metrics?.comparisons && !metrics?.swaps && (
              <span className="text-muted-foreground text-xs">
                Start visualization to see metrics
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
