import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, CheckSquare, Users, Lightbulb, ArrowUp } from "lucide-react";

interface StatsGridProps {
  stats: {
    overallGrowth: number;
    completedActivities: number;
    totalActivities: number;
    participationScore: number;
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
              <p className="text-sm text-gray-500">میانگین کلی رشد</p>
              <p className="text-2xl font-bold text-gray-800">{overallGrowth}%</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <ArrowUp className="w-4 h-4 text-success" />
            <span className="text-success">+5%</span>
            <span className="text-gray-500">نسبت به ماه گذشته</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">فعالیت‌های انجام شده</p>
              <p className="text-2xl font-bold text-gray-800">{completedActivities}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <span className="text-gray-500">از</span>
            <span className="font-medium">{totalActivities}</span>
            <span className="text-gray-500">فعالیت کل</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">امتیاز مشارکت</p>
              <p className="text-2xl font-bold text-gray-800">{participationScore}</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <ArrowUp className="w-4 h-4 text-success" />
            <span className="text-success">+8</span>
            <span className="text-gray-500">امتیاز این هفته</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">توصیه‌های فعال</p>
              <p className="text-2xl font-bold text-gray-800">{activeRecommendations}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-accent" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <span className="text-gray-500">در انتظار بررسی</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
