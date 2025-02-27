
import { BarChart3Icon, DollarSignIcon, FileText, PiggyBankIcon, TrendingUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "./Header";
import MetricCard from "./MetricCard";
import RevenueChart from "./RevenueChart";
import ExpenseCard from "./ExpenseCard";
import ExpenseTable from "./ExpenseTable";
import ForecastCard from "./ForecastCard";
import NewExpenseDialog from "./NewExpenseDialog";
import OptimizationCard from "./OptimizationCard";
import { Expense, ForecastData, CategoryBreakdown, Revenue, batchProcessExpenses, calculateCategoryBreakdown, generateFinancialMetrics, generateInsights, generateMockExpenses, generateMockRevenue } from "@/utils/mockData";
import { generateForecast } from "@/utils/forecastUtils";
import { OptimizationRecommendation, analyzeExpensesForOptimizations } from "@/utils/optimizationUtils";
import { toast } from "sonner";

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [revenue, setRevenue] = useState<Revenue[]>([]);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [optimizationRecommendations, setOptimizationRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [metrics, setMetrics] = useState<{
    totalRevenue: number;
    totalExpenses: number;
    profit: number;
    profitMargin: number;
    revenueGrowth: number;
  } | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true);
      setTimeout(async () => {
        // Load mock data
        const expenseData = generateMockExpenses(50);
        const revenueData = generateMockRevenue(12);
        
        // Simulate AI processing of expenses
        const processedExpenses = await batchProcessExpenses(expenseData);
        setExpenses(processedExpenses);
        setRevenue(revenueData);
        
        // Calculate derived data
        const breakdown = calculateCategoryBreakdown(processedExpenses);
        setCategoryBreakdown(breakdown);
        
        const financialMetrics = generateFinancialMetrics(processedExpenses, revenueData);
        setMetrics(financialMetrics);
        
        const forecastData = generateForecast(revenueData, 6);
        setForecast(forecastData);
        
        const insightData = generateInsights(revenueData);
        setInsights(insightData);
        
        // Generate cost optimization recommendations
        const recommendations = analyzeExpensesForOptimizations(processedExpenses);
        setOptimizationRecommendations(recommendations);
        
        setIsLoading(false);
      }, 1000);
    };
    
    loadData();
  }, []);

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(prevExpenses => {
      const newExpenses = prevExpenses.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      );
      
      const newCategoryBreakdown = calculateCategoryBreakdown(newExpenses);
      setCategoryBreakdown(newCategoryBreakdown);
      
      const newMetrics = generateFinancialMetrics(newExpenses, revenue);
      setMetrics(newMetrics);
      
      // Update optimization recommendations based on changed expenses
      const newRecommendations = analyzeExpensesForOptimizations(newExpenses);
      setOptimizationRecommendations(newRecommendations);
      
      return newExpenses;
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prevExpenses => {
      const newExpenses = prevExpenses.filter(expense => expense.id !== id);
      
      const newCategoryBreakdown = calculateCategoryBreakdown(newExpenses);
      setCategoryBreakdown(newCategoryBreakdown);
      
      const newMetrics = generateFinancialMetrics(newExpenses, revenue);
      setMetrics(newMetrics);
      
      // Update optimization recommendations based on changed expenses
      const newRecommendations = analyzeExpensesForOptimizations(newExpenses);
      setOptimizationRecommendations(newRecommendations);
      
      toast("Expense deleted successfully");
      
      return newExpenses;
    });
  };

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prevExpenses => {
      const newExpenses = [newExpense, ...prevExpenses];
      
      const newCategoryBreakdown = calculateCategoryBreakdown(newExpenses);
      setCategoryBreakdown(newCategoryBreakdown);
      
      const newMetrics = generateFinancialMetrics(newExpenses, revenue);
      setMetrics(newMetrics);
      
      // Update optimization recommendations based on changed expenses
      const newRecommendations = analyzeExpensesForOptimizations(newExpenses);
      setOptimizationRecommendations(newRecommendations);
      
      return newExpenses;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Financial Overview</h1>
          <NewExpenseDialog onAddExpense={handleAddExpense} />
        </div>
        
        {/* Metrics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="Total Revenue" 
            value={metrics?.totalRevenue ?? 0} 
            valuePrefix="$"
            trend={metrics?.revenueGrowth}
            trendLabel="vs last month"
            icon={<DollarSignIcon className="h-5 w-5 text-primary" />}
            className="animate-fade-up"
          />
          <MetricCard 
            title="Total Expenses" 
            value={metrics?.totalExpenses ?? 0} 
            valuePrefix="$"
            icon={<FileText className="h-5 w-5 text-primary" />}
            className="animate-fade-up"
          />
          <MetricCard 
            title="Profit" 
            value={metrics?.profit ?? 0}
            valuePrefix="$"
            icon={<PiggyBankIcon className="h-5 w-5 text-primary" />}
            className="animate-fade-up"
          />
          <MetricCard 
            title="Profit Margin" 
            value={metrics?.profitMargin ?? 0}
            valueSuffix="%"
            icon={<TrendingUpIcon className="h-5 w-5 text-primary" />}
            className="animate-fade-up"
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RevenueChart 
            data={revenue} 
            className="lg:col-span-2 animate-fade-up"
          />
          <ExpenseCard 
            data={categoryBreakdown} 
            className="animate-fade-up"
          />
        </div>
        
        {/* Optimization */}
        <div className="mb-8">
          <OptimizationCard 
            recommendations={optimizationRecommendations}
            className="animate-fade-up"
          />
        </div>
        
        {/* Forecast */}
        <div className="mb-8">
          <ForecastCard 
            data={forecast} 
            insights={insights}
            className="animate-fade-up"
          />
        </div>
        
        {/* Recent expenses */}
        <ExpenseTable 
          expenses={expenses} 
          onUpdateExpense={handleUpdateExpense}
          onDeleteExpense={handleDeleteExpense}
          className="animate-fade-up"
        />
      </main>
    </div>
  );
};

export default Dashboard;
