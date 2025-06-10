import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

interface ProgressChartProps {
  studentId: number;
}

export default function ProgressChart({ studentId }: ProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeRange, setTimeRange] = useState("monthly");

  const { data: growthData } = useQuery({
    queryKey: ["/api/growth", studentId],
    enabled: !!studentId,
  });

  useEffect(() => {
    if (!growthData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw grid and axes
    const padding = 60;
    const chartWidth = rect.width - 2 * padding;
    const chartHeight = rect.height - 2 * padding;

    // Draw axes
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

    // Draw grid lines
    for (let i = 0; i <= 10; i++) {
      const y = padding + (i / 10) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Process data by month
    const monthlyData: Record<string, Record<string, number[]>> = {};
    
    growthData.forEach((item: any) => {
      const monthKey = `${item.year}-${item.month.toString().padStart(2, '0')}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
      }
      if (!monthlyData[monthKey][item.dimension]) {
        monthlyData[monthKey][item.dimension] = [];
      }
      monthlyData[monthKey][item.dimension].push(parseFloat(item.score));
    });

    // Get sorted months
    const months = Object.keys(monthlyData).sort().slice(-6);
    if (months.length === 0) return;

    // Calculate averages
    const dimensions = ['spiritual_religious', 'scientific_research', 'social_political'];
    const colors = ['#1976D2', '#F57C00', '#388E3C'];
    
    dimensions.forEach((dimension, dimIndex) => {
      const points: { x: number; y: number }[] = [];
      
      months.forEach((month, monthIndex) => {
        const scores = monthlyData[month][dimension] || [];
        if (scores.length > 0) {
          const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
          const x = padding + (monthIndex / (months.length - 1)) * chartWidth;
          const y = padding + chartHeight - (avgScore / 100) * chartHeight;
          points.push({ x, y });
        }
      });

      if (points.length > 1) {
        // Draw line
        ctx.strokeStyle = colors[dimIndex];
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        // Draw points
        ctx.fillStyle = colors[dimIndex];
        points.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    });

    // Draw labels
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Vazir';
    ctx.textAlign = 'center';

    // Month labels
    months.forEach((month, index) => {
      const x = padding + (index / (months.length - 1)) * chartWidth;
      const [year, monthNum] = month.split('-');
      const monthNames = ['', 'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
      ctx.fillText(monthNames[parseInt(monthNum)] || month, x, padding + chartHeight + 30);
    });

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 10; i++) {
      const y = padding + chartHeight - (i / 10) * chartHeight;
      ctx.fillText((i * 10).toString(), padding - 10, y + 4);
    }

  }, [growthData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800">نمودار پیشرفت ماهانه</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={timeRange === "monthly" ? "default" : "outline"}
              onClick={() => setTimeRange("monthly")}
            >
              ماهانه
            </Button>
            <Button
              size="sm"
              variant={timeRange === "weekly" ? "default" : "outline"}
              onClick={() => setTimeRange("weekly")}
            >
              هفتگی
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>رشد کلی</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span>رشد علمی</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span>رشد اجتماعی</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
