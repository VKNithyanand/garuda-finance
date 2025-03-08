
import ExpenseCard from "../ExpenseCard";
import RevenueChart from "../RevenueChart";
import ExpenseTable from "../ExpenseTable";
import ForecastCard from "../ForecastCard";
import OptimizationCard from "../OptimizationCard";
import { Expense } from "@/utils/mockData";
import { DashboardMetrics } from "@/utils/dashboardMetrics";

interface OverviewTabProps {
  expenses: Expense[];
  metrics: DashboardMetrics;
  revenueData: any[];
  forecastData: any[];
  optimizationRecommendations: any[];
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

const OverviewTab = ({ 
  expenses, 
  metrics, 
  revenueData, 
  forecastData, 
  optimizationRecommendations,
  onUpdateExpense, 
  onDeleteExpense 
}: OverviewTabProps) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ExpenseCard data={metrics.categoryData} className="" />
        <RevenueChart data={revenueData} className="" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ExpenseTable 
            expenses={expenses} 
            onUpdateExpense={onUpdateExpense} 
            onDeleteExpense={onDeleteExpense} 
            className="h-full" 
          />
        </div>
        <ForecastCard data={forecastData} insights={metrics.forecastInsights} className="" />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <OptimizationCard recommendations={optimizationRecommendations} />
      </div>
    </>
  );
};

export default OverviewTab;
