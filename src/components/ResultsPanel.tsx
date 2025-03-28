
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FeasibilityResults } from "@/types/hackathon";
import TimelineView from "./TimelineView";

interface ResultsPanelProps {
  results: FeasibilityResults;
}

const ResultsPanel = ({ results }: ResultsPanelProps) => {
  const getFeasibilityColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "must-have":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30";
      case "should-have":
        return "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30";
      case "nice-to-have":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Feasibility Analysis</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Score:</span>
              <span className={`text-2xl font-bold ${getFeasibilityColor(results.feasibilityScore)}`}>
                {results.feasibilityScore}/100
              </span>
            </div>
          </div>
          <CardDescription>{results.advice}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={results.feasibilityScore} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground mt-1">
            Total estimated time: <span className="font-medium text-foreground">{results.totalTimeHours} hours</span>
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="tech" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="tech">Technologies</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="tech" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommended Tech Stack</CardTitle>
              <CardDescription>Based on your project requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.recommendedTechnologies.map((tech, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{tech.name}</h3>
                    <Badge variant="outline">{tech.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Setup time: ~{tech.setupTimeHours}h</span>
                    <span>
                      Difficulty: {Array(tech.difficulty).fill("★").join("")}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">MVP Scope</CardTitle>
              <CardDescription>Focus on these for a viable demo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: results.mvpScope }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Feature Breakdown</CardTitle>
              <CardDescription>Prioritized list with time estimates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.features.map((feature, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{feature.name}</h3>
                    <Badge className={getPriorityColor(feature.priority)}>
                      {feature.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Estimated time: ~{feature.estimatedHours}h
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Timeline</CardTitle>
              <CardDescription>Suggested schedule for your hackathon</CardDescription>
            </CardHeader>
            <CardContent>
              <TimelineView stages={results.timelineStages} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsPanel;
