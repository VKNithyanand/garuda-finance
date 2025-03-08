
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForecastData } from "@/utils/mockData";
import { Info } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

interface ForecastCardProps {
  data: ForecastData[];
  insights: string[];
  className?: string;
  dataSource?: "mock" | "imported";
}

const ForecastCard = ({ data, insights, className, dataSource = "mock" }: ForecastCardProps) => {
  const [chartData, setChartData] = useState<ForecastData[]>([]);
  
  useEffect(() => {
    // Animate the chart data loading
    const timer = setTimeout(() => {
      setChartData(data);
    }, 600);
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
            Forecast: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            Range: {formatCurrency(payload[1].value)} - {formatCurrency(payload[2].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Function to handle export
  const handleExport = () => {
    try {
      // Create a CSV string from forecast data
      const headers = ["date", "predicted", "lowerBound", "upperBound"];
      const csvRows = [headers.join(",")];
      
      data.forEach(item => {
        const row = [
          item.date,
          item.predicted,
          item.lowerBound,
          item.upperBound
        ].join(",");
        csvRows.push(row);
      });
      
      const csvString = csvRows.join("\n");
      
      // Create a blob and download link
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `revenue_forecast_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting forecast:", error);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg font-medium">
            Revenue Forecast
            {dataSource === "imported" && (
              <span className="ml-2 text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                From imported data
              </span>
            )}
          </CardTitle>
        </div>
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <div className="rounded-full p-1 hover:bg-muted cursor-help">
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">Forecast based on {dataSource === "imported" ? "imported" : "historical"} data patterns</p>
              <ul className="mt-2 list-disc list-inside text-xs space-y-1">
                {insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="p-1">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(16, 185, 129, 0.3)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="rgba(16, 185, 129, 0.3)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(99, 102, 241, 0.1)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="rgba(99, 102, 241, 0.1)" stopOpacity={0} />
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
              <Legend 
                wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} 
                payload={[
                  { value: 'Prediction', type: 'line', color: '#10B981' },
                  { value: 'Range', type: 'rect', color: 'rgba(99, 102, 241, 0.2)' }
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                name="Prediction"
                stroke="#10B981" 
                strokeWidth={2}
                fill="url(#forecastGradient)" 
                animationDuration={1500}
                animationBegin={300}
              />
              <Area 
                type="monotone" 
                dataKey="lowerBound" 
                name="Range"
                stroke="transparent"
                fill="transparent"
                animationDuration={1500}
                animationBegin={300}
              />
              <Area 
                type="monotone" 
                dataKey="upperBound"
                name="Range (hidden)" 
                legendType="none"
                stroke="transparent"
                fill="url(#rangeGradient)" 
                animationDuration={1500}
                animationBegin={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
