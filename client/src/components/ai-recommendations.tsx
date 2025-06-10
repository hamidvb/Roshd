import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bot } from "lucide-react";

interface AIRecommendationsProps {
  recommendations: any[];
}

const priorityColors = {
  high: "bg-destructive text-destructive-foreground",
  medium: "bg-warning text-warning-foreground", 
  low: "bg-secondary text-secondary-foreground",
};

const priorityLabels = {
  high: "اولویت بالا",
  medium: "اولویت متوسط",
  low: "اولویت پایین",
};

const getTimeAgo = (date: string) => {
  const now = new Date();
  const created = new Date(date);
  const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 3600 * 24));
  
  if (diffInDays === 0) return "امروز";
  if (diffInDays === 1) return "دیروز";
  if (diffInDays < 7) return `${diffInDays} روز پیش`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} هفته پیش`;
  return `${Math.floor(diffInDays / 30)} ماه پیش`;
};

export default function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  const displayRecommendations = recommendations?.slice(0, 3) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800">توصیه‌های هوشمند</CardTitle>
          <div className="flex items-center gap-2 text-sm text-primary">
            <Bot className="w-4 h-4" />
            <span>پردازش هوش مصنوعی</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {displayRecommendations.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">هنوز توصیه‌ای ایجاد نشده است</p>
            <p className="text-sm text-gray-400 mt-2">
              سیستم هوش مصنوعی در حال تحلیل داده‌های شما است
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayRecommendations.map((recommendation, index) => {
              const bgColor = index === 0 ? "bg-blue-50 border-r-4 border-primary" :
                             index === 1 ? "bg-green-50 border-r-4 border-secondary" :
                             "bg-orange-50 border-r-4 border-accent";
              
              return (
                <div key={recommendation.id} className={`p-4 rounded-lg ${bgColor}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{recommendation.title}</h3>
                    <Badge className={priorityColors[recommendation.priority as keyof typeof priorityColors]}>
                      {priorityLabels[recommendation.priority as keyof typeof priorityLabels]}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(recommendation.generatedAt)}
                    </span>
                    <Button variant="link" size="sm" className="text-xs h-auto p-0">
                      جزئیات
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100">
          <Button variant="ghost" className="w-full text-primary hover:bg-blue-50">
            مشاهده تمام توصیه‌ها
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
