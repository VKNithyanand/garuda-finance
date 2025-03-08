
import { Expense } from "@/utils/mockData";
import { analyzeExpensesForOptimizations } from "@/utils/optimizationUtils";
import { analyzeExpenseTrends, detectAnomalies } from "@/utils/aiUtils";
import { saveToStorage } from "@/utils/storageUtils";
import { toast } from "sonner";

export const useDatasetOperations = (
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>,
  setRevenueData: React.Dispatch<React.SetStateAction<any[]>>,
  setForecastData: React.Dispatch<React.SetStateAction<any[]>>,
  setOptimizationRecommendations: React.Dispatch<React.SetStateAction<any[]>>,
  setExpenseTrends: React.Dispatch<React.SetStateAction<any>>,
  setAnomalies: React.Dispatch<React.SetStateAction<any>>,
  setDataSource: React.Dispatch<React.SetStateAction<"mock" | "imported">>
) => {
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

  return {
    handleExpensesUploaded,
    handleRevenueUploaded,
    handleForecastUploaded
  };
};
