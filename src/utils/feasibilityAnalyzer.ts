
import { HackathonIdea, FeasibilityResults, Technology, Feature, TimelineStage } from "@/types/hackathon";

// This is a simplified version of what would be a more robust analyzer
export const analyzeFeasibility = async (idea: HackathonIdea): Promise<FeasibilityResults> => {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Basic mapping of complexity to a modifier
  const complexityModifiers = {
    beginner: 0.7,
    intermediate: 1.0,
    advanced: 1.4
  };
  
  // Calculate a base modifier for our estimates
  const complexityModifier = complexityModifiers[idea.complexity];
  const teamSizeModifier = 1 - (Math.log(idea.teamSize) / 10); // Diminishing returns for larger teams
  
  // Generate technologies based on the idea
  const technologies = generateTechnologies(idea);
  
  // Generate features based on the idea and technologies
  const features = generateFeatures(idea, technologies);
  
  // Calculate total time (accounting for team size and complexity)
  const baseHours = features.reduce((total, feature) => total + feature.estimatedHours, 0);
  const setupHours = technologies.reduce((total, tech) => total + tech.setupTimeHours, 0);
  const totalRawHours = baseHours + setupHours;
  
  // Adjust for team size (with diminishing returns) and complexity
  const adjustedPersonHours = totalRawHours * complexityModifier;
  const totalTimeHours = Math.round(adjustedPersonHours * teamSizeModifier);
  
  // Generate timeline stages
  const timelineStages = generateTimeline(idea, totalTimeHours, features);
  
  // Calculate feasibility score (lower is better)
  let feasibilityScore = calculateFeasibilityScore(idea, totalTimeHours, features);
  
  // Generate advice based on the feasibility score
  const advice = generateAdvice(feasibilityScore, idea, totalTimeHours);
  
  // Generate MVP scope
  const mvpScope = generateMvpScope(features);
  
  return {
    recommendedTechnologies: technologies,
    features,
    mvpScope,
    totalTimeHours,
    timelineStages,
    feasibilityScore,
    advice
  };
};

// Generate technologies based on the idea
const generateTechnologies = (idea: HackathonIdea): Technology[] => {
  const technologies: Technology[] = [];
  
  // Base technologies for different categories
  const techMappings: Record<string, Partial<Technology>[]> = {
    web: [
      { name: "React", category: "Frontend", difficulty: 2, setupTimeHours: 1, description: "Popular UI library for building interactive web interfaces." },
      { name: "Node.js", category: "Backend", difficulty: 2, setupTimeHours: 1, description: "JavaScript runtime for building scalable backend services." },
      { name: "Express", category: "Backend", difficulty: 2, setupTimeHours: 0.5, description: "Fast, minimalist web framework for Node.js" },
      { name: "MongoDB", category: "Database", difficulty: 2, setupTimeHours: 1, description: "NoSQL database for flexible data storage." }
    ],
    mobile: [
      { name: "React Native", category: "Mobile Framework", difficulty: 3, setupTimeHours: 2, description: "Build native mobile apps using React." },
      { name: "Firebase", category: "Backend", difficulty: 2, setupTimeHours: 1, description: "Backend-as-a-service platform with real-time database." }
    ],
    "ai-ml": [
      { name: "TensorFlow.js", category: "AI/ML", difficulty: 4, setupTimeHours: 1, description: "Library for machine learning in JavaScript." },
      { name: "Hugging Face", category: "AI/ML", difficulty: 3, setupTimeHours: 1, description: "Open-source provider of NLP models." }
    ],
    game: [
      { name: "Phaser", category: "Game Engine", difficulty: 3, setupTimeHours: 1, description: "Fast 2D game framework for making HTML5 games." },
      { name: "Three.js", category: "3D Graphics", difficulty: 4, setupTimeHours: 2, description: "JavaScript 3D library using WebGL." }
    ],
    hardware: [
      { name: "Arduino", category: "Hardware", difficulty: 3, setupTimeHours: 2, description: "Open-source electronics platform for quick prototyping." },
      { name: "Raspberry Pi", category: "Hardware", difficulty: 3, setupTimeHours: 2, description: "Small computer for IoT projects." },
      { name: "Johnny-Five", category: "Hardware/JS", difficulty: 3, setupTimeHours: 1, description: "JavaScript framework for robotics and IoT." }
    ],
    blockchain: [
      { name: "Web3.js", category: "Blockchain", difficulty: 4, setupTimeHours: 2, description: "JavaScript library for interacting with Ethereum." },
      { name: "Solidity", category: "Smart Contracts", difficulty: 4, setupTimeHours: 3, description: "Programming language for Ethereum smart contracts." }
    ],
    data: [
      { name: "D3.js", category: "Data Visualization", difficulty: 4, setupTimeHours: 2, description: "Library for data-driven document manipulation." },
      { name: "Chart.js", category: "Data Visualization", difficulty: 2, setupTimeHours: 0.5, description: "Simple yet flexible JavaScript charting." }
    ],
    "ar-vr": [
      { name: "A-Frame", category: "VR", difficulty: 3, setupTimeHours: 1, description: "Web framework for building VR experiences." },
      { name: "AR.js", category: "AR", difficulty: 3, setupTimeHours: 1.5, description: "Augmented Reality for the web." }
    ]
  };
  
  // Add base technologies for the main category
  if (techMappings[idea.category]) {
    technologies.push(...techMappings[idea.category] as Technology[]);
  }
  
  // Add common technologies for all projects
  technologies.push(
    { name: "Git", category: "Version Control", difficulty: 1, setupTimeHours: 0.5, description: "Track and manage code changes." },
    { name: "GitHub", category: "Collaboration", difficulty: 1, setupTimeHours: 0.5, description: "Host and manage Git repositories." }
  );
  
  // Add technologies based on platforms
  if (idea.targetPlatform.includes("web")) {
    technologies.push({ name: "TailwindCSS", category: "Frontend", difficulty: 2, setupTimeHours: 0.5, description: "Utility-first CSS framework for rapid UI development." });
  }
  
  if (idea.targetPlatform.includes("mobile") && !idea.category.includes("mobile")) {
    technologies.push({ name: "Expo", category: "Mobile Development", difficulty: 2, setupTimeHours: 1, description: "Platform for universal React applications." });
  }
  
  if (idea.complexity === "advanced") {
    technologies.push({ name: "TypeScript", category: "Language", difficulty: 3, setupTimeHours: 1, description: "JavaScript with static typing for better code quality." });
  }
  
  // Ensure we don't have duplicates
  const uniqueTechnologies = Array.from(new Map(technologies.map(tech => [tech.name, tech])).values());
  
  // Only return a reasonable number of technologies for a hackathon
  return uniqueTechnologies.slice(0, 6);
};

// Generate features based on the idea
const generateFeatures = (idea: HackathonIdea, technologies: Technology[]): Feature[] => {
  const features: Feature[] = [];
  
  // Common features for most projects
  features.push(
    {
      name: "User Authentication",
      priority: "must-have",
      description: "Allow users to create accounts and sign in.",
      estimatedHours: 4
    },
    {
      name: "Database Setup",
      priority: "must-have",
      description: "Set up data models and storage for your application.",
      estimatedHours: 3
    },
    {
      name: "Core Functionality",
      priority: "must-have",
      description: "Implement the primary features unique to your application.",
      estimatedHours: 8
    },
    {
      name: "Frontend UI",
      priority: "must-have",
      description: "Design and implement the user interface.",
      estimatedHours: 6
    }
  );
  
  // Category-specific features
  if (idea.category === "web" || idea.category === "mobile") {
    features.push({
      name: "API Integration",
      priority: "should-have",
      description: "Connect to third-party services via APIs.",
      estimatedHours: 4
    });
  }
  
  if (idea.category === "ai-ml") {
    features.push({
      name: "Model Training",
      priority: "must-have",
      description: "Train or fine-tune an AI model for your specific use case.",
      estimatedHours: 6
    });
    features.push({
      name: "Data Processing Pipeline",
      priority: "must-have",
      description: "Process and prepare data for your model.",
      estimatedHours: 5
    });
  }
  
  if (idea.category === "game") {
    features.push({
      name: "Game Mechanics",
      priority: "must-have",
      description: "Implement core gameplay mechanics and player controls.",
      estimatedHours: 8
    });
    features.push({
      name: "Game Assets",
      priority: "should-have",
      description: "Create or source graphics, audio, and other assets.",
      estimatedHours: 4
    });
  }
  
  // Add nice-to-have features based on complexity
  features.push({
    name: "Testing Suite",
    priority: "nice-to-have",
    description: "Set up automated tests for your application.",
    estimatedHours: 3
  });
  
  features.push({
    name: "Deployment",
    priority: "should-have",
    description: "Set up CI/CD and deploy your application.",
    estimatedHours: 2
  });
  
  if (idea.complexity === "advanced") {
    features.push({
      name: "Analytics",
      priority: "nice-to-have",
      description: "Implement user analytics and tracking.",
      estimatedHours: 3
    });
    features.push({
      name: "Performance Optimization",
      priority: "nice-to-have",
      description: "Optimize application for speed and efficiency.",
      estimatedHours: 4
    });
  }
  
  // Adjust estimated hours based on complexity
  const complexityMultipliers = {
    beginner: 0.8,
    intermediate: 1.0,
    advanced: 1.3
  };
  
  return features.map(feature => ({
    ...feature,
    estimatedHours: Math.round(feature.estimatedHours * complexityMultipliers[idea.complexity])
  }));
};

// Generate timeline stages
const generateTimeline = (idea: HackathonIdea, totalHours: number, features: Feature[]): TimelineStage[] => {
  const stages: TimelineStage[] = [];
  
  // Basic hackathon schedule
  const setupPercentage = 15;
  const developmentPercentage = 60;
  const finalizingPercentage = 25;
  
  const setupHours = Math.round(totalHours * (setupPercentage / 100));
  const developmentHours = Math.round(totalHours * (developmentPercentage / 100));
  const finalizingHours = totalHours - setupHours - developmentHours;
  
  stages.push(
    {
      name: "Setup & Planning",
      description: "Set up development environment, plan architecture, and create initial project structure.",
      estimatedHours: setupHours,
      startPercentage: 0,
      endPercentage: setupPercentage
    },
    {
      name: "Core Development",
      description: "Implement core features and functionality, focusing on the MVP requirements.",
      estimatedHours: developmentHours,
      startPercentage: setupPercentage,
      endPercentage: setupPercentage + developmentPercentage
    },
    {
      name: "Finalization & Presentation",
      description: "Polish UI, fix bugs, prepare demo and presentation materials.",
      estimatedHours: finalizingHours,
      startPercentage: setupPercentage + developmentPercentage,
      endPercentage: 100
    }
  );
  
  return stages;
};

// Calculate feasibility score
const calculateFeasibilityScore = (idea: HackathonIdea, totalTimeHours: number, features: Feature[]): number => {
  // Base score out of 100
  let score = 100;
  
  // Penalize if the project will take longer than the hackathon duration
  if (totalTimeHours > idea.durationHours) {
    const overagePercentage = (totalTimeHours - idea.durationHours) / idea.durationHours;
    score -= Math.min(50, Math.round(overagePercentage * 100));
  }
  
  // Adjust based on team size vs. complexity
  const teamComplexityRatio = idea.teamSize / (idea.complexity === "beginner" ? 1 : idea.complexity === "intermediate" ? 2 : 3);
  if (teamComplexityRatio < 1) {
    score -= Math.min(30, Math.round((1 - teamComplexityRatio) * 50));
  }
  
  // Factor in number of must-have features
  const mustHaveFeatures = features.filter(f => f.priority === "must-have").length;
  if (mustHaveFeatures > 5) {
    score -= Math.min(20, (mustHaveFeatures - 5) * 5);
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};

// Generate advice based on the feasibility score
const generateAdvice = (score: number, idea: HackathonIdea, totalHours: number): string => {
  if (score >= 80) {
    return "This project is feasible within your hackathon timeframe. Focus on building a solid MVP and leave time for testing and presentation prep.";
  } else if (score >= 60) {
    return `This project is ambitious but doable. Consider simplifying some features or focusing on just ${Math.min(3, Math.max(1, idea.teamSize - 1))} core functionalities to ensure completion.`;
  } else if (score >= 40) {
    return `This project may be challenging to complete in ${idea.durationHours} hours. Consider reducing scope significantly or adding more team members with relevant expertise.`;
  } else {
    return `This project is very ambitious for a ${idea.durationHours}-hour hackathon. Consider pivoting to a simpler concept or extending your timeline if possible.`;
  }
};

// Generate MVP scope description
const generateMvpScope = (features: Feature[]): string => {
  const mustHaveFeatures = features.filter(f => f.priority === "must-have");
  
  let mvpScope = `<p>For a successful hackathon project, focus on these <strong>${mustHaveFeatures.length} core components</strong>:</p>`;
  
  mvpScope += "<ul>";
  mustHaveFeatures.forEach(feature => {
    mvpScope += `<li><strong>${feature.name}</strong>: ${feature.description}</li>`;
  });
  mvpScope += "</ul>";
  
  mvpScope += "<p>If time permits, consider adding 'should-have' features after completing these core components.</p>";
  
  return mvpScope;
};
