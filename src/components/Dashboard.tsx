
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
    // Try to load data from storage first
    const loadFromStorage = async () => {
      try {
        const storedExpenses = localStorage.getItem('expense-data');
        const storedRevenue = localStorage.getItem('revenue-data');
        const storedForecast = localStorage.getItem('forecast-data');
        
        if (storedExpenses && storedRevenue && storedForecast) {
          const parsedExpenses = JSON.parse(storedExpenses);
          const parsedRevenue = JSON.parse(storedRevenue);
          const parsedForecast = JSON.parse(storedForecast);
          
          setExpenses(parsedExpenses);
          setRevenueData(parsedRevenue);
          setForecastData(parsedForecast);
          
          // Generate optimization recommendations
          const recommendations = analyzeExpensesForOptimizations(parsedExpenses);
          setOptimizationRecommendations(recommendations);
          
          // Analyze expense trends and anomalies
          const trends = await analyzeExpenseTrends(parsedExpenses);
          setExpenseTrends(trends);
          
          const anomalyData = await detectAnomalies(parsedExpenses);
          setAnomalies(anomalyData);
          
          setDataSource("imported");
          setIsLoading(false);
          return true; // Data loaded from storage
        }
        return false; // No data in storage
      } catch (error) {
        console.error("Failed to load data from storage:", error);
        return false;
      }
    };
    
    // Generate mock data if no stored data is available
    const generateInitialData = async () => {
      // Simulate loading data from an API
      const timer = setTimeout(async () => {
        const mockExpenses = generateMockExpenses(50);
        setExpenses(mockExpenses);
        
        // Generate mock data for charts and forecasts
        const mockRevenue = generateMockRevenue(12);
        setRevenueData(mockRevenue);
        
        const mockForecast = generateMockForecast(6);
        setForecastData(mockForecast);
        
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
          await saveToStorage('revenue-data', JSON.stringify(mockRevenue));
          await saveToStorage('forecast-data', JSON.stringify(mockForecast));
          await saveToStorage('optimization-data', JSON.stringify(recommendations));
        } catch (error) {
          console.error("Failed to save initial data to storage:", error);
        }
        
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    };
    
    // First try to load from storage, if that fails, generate mock data
    loadFromStorage().then(loaded => {
      if (!loaded) {
        generateInitialData();
      }
    });
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
  
  const handleExpensesUploaded = async (importedExpenses: Expense[]) => {
    setExpenses(importedExpenses);
    setDataSource("imported");
    
    // Update optimization recommendations
    const newRecommendations = analyzeExpensesForOptimizations(importedExpenses);
    setOptimizationRecommendations(newRecommendations);
    
    // Re-analyze trends and anomalies
    const trends = await analyzeExpenseTrends(importedExpenses);
    setExpenseTrends(trends);
    
    const anomalyData = await detectAnomalies(importedExpenses);
    setAnomalies(anomalyData);
  };
  
  const handleRevenueUploaded = (importedRevenue: any[]) => {
    setRevenueData(importedRevenue);
    setDataSource("imported");
  };
  
  const handleForecastUploaded = (importedForecast: any[]) => {
    setForecastData(importedForecast);
    setDataSource("imported");
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length ? Math.round(totalExpenses / expenses.length) : 0;
  const potentialSavings = totalExpenses * 0.18; // This would come from actual optimization analysis
  
  // Calculate month-over-month trend values using expenseTrends
  const expenseTrend = expenseTrends ? -5.2 : -5.2; // Use actual value if available
  const avgExpenseTrend = expenseTrends ? 2.1 : 2.1; // Use actual value if available
  const savingsTrend = expenseTrends ? 8.4 : 8.4; // Use actual value if available
  
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
            setDataSource={setDataSource}
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
