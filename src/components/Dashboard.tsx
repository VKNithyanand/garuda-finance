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
import DatasetUploader from "./DatasetUploader";
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
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [optimizationRecommendations, setOptimizationRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expenseTrends, setExpenseTrends] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any>(null);
  const [dataSource, setDataSource] = useState<"mock" | "imported">("mock");

  useEffect(() => {
    const timer = setTimeout(async () => {
      const mockExpenses = generateMockExpenses(50);
      setExpenses(mockExpenses);
      
      const mockRevenue = generateMockRevenue(12);
      setRevenueData(mockRevenue);
      
      const mockForecast = generateMockForecast(6);
      setForecastData(mockForecast);
      
      const recommendations = analyzeExpensesForOptimizations(mockExpenses);
      setOptimizationRecommendations(recommendations);
      
      const trends = await analyzeExpenseTrends(mockExpenses);
      setExpenseTrends(trends);
      
      const anomalyData = await detectAnomalies(mockExpenses);
      setAnomalies(anomalyData);
      
      try {
        await saveToStorage('expense-data', JSON.stringify(mockExpenses));
        await saveToStorage('revenue-data', JSON.stringify(mockRevenue));
        await saveToStorage('forecast-data', JSON.stringify(mockForecast));
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
    
    const newRecommendations = analyzeExpensesForOptimizations(updatedExpenses);
    setOptimizationRecommendations(newRecommendations);
    
    const trends = await analyzeExpenseTrends(updatedExpenses);
    setExpenseTrends(trends);
    
    const anomalyData = await detectAnomalies(updatedExpenses);
    setAnomalies(anomalyData);
    
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
    
    const newRecommendations = analyzeExpensesForOptimizations(updatedExpenses);
    setOptimizationRecommendations(newRecommendations);
    
    const trends = await analyzeExpenseTrends(updatedExpenses);
    setExpenseTrends(trends);
    
    const anomalyData = await detectAnomalies(updatedExpenses);
    setAnomalies(anomalyData);
    
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
    
    const newRecommendations = analyzeExpensesForOptimizations(filteredExpenses);
    setOptimizationRecommendations(newRecommendations);
    
    const trends = await analyzeExpenseTrends(filteredExpenses);
    setExpenseTrends(trends);
    
    const anomalyData = await detectAnomalies(filteredExpenses);
    setAnomalies(anomalyData);
    
    try {
      await saveToStorage('expense-data', JSON.stringify(filteredExpenses));
      await saveToStorage('optimization-data', JSON.stringify(newRecommendations));
    } catch (error) {
      console.error("Failed to save updated data:", error);
    }
    
    toast.success("Expense deleted successfully");
  };
  
  const handleExpensesUploaded = async (importedExpenses: Expense[]) => {
    setExpenses(importedExpenses);
    setDataSource("imported");
    
    const newRecommendations = analyzeExpensesForOptimizations(importedExpenses);
    setOptimizationRecommendations(newRecommendations);
    
    const trends = await analyzeExpenseTrends(importedExpenses);
    setExpenseTrends(trends);
    
    const anomalyData = await detectAnomalies(importedExpenses);
    setAnomalies(anomalyData);
    
    try {
      await saveToStorage('expense-data', JSON.stringify(importedExpenses));
      await saveToStorage('optimization-data', JSON.stringify(newRecommendations));
    } catch (error) {
      console.error("Failed to save updated expense data:", error);
    }
    
    toast.success("Expenses dataset imported successfully", {
      description: `Loaded ${importedExpenses.length} expenses`
    });
  };
  
  const handleRevenueUploaded = async (importedRevenue: any[]) => {
    setRevenueData(importedRevenue);
    setDataSource("imported");
    
    try {
      await saveToStorage('revenue-data', JSON.stringify(importedRevenue));
    } catch (error) {
      console.error("Failed to save updated revenue data:", error);
    }
    
    toast.success("Revenue dataset imported successfully", {
      description: `Loaded ${importedRevenue.length} revenue entries`
    });
  };
  
  const handleForecastUploaded = async (importedForecast: any[]) => {
    setForecastData(importedForecast);
    setDataSource("imported");
    
    try {
      await saveToStorage('forecast-data', JSON.stringify(importedForecast));
    } catch (error) {
      console.error("Failed to save updated forecast data:", error);
    }
    
    toast.success("Forecast dataset imported successfully", {
      description: `Loaded ${importedForecast.length} forecast entries`
    });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length ? Math.round(totalExpenses / expenses.length) : 0;
  const potentialSavings = optimizationRecommendations.reduce(
    (sum, recommendation) => sum + (recommendation.potentialSavings || 0), 
    0
  );
  
  const thisMonth = new Date().getMonth();
  const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === thisMonth;
  });
  const prevMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === prevMonth;
  });
  
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const prevMonthTotal = prevMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const expenseTrend = prevMonthTotal > 0 
    ? ((thisMonthTotal - prevMonthTotal) / prevMonthTotal) * 100 
    : 0;
  
  const thisMonthAvg = thisMonthExpenses.length > 0 
    ? thisMonthTotal / thisMonthExpenses.length 
    : 0;
  const prevMonthAvg = prevMonthExpenses.length > 0 
    ? prevMonthTotal / prevMonthExpenses.length 
    : 0;
  const avgExpenseTrend = prevMonthAvg > 0 
    ? ((thisMonthAvg - prevMonthAvg) / prevMonthAvg) * 100 
    : 0;
  
  const savingsTrend = 8.4; // Placeholder, would ideally be calculated from historical data
  
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
              {dataSource === "imported" ? "Using Imported Data" : "Using Mock Data"}
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

        <div className="mb-6">
          <DatasetUploader 
            onExpensesLoaded={handleExpensesUploaded}
            onRevenueLoaded={handleRevenueUploaded}
            onForecastLoaded={handleForecastUploaded}
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
