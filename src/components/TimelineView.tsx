
import { Card } from "@/components/ui/card";
import { TimelineStage } from "@/types/hackathon";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface TimelineViewProps {
  stages: TimelineStage[];
}

const TimelineView = ({ stages }: TimelineViewProps) => {
  const colors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-pink-500",
  ];

  return (
    <div className="space-y-8">
      {/* Visual timeline */}
      <div className="w-full h-12 relative rounded-lg overflow-hidden bg-muted">
        {stages.map((stage, index) => (
          <HoverCard key={index}>
            <HoverCardTrigger asChild>
              <div
                className={`absolute h-full ${colors[index % colors.length]} hover:brightness-110 cursor-pointer transition-all`}
                style={{
                  left: `${stage.startPercentage}%`,
                  width: `${stage.endPercentage - stage.startPercentage}%`,
                }}
              >
                <div className="h-full flex items-center justify-center text-xs font-medium text-white px-2 truncate">
                  {stage.name}
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-semibold">{stage.name}</h4>
                <p className="text-sm">{stage.description}</p>
                <div className="text-xs text-muted-foreground">
                  Estimated time: {stage.estimatedHours} hours
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>

      {/* Timeline details */}
      <div className="space-y-3">
        {stages.map((stage, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{stage.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {stage.estimatedHours}h
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{stage.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;
