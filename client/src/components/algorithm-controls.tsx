import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  SkipBack, 
  RotateCcw,
  Settings
} from "lucide-react";

interface AlgorithmControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  inputData: any;
  onInputChange: (data: any) => void;
  onReset: () => void;
}

export default function AlgorithmControls({
  isPlaying,
  isPaused,
  speed,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onStop,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  inputData,
  onInputChange,
  onReset,
}: AlgorithmControlsProps) {
  const handleArraySizeChange = (value: string) => {
    const size = parseInt(value) || 10;
    const newArray = Array.from({ length: size }, (_, i) => Math.floor(Math.random() * 100) + 1);
    onInputChange({ array: newArray });
  };

  const handleRandomizeArray = () => {
    const size = inputData?.array?.length || 10;
    const newArray = Array.from({ length: size }, (_, i) => Math.floor(Math.random() * 100) + 1);
    onInputChange({ array: newArray });
  };

  const handleCustomArray = (value: string) => {
    try {
      const array = value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      if (array.length > 0) {
        onInputChange({ array });
      }
    } catch (error) {
      // Handle invalid input
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Controls</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Playback Controls */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Playback</Label>
          <div className="flex items-center space-x-2">
            <Button
              variant={isPlaying ? "secondary" : "default"}
              size="sm"
              onClick={isPlaying ? onPause : onPlay}
              disabled={totalSteps === 0}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onStop}
              disabled={!isPlaying && !isPaused}
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onStepBackward}
              disabled={currentStep === 0 || isPlaying}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onStepForward}
              disabled={currentStep >= totalSteps || isPlaying}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <Separator />

        {/* Speed Control */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Speed: {speed}x
          </Label>
          <Slider
            value={[speed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={0.1}
            max={3}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0.1x</span>
            <span>3x</span>
          </div>
        </div>

        <Separator />

        {/* Input Configuration */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Input Data</Label>
          <div className="space-y-3">
            <div>
              <Label htmlFor="array-size" className="text-xs text-muted-foreground">
                Array Size
              </Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="array-size"
                  type="number"
                  min="5"
                  max="50"
                  value={inputData?.array?.length || 10}
                  onChange={(e) => handleArraySizeChange(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRandomizeArray}
                >
                  Randomize
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="custom-array" className="text-xs text-muted-foreground">
                Custom Array (comma-separated)
              </Label>
              <Input
                id="custom-array"
                placeholder="e.g., 5, 2, 8, 1, 9"
                onChange={(e) => handleCustomArray(e.target.value)}
                className="mt-1"
              />
            </div>

            {inputData?.array && (
              <div>
                <Label className="text-xs text-muted-foreground">Current Array</Label>
                <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                  [{inputData.array.join(', ')}]
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
