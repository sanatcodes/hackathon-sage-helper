
export interface HackathonIdea {
  title: string;
  description: string;
  complexity: "beginner" | "intermediate" | "advanced";
  teamSize: number;
  durationHours: number;
  category: string;
  targetPlatform: string[];
}

export interface Technology {
  name: string;
  category: string;
  difficulty: number;
  setupTimeHours: number;
  description: string;
}

export interface Feature {
  name: string;
  priority: "must-have" | "should-have" | "nice-to-have";
  description: string;
  estimatedHours: number;
}

export interface TimelineStage {
  name: string;
  description: string;
  estimatedHours: number;
  startPercentage: number;
  endPercentage: number;
}

export interface FeasibilityResults {
  recommendedTechnologies: Technology[];
  features: Feature[];
  mvpScope: string;
  totalTimeHours: number;
  timelineStages: TimelineStage[];
  feasibilityScore: number;
  advice: string;
}
