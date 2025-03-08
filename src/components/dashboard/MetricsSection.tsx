
import MetricCard from "../MetricCard";
import { DollarSign, ArrowUpRight, TrendingDown } from "lucide-react";
import { DashboardMetrics } from "@/utils/dashboardMetrics";

interface MetricsSectionProps {
  metrics: DashboardMetrics;
}

const MetricsSection = ({ metrics }: MetricsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <MetricCard
        title="Total Expenses"
        value={`$${metrics.totalExpenses.toLocaleString()}`}
        valuePrefix=""
        valueSuffix=""
        trend={metrics.expenseTrend}
        trendLabel="vs. last month"
        icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
      />
      <MetricCard
        title="Average Expense"
        value={`$${metrics.averageExpense.toLocaleString()}`}
        valuePrefix=""
        valueSuffix=""
        trend={metrics.avgExpenseTrend}
        trendLabel="vs. last month"
        icon={<ArrowUpRight className="h-5 w-5 text-muted-foreground" />}
      />
      <MetricCard
        title="Potential Savings"
        value={`$${metrics.potentialSavings.toLocaleString()}`}
        valuePrefix=""
        valueSuffix=""
        trend={metrics.savingsTrend}
        trendLabel="vs. last month"
        icon={<TrendingDown className="h-5 w-5 text-muted-foreground" />}
      />
    </div>
  );
};

export default MetricsSection;
