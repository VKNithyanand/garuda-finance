
import { Expense } from "@/utils/mockData";
import { analyzeExpensesForOptimizations } from "@/utils/optimizationUtils";
import { analyzeExpenseTrends, detectAnomalies } from "@/utils/aiUtils";
import { saveToStorage } from "@/utils/storageUtils";
import { toast } from "sonner";

export const useExpenseOperations = (
  expenses: Expense[],
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>,
  setOptimizationRecommendations: React.Dispatch<React.SetStateAction<any[]>>,
  setExpenseTrends: React.Dispatch<React.SetStateAction<any>>,
  setAnomalies: React.Dispatch<React.SetStateAction<any>>
) => {
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

  return {
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteExpense
  };
};
