
import { Expense } from "@/utils/mockData";
import { calculateCategoryBreakdown, generateInsights } from "@/utils/mockData";

export interface DashboardMetrics {
  totalExpenses: number;
  averageExpense: number;
  potentialSavings: number;
  thisMonthTotal: number;
  prevMonthTotal: number;
  expenseTrend: number;
  thisMonthAvg: number;
  prevMonthAvg: number;
  avgExpenseTrend: number;
  savingsTrend: number;
  categoryData: any[];
  forecastInsights: any[];
}

export const calculateDashboardMetrics = (
  expenses: Expense[],
  revenueData: any[],
  optimizationRecommendations: any[]
): DashboardMetrics => {
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

  return {
    totalExpenses,
    averageExpense,
    potentialSavings,
    thisMonthTotal,
    prevMonthTotal,
    expenseTrend,
    thisMonthAvg,
    prevMonthAvg,
    avgExpenseTrend,
    savingsTrend,
    categoryData,
    forecastInsights
  };
};
