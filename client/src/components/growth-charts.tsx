import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";

interface GrowthChartsProps {
  growthData: Record<string, any[]>;
}

const dimensionLabels: Record<string, string> = {
  spiritual_religious: "رشد دینی و معنوی",
  emotional_moral: "رشد عاطفی و اخلاقی",
  scientific_research: "رشد علمی و پژوهشی",
  economic_professional: "رشد اقتصادی و حرفه‌ای",
  social_political: "رشد اجتماعی و سیاسی",
  patriotic: "رشد میهن‌دوستی",
  artistic_aesthetic: "رشد هنری و زیباشناختی",
  biological_physical: "رشد زیستی و جسمانی",
};

const dimensionColors = [
  "hsl(207, 90%, 54%)", // primary
  "hsl(120, 38%, 29%)", // secondary  
  "hsl(32, 95%, 44%)", // accent
  "hsl(120, 44%, 51%)", // success
];

function ProgressChart({ canvasRef, percentage, color }: { canvasRef: React.RefObject<HTMLCanvasElement>, percentage: number, color: string }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 50;
    const lineWidth = 8;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Progress arc
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (percentage / 100) * 2 * Math.PI;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Center text
    ctx.fillStyle = color;
    ctx.font = 'bold 16px Vazir';
    ctx.textAlign = 'center';
    ctx.fillText(`${percentage}%`, centerX, centerY + 5);
  }, [percentage, color]);

  return null;
}

export default function GrowthCharts({ growthData }: GrowthChartsProps) {
  const chartRefs = [
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
  ];

  // Get latest scores for main 4 dimensions
  const getLatestScore = (dimension: string) => {
    const data = growthData?.[dimension];
    if (!data || data.length === 0) return 0;
    return Math.round(parseFloat(data[0].score));
  };

  const mainDimensions = [
    "spiritual_religious",
    "emotional_moral", 
    "scientific_research",
    "economic_professional"
  ];

  const scores = mainDimensions.map(getLatestScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">ابعاد رشد (۸ بُعد)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {mainDimensions.map((dimension, index) => (
            <div key={dimension} className="text-center">
              <div className="chart-container mx-auto mb-3 relative">
                <canvas
                  ref={chartRefs[index]}
                  width="120"
                  height="120"
                  className="mx-auto"
                />
                <ProgressChart
                  canvasRef={chartRefs[index]}
                  percentage={scores[index]}
                  color={dimensionColors[index]}
                />
              </div>
              <h3 className="text-sm font-medium text-gray-800 mb-1">
                {dimensionLabels[dimension]}
              </h3>
              <p 
                className="text-2xl font-bold"
                style={{ color: dimensionColors[index] }}
              >
                {scores[index]}%
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Button variant="ghost" className="w-full text-primary hover:bg-blue-50">
            مشاهده تمام ابعاد رشد
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
