
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { HackathonIdea } from "@/types/hackathon";
import { Loader2 } from "lucide-react";

interface IdeaInputProps {
  onAnalyze: (idea: HackathonIdea) => void;
  isAnalyzing: boolean;
}

const IdeaInput = ({ onAnalyze, isAnalyzing }: IdeaInputProps) => {
  const [idea, setIdea] = useState<HackathonIdea>({
    title: "",
    description: "",
    complexity: "intermediate",
    teamSize: 3,
    durationHours: 24,
    category: "web",
    targetPlatform: ["web"],
  });

  const platforms = [
    { id: "web", label: "Web" },
    { id: "mobile", label: "Mobile" },
    { id: "desktop", label: "Desktop" },
    { id: "iot", label: "IoT/Hardware" },
    { id: "ar-vr", label: "AR/VR" },
  ];

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    if (checked) {
      setIdea({ ...idea, targetPlatform: [...idea.targetPlatform, platformId] });
    } else {
      setIdea({
        ...idea,
        targetPlatform: idea.targetPlatform.filter((id) => id !== platformId),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(idea);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Describe Your Hackathon Idea</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="e.g., AI Study Buddy"
              value={idea.title}
              onChange={(e) => setIdea({ ...idea, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what your project does and the problem it solves..."
              rows={4}
              value={idea.description}
              onChange={(e) => setIdea({ ...idea, description: e.target.value })}
              required
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Project Category</Label>
            <Select
              value={idea.category}
              onValueChange={(value) => setIdea({ ...idea, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web Application</SelectItem>
                <SelectItem value="mobile">Mobile App</SelectItem>
                <SelectItem value="ai-ml">AI/ML</SelectItem>
                <SelectItem value="game">Game</SelectItem>
                <SelectItem value="hardware">Hardware/IoT</SelectItem>
                <SelectItem value="blockchain">Blockchain</SelectItem>
                <SelectItem value="data">Data Visualization</SelectItem>
                <SelectItem value="ar-vr">AR/VR</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Target Platforms</Label>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={idea.targetPlatform.includes(platform.id)}
                    onCheckedChange={(checked) =>
                      handlePlatformChange(platform.id, checked === true)
                    }
                  />
                  <Label htmlFor={platform.id} className="font-normal">
                    {platform.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Team Size</Label>
                <span className="text-muted-foreground">{idea.teamSize} people</span>
              </div>
              <Slider
                value={[idea.teamSize]}
                min={1}
                max={8}
                step={1}
                onValueChange={(value) => setIdea({ ...idea, teamSize: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Hackathon Duration</Label>
                <span className="text-muted-foreground">{idea.durationHours} hours</span>
              </div>
              <Slider
                value={[idea.durationHours]}
                min={6}
                max={72}
                step={6}
                onValueChange={(value) => setIdea({ ...idea, durationHours: value[0] })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Technical Complexity</Label>
            <Select
              value={idea.complexity}
              onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
                setIdea({ ...idea, complexity: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (basic CRUD, single platform)</SelectItem>
                <SelectItem value="intermediate">
                  Intermediate (APIs, multiple features)
                </SelectItem>
                <SelectItem value="advanced">
                  Advanced (ML, complex architecture)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Feasibility"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default IdeaInput;
