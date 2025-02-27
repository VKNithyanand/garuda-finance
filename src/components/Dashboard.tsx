
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
import { generateMockExpenses } from "@/utils/mockData";
import { analyzeExpensesForOptimizations } from "@/utils/optimizationUtils";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, DollarSign, TrendingDown, Zap } from "lucide-react";

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [optimizationRecommendations, setOptimizationRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API
    const timer = setTimeout(() => {
      const mockExpenses = generateMockExpenses();
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

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
            description="Total across all categories"
            trend={-5.2}
            icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          />
          <MetricCard
            title="Average Expense"
            value={`$${expenses.length ? Math.round(totalExpenses / expenses.length).toLocaleString() : 0}`}
            description="Per transaction"
            trend={2.1}
            trendLabel="vs. last month"
            icon={<ArrowUpRight className="h-5 w-5 text-muted-foreground" />}
          />
          <MetricCard
            title="Potential Savings"
            value={`$${(totalExpenses * 0.18).toLocaleString()}`}
            description="Through our AI recommendations"
            trend={8.4}
            isPositiveTrend
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
              <ExpenseCard expenses={expenses} />
              <RevenueChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <ExpenseTable expenses={expenses} className="h-full" />
              </div>
              <ForecastCard />
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
