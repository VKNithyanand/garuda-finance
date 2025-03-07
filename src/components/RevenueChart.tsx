
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Revenue } from "@/utils/mockData";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RevenueChartProps {
  data: Revenue[];
  className?: string;
}

const RevenueChart = ({ data, className }: RevenueChartProps) => {
  const [chartData, setChartData] = useState<Revenue[]>([]);

  useEffect(() => {
    // Animate the chart data loading
    const timer = setTimeout(() => {
      setChartData(data);
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  // Format for the chart tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 border border-border p-3 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="font-medium text-sm mb-1">{label}</p>
          <p className="text-primary font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate monthly growth percentage
  const calculateGrowth = () => {
    if (data.length < 2) return "N/A";
    
    const lastMonth = data[data.length - 1].amount;
    const previousMonth = data[data.length - 2].amount;
    const growthPercent = ((lastMonth - previousMonth) / previousMonth) * 100;
    
    return growthPercent.toFixed(1) + "%";
  };

  return (
    <Card className={`${className} border border-primary/10 shadow-md overflow-hidden`}>
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the past year</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <div className="p-1.5 rounded-full bg-background/50 hover:bg-background/80 cursor-help">
                  <Info className="h-4 w-4 text-primary" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-2 max-w-xs">
                  <p className="text-sm font-medium">Revenue Insights</p>
                  <p className="text-xs text-muted-foreground">
                    This chart shows monthly revenue data. The trend indicates overall business performance.
                  </p>
                  <div className="flex justify-between text-xs border-t pt-2 mt-2">
                    <span className="text-muted-foreground">Monthly growth:</span>
                    <span className="font-medium text-primary">{calculateGrowth()}</span>
                  </div>
                </div>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-1">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--muted))" }}
                tickLine={{ stroke: "hsl(var(--muted))" }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value / 1000}k`}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--muted))" }}
                tickLine={{ stroke: "hsl(var(--muted))" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="url(#revenueGradient)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
