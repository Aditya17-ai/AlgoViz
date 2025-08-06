import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, BarChart3, Zap, Code2, Clock } from "lucide-react";
import type { Algorithm } from "@shared/schema";

interface AlgorithmSelectorProps {
  algorithms: Algorithm[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function AlgorithmSelector({
  algorithms,
  selectedId,
  onSelect,
}: AlgorithmSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const categories = Array.from(new Set(algorithms.map(algo => algo.category)));
  const difficulties = Array.from(new Set(algorithms.map(algo => algo.difficulty)));

  const filteredAlgorithms = algorithms.filter((algorithm) => {
    const matchesSearch = algorithm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         algorithm.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || algorithm.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || algorithm.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sorting":
        return <BarChart3 className="h-4 w-4" />;
      case "searching":
        return <Zap className="h-4 w-4" />;
      case "data-structure":
        return <Code2 className="h-4 w-4" />;
      case "graph":
        return <Clock className="h-4 w-4" />;
      default:
        return <Code2 className="h-4 w-4" />;
    }
  };

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

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search algorithms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Category</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="flex items-center space-x-1"
            >
              {getCategoryIcon(category)}
              <span className="capitalize">{category.replace("-", " ")}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Difficulty</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedDifficulty === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty(null)}
          >
            All
          </Button>
          {difficulties.map((difficulty) => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty)}
              className="capitalize"
            >
              {difficulty}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Algorithm List */}
      <ScrollArea className="h-96">
        <div className="space-y-2">
          {filteredAlgorithms.map((algorithm) => (
            <div
              key={algorithm.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                selectedId === algorithm.id
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
              onClick={() => onSelect(algorithm.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-foreground">{algorithm.name}</h5>
                <Badge className={getDifficultyColor(algorithm.difficulty)}>
                  {algorithm.difficulty}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                {getCategoryIcon(algorithm.category)}
                <span className="text-xs text-muted-foreground capitalize">
                  {algorithm.category.replace("-", " ")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {algorithm.description}
              </p>
              <div className="flex space-x-2 mt-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {algorithm.timeComplexity}
                </code>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {algorithm.spaceComplexity}
                </code>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {filteredAlgorithms.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No algorithms found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
