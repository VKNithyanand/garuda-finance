
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBreakdown } from "@/utils/mockData";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";

interface ExpenseCardProps {
  data: CategoryBreakdown[];
  className?: string;
}

const CATEGORY_COLORS = {
  "Rent": "#3B82F6", // Blue
  "Payroll": "#10B981", // Green
  "Marketing": "#F59E0B", // Amber
  "Supplies": "#6366F1", // Indigo
  "Utilities": "#EC4899", // Pink
  "Travel": "#8B5CF6", // Purple
  "Software": "#F97316", // Orange
  "Equipment": "#14B8A6", // Teal
  "Insurance": "#EF4444", // Red
  "Uncategorized": "#9CA3AF" // Gray
};

const ExpenseCard = ({ data, className }: ExpenseCardProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 border border-border p-3 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="font-medium text-sm mb-1">{data.category}</p>
          <p className="text-primary font-bold">
            {formatCurrency(data.amount)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`${className} ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Expense Categories</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[220px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
                animationDuration={1000}
                animationBegin={300}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.category] || "#9CA3AF"}
                    stroke="transparent"
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          {data.slice(0, 4).map((category, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[category.category] || "#9CA3AF" }}
              />
              <span className="text-xs truncate">{category.category}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
