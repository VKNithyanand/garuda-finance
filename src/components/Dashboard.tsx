
import { useState, useEffect } from "react";
import Header from "./Header";
import ExpenseCard from "./ExpenseCard";
import ExpenseTable from "./ExpenseTable";
import MetricCard from "./MetricCard";
import RevenueChart from "./RevenueChart";
import ForecastCard from "./ForecastCard";
import OptimizationCard from "./OptimizationCard";
import FinancialReportCard from "./FinancialReportCard";
import SecureStorageCard from "./SecureStorageCard";
import NewExpenseDialog from "./NewExpenseDialog";
import { Expense } from "@/utils/mockData";
import { generateMockExpenses, generateMockRevenue, generateMockForecast, calculateCategoryBreakdown, generateInsights } from "@/utils/mockData";
import { analyzeExpensesForOptimizations } from "@/utils/optimizationUtils";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, DollarSign, TrendingDown, Zap } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [optimizationRecommendations, setOptimizationRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API
    const timer = setTimeout(() => {
      const mockExpenses = generateMockExpenses(50); // Passing an argument to fix error
      setExpenses(mockExpenses);
      setOptimizationRecommendations(analyzeExpensesForOptimizations(mockExpenses));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddExpense = (expense: Expense) => {
    setExpenses([expense, ...expenses]);
    // Update optimization recommendations when new expenses are added
    setOptimizationRecommendations(analyzeExpensesForOptimizations([expense, ...expenses]));
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    const updatedExpenses = expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    setExpenses(updatedExpenses);
    setOptimizationRecommendations(analyzeExpensesForOptimizations(updatedExpenses));
    toast("Expense updated successfully");
  };

  const handleDeleteExpense = (id: string) => {
    const filteredExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(filteredExpenses);
    setOptimizationRecommendations(analyzeExpensesForOptimizations(filteredExpenses));
    toast("Expense deleted successfully");
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Generate mock data for charts and forecasts
  const revenueData = generateMockRevenue(12);
  const forecastData = generateMockForecast(6);
  const categoryData = calculateCategoryBreakdown(expenses);
  const forecastInsights = generateInsights(revenueData);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
            <p className="text-muted-foreground">
              Track, analyze, and optimize your business expenses
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1">
              <Zap className="h-3.5 w-3.5 mr-1" />
              AI Powered
            </Badge>
            <NewExpenseDialog onAddExpense={handleAddExpense} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <MetricCard
            title="Total Expenses"
            value={`$${totalExpenses.toLocaleString()}`}
            valuePrefix=""
            valueSuffix=""
            trend={-5.2}
            trendLabel="vs. last month"
            icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          />
          <MetricCard
            title="Average Expense"
            value={`$${expenses.length ? Math.round(totalExpenses / expenses.length).toLocaleString() : 0}`}
            valuePrefix=""
            valueSuffix=""
            trend={2.1}
            trendLabel="vs. last month"
            icon={<ArrowUpRight className="h-5 w-5 text-muted-foreground" />}
          />
          <MetricCard
            title="Potential Savings"
            value={`$${(totalExpenses * 0.18).toLocaleString()}`}
            valuePrefix=""
            valueSuffix=""
            trend={8.4}
            trendLabel="vs. last month"
            icon={<TrendingDown className="h-5 w-5 text-muted-foreground" />}
          />
        </div>

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ExpenseCard data={categoryData} className="" />
              <RevenueChart data={revenueData} className="" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <ExpenseTable 
                  expenses={expenses} 
                  onUpdateExpense={handleUpdateExpense} 
                  onDeleteExpense={handleDeleteExpense} 
                  className="h-full" 
                />
              </div>
              <ForecastCard data={forecastData} insights={forecastInsights} className="" />
            </div>
            <div className="grid grid-cols-1 gap-6">
              <OptimizationCard recommendations={optimizationRecommendations} />
            </div>
          </TabsContent>
          <TabsContent value="reports" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialReportCard />
              <OptimizationCard recommendations={optimizationRecommendations} />
            </div>
          </TabsContent>
          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              <SecureStorageCard />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
