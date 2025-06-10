import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, CheckSquare, Users, Lightbulb, ArrowUp } from "lucide-react";
import { componentLabels, toPersianNumbers } from "@/lib/persian-utils";

interface StatsGridProps {
  stats: {
    overallGrowth: number;
    // overallGrowthChange?: number; // Assuming this might be added later
    completedActivities: number;
    totalActivities: number;
    participationScore: number;
    // participationScoreChange?: number; // Assuming this might be added later
    activeRecommendations: number;
  };
}

export default function StatsGrid({ stats }: StatsGridProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const {
    overallGrowth,
    completedActivities,
    totalActivities,
    participationScore,
    activeRecommendations
  } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{componentLabels.statsOverallGrowth}</p>
              <p className="text-2xl font-bold text-gray-800">{toPersianNumbers(overallGrowth)}٪</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <ArrowUp className="w-4 h-4 text-success" />
            {/* Assuming stats.overallGrowthChange is not available, using placeholder 5 */}
            <span className="text-success">+{toPersianNumbers(5)}٪</span>
            <span className="text-gray-500">{componentLabels.statsComparedToLastMonth}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{componentLabels.statsCompletedActivities}</p>
              <p className="text-2xl font-bold text-gray-800">{toPersianNumbers(completedActivities)}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <span className="text-gray-500">{componentLabels.statsOutOf}</span>
            <span className="font-medium">{toPersianNumbers(totalActivities)}</span>
            <span className="text-gray-500">{componentLabels.statsTotalActivities}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{componentLabels.statsParticipationScore}</p>
              <p className="text-2xl font-bold text-gray-800">{toPersianNumbers(participationScore)}</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <ArrowUp className="w-4 h-4 text-success" />
            {/* Assuming stats.participationScoreChange is not available, using placeholder 8 */}
            <span className="text-success">+{toPersianNumbers(8)}</span>
            <span className="text-gray-500">{componentLabels.statsPointsThisWeek}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{componentLabels.statsActiveRecommendations}</p>
              <p className="text-2xl font-bold text-gray-800">{toPersianNumbers(activeRecommendations)}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-accent" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <span className="text-gray-500">{componentLabels.statsPendingReview}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
