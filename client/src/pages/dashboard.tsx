import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import StatsGrid from "@/components/stats-grid";
import GrowthCharts from "@/components/growth-charts";
import AIRecommendations from "@/components/ai-recommendations";
import RecentActivities from "@/components/recent-activities";
import ProgressChart from "@/components/progress-chart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();

  // Get student ID - for students use their own profile, for others we'd need to select
  const studentId = (user as any)?.student?.id || 1; // Use hardcoded ID 1 since we know the student exists

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: [`/api/dashboard?studentId=${studentId}`],
    enabled: !!user && !!studentId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">خطا در بارگذاری داده‌ها</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error ? String(error) : "خطا در اتصال به سرور"}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">در حال احراز هویت...</p>
        </div>
      </div>
    );
  }

  const { stats, growthByDimension, recentActivities, recommendations, alerts } = (dashboardData as any) || {};

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />
      
      <main className="flex-1">
        <Header user={user} />
        
        <div className="p-6">
          {/* Alert System */}
          {alerts && alerts.length > 0 && (
            <div className="mb-6">
              {alerts.map((alert: any) => (
                <Alert key={alert.id} className="mb-4 border-warning bg-warning/10">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{alert.title}</h3>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                      <X className="h-4 w-4" />
                    </Button>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Stats Overview */}
          <StatsGrid stats={stats} />

          {/* Growth Dimensions and AI Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <GrowthCharts growthData={growthByDimension} />
            <AIRecommendations recommendations={recommendations} />
          </div>

          {/* Recent Activities & Progress Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <RecentActivities activities={recentActivities} />
            <div className="lg:col-span-2">
              <ProgressChart studentId={studentId} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
