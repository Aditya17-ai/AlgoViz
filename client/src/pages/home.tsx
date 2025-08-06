import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Zap, BarChart3, ArrowRight, Code2 } from "lucide-react";
import type { Algorithm } from "@shared/schema";

export default function Home() {
  const { data: algorithms = [], isLoading } = useQuery<Algorithm[]>({
    queryKey: ["/api/algorithms"],
  });

  const categorizedAlgorithms = algorithms.reduce((acc, algorithm) => {
    if (!acc[algorithm.category]) {
      acc[algorithm.category] = [];
    }
    acc[algorithm.category].push(algorithm);
    return acc;
  }, {} as Record<string, Algorithm[]>);

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sorting":
        return <BarChart3 className="h-5 w-5" />;
      case "searching":
        return <Zap className="h-5 w-5" />;
      case "data-structure":
        return <Code2 className="h-5 w-5" />;
      case "graph":
        return <Clock className="h-5 w-5" />;
      default:
        return <Play className="h-5 w-5" />;
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Master Algorithms with
              <span className="text-primary block">Interactive Visualizations</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Explore data structures and algorithms through beautiful, animated visualizations.
              Understand complexity analysis, watch algorithms in action, and level up your programming skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/visualizer">
                <Button size="lg" className="text-lg px-8 py-4">
                  <Play className="mr-2 h-5 w-5" />
                  Start Visualizing
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                <Code2 className="mr-2 h-5 w-5" />
                Browse Algorithms
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose AlgoViz?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The most comprehensive and interactive way to learn algorithms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Play className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Interactive Controls
              </h3>
              <p className="text-muted-foreground text-sm">
                Play, pause, step through, and control the speed of algorithm execution
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Complexity Analysis
              </h3>
              <p className="text-muted-foreground text-sm">
                Real-time Big O notation display with performance metrics
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Smooth Animations
              </h3>
              <p className="text-muted-foreground text-sm">
                Beautiful color-coded animations that make algorithms easy to understand
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Code2 className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Code Walkthrough
              </h3>
              <p className="text-muted-foreground text-sm">
                Step-by-step code highlighting synchronized with visual execution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithm Categories */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Algorithm Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore algorithms organized by category and difficulty level
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {Object.entries(categorizedAlgorithms).map(([category, categoryAlgorithms]) => (
              <Card key={category} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-xl">
                    {getCategoryIcon(category)}
                    <span className="capitalize">{category.replace("-", " ")}</span>
                  </CardTitle>
                  <CardDescription>
                    {categoryAlgorithms.length} algorithms available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryAlgorithms.slice(0, 3).map((algorithm) => (
                      <div key={algorithm.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{algorithm.name}</h4>
                          <p className="text-sm text-muted-foreground">{algorithm.timeComplexity}</p>
                        </div>
                        <Badge className={getDifficultyColor(algorithm.difficulty)}>
                          {algorithm.difficulty}
                        </Badge>
                      </div>
                    ))}
                    <Link href={`/visualizer?category=${category}`}>
                      <Button variant="outline" className="w-full">
                        View All {category.replace("-", " ")} Algorithms
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are mastering algorithms through interactive visualizations
          </p>
          <Link href="/visualizer">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              <Play className="mr-2 h-5 w-5" />
              Launch Visualizer
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
