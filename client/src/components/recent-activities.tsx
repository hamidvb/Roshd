import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Book, Users, Palette, Clock } from "lucide-react";
import { componentLabels, getTimeAgoPersian } from "@/lib/persian-utils";

interface RecentActivitiesProps {
  activities: any[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "academic": return Book;
    case "social": return Users;
    case "artistic": return Palette;
    default: return Clock;
  }
};

const getActivityColor = (type: string, completed: boolean) => {
  if (completed) return "bg-success/20 text-success";
  
  switch (type) {
    case "academic": return "bg-primary/20 text-primary";
    case "social": return "bg-secondary/20 text-secondary";
    case "artistic": return "bg-accent/20 text-accent";
    default: return "bg-gray-100 text-gray-600";
  }
};

// Removed local getTimeAgo function

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  const displayActivities = activities?.slice(0, 4) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">{componentLabels.recentActivitiesTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        {displayActivities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{componentLabels.noActivitiesYet}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayActivities.map((activity) => {
              const Icon = activity.completed ? CheckCircle : getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type, activity.completed);
              
              return (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500">{getTimeAgoPersian(activity.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
