
import { useState, useEffect } from "react";
import { Expense } from "@/utils/mockData";
import { 
  generateMockExpenses, 
  generateMockRevenue, 
  generateMockForecast,
} from "@/utils/mockData";
import { analyzeExpensesForOptimizations } from "@/utils/optimizationUtils";
import { analyzeExpenseTrends, detectAnomalies } from "@/utils/aiUtils";
import { saveToStorage } from "@/utils/storageUtils";

export const useDashboardData = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [optimizationRecommendations, setOptimizationRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expenseTrends, setExpenseTrends] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any>(null);
  const [dataSource, setDataSource] = useState<"mock" | "imported">("mock");

  // Initial data loading
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

  return {
    expenses,
    setExpenses,
    revenueData,
    setRevenueData,
    forecastData,
    setForecastData,
    optimizationRecommendations,
    setOptimizationRecommendations,
    isLoading,
    expenseTrends,
    setExpenseTrends,
    anomalies,
    setAnomalies,
    dataSource,
    setDataSource
  };
};
