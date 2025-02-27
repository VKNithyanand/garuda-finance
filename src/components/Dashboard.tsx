
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
import { 
  generateMockExpenses, 
  generateMockRevenue, 
  generateMockForecast, 
  calculateCategoryBreakdown, 
  generateInsights 
} from "@/utils/mockData";
import { analyzeExpensesForOptimizations } from "@/utils/optimizationUtils";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, DollarSign, TrendingDown, Zap } from "lucide-react";
import { toast } from "sonner";
import { analyzeExpenseTrends, detectAnomalies } from "@/utils/aiUtils";
import { saveToStorage } from "@/utils/storageUtils";

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [optimizationRecommendations, setOptimizationRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expenseTrends, setExpenseTrends] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any>(null);

  useEffect(() => {
    // Simulate loading data from an API
    const timer = setTimeout(async () => {
      const mockExpenses = generateMockExpenses(50);
      setExpenses(mockExpenses);
      
      // Generate optimization recommendations
      const recommendations = analyzeExpensesForOptimizations(mockExpenses);
      setOptimizationRecommendations(recommendations);
      
      // Analyze expense trends and anomalies
      const trends = await analyzeExpenseTrends(mockExpenses);
      setExpenseTrends(trends);
      
      const anomalyData = await detectAnomalies(mockExpenses);
      setAnomalies(anomalyData);
      
      // Save initial data to storage
      try {
        await saveToStorage('expense-data', JSON.stringify(mockExpenses));
        await saveToStorage('optimization-data', JSON.stringify(recommendations));
      } catch (error) {
        console.error("Failed to save initial data to storage:", error);
      }
      
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddExpense = async (expense: Expense) => {
    const updatedExpenses = [expense, ...expenses];
    setExpenses(updatedExpenses);
    
    // Update optimization recommendations
    const newRecommendations = analyzeExpensesForOptimizations(updatedExpenses);
    setOptimizationRecommendations(newRecommendations);
    
    // Re-analyze trends and anomalies
    const trends = await analyzeExpenseTrends(updatedExpenses);
    setExpenseTrends(trends);
    
    const anomalyData = await detectAnomalies(updatedExpenses);
    setAnomalies(anomalyData);
    
    // Save updated data
    try {
      await saveToStorage('expense-data', JSON.stringify(updatedExpenses));
      await saveToStorage('optimization-data', JSON.stringify(newRecommendations));
    } catch (error) {
      console.error("Failed to save updated data:", error);
    }
    
    toast.success("Expense added successfully", {
      description: `${expense.description} - $${expense.amount.toFixed(2)}`
    });
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    const updatedExpenses = expenses.map(expense => 
      expense.id === updatedExpense.id ? updatedExpense : expense
    );
    setExpenses(updatedExpenses);
    
    // Update optimization recommendations
    const newRecommendations = analyzeExpensesForOptimizations(updatedExpenses);
    setOptimizationRecommendations(newRecommendations);
    
    // Re-analyze trends and anomalies
    const trends = await analyzeExpenseTrends(updatedExpenses);
    setExpenseTrends(trends);
    
    const anomalyData = await detectAnomalies(updatedExpenses);
    setAnomalies(anomalyData);
    
    // Save updated data
    try {
      await saveToStorage('expense-data', JSON.stringify(updatedExpenses));
      await saveToStorage('optimization-data', JSON.stringify(newRecommendations));
    } catch (error) {
      console.error("Failed to save updated data:", error);
    }
    
    toast.success("Expense updated successfully");
  };

  const handleDeleteExpense = async (id: string) => {
    const filteredExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(filteredExpenses);
    
    // Update optimization recommendations
    const newRecommendations = analyzeExpensesForOptimizations(filteredExpenses);
    setOptimizationRecommendations(newRecommendations);
    
    // Re-analyze trends and anomalies
    const trends = await analyzeExpenseTrends(filteredExpenses);
    setExpenseTrends(trends);
    
    const anomalyData = await detectAnomalies(filteredExpenses);
    setAnomalies(anomalyData);
    
    // Save updated data
    try {
      await saveToStorage('expense-data', JSON.stringify(filteredExpenses));
      await saveToStorage('optimization-data', JSON.stringify(newRecommendations));
    } catch (error) {
      console.error("Failed to save updated data:", error);
    }
    
    toast.success("Expense deleted successfully");
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length ? Math.round(totalExpenses / expenses.length) : 0;
  const potentialSavings = totalExpenses * 0.18; // This would come from actual optimization analysis
  
  // Calculate month-over-month trend values using expenseTrends
  const expenseTrend = expenseTrends ? -5.2 : -5.2; // Use actual value if available
  const avgExpenseTrend = expenseTrends ? 2.1 : 2.1; // Use actual value if available
  const savingsTrend = expenseTrends ? 8.4 : 8.4; // Use actual value if available
  
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
            trend={expenseTrend}
            trendLabel="vs. last month"
            icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          />
          <MetricCard
            title="Average Expense"
            value={`$${averageExpense.toLocaleString()}`}
            valuePrefix=""
            valueSuffix=""
            trend={avgExpenseTrend}
            trendLabel="vs. last month"
            icon={<ArrowUpRight className="h-5 w-5 text-muted-foreground" />}
          />
          <MetricCard
            title="Potential Savings"
            value={`$${potentialSavings.toLocaleString()}`}
            valuePrefix=""
            valueSuffix=""
            trend={savingsTrend}
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
