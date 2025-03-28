
import { useState } from "react";
import IdeaInput from "@/components/IdeaInput";
import ResultsPanel from "@/components/ResultsPanel";
import { HackathonIdea, FeasibilityResults } from "@/types/hackathon";
import { analyzeFeasibility } from "@/utils/feasibilityAnalyzer";

const Index = () => {
  const [results, setResults] = useState<FeasibilityResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (idea: HackathonIdea) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeFeasibility(idea);
      setResults(analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2 gradient-text md:text-5xl lg:text-6xl">
          Hackathon Sage
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your AI assistant for judging the feasibility of hackathon projects.
          Get technology recommendations, time estimates, and scope guidance.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
        <IdeaInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        {results && <ResultsPanel results={results} />}
      </div>

      <footer className="mt-20 text-center text-sm text-muted-foreground">
        <p>
          Built with ❤️ for hackathon enthusiasts. This tool provides estimates
          based on common project patterns - actual results may vary.
        </p>
      </footer>
    </div>
  );
};

export default Index;
