
import { format, subDays, subMonths } from "date-fns";

export type Expense = {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  vendor: string;
};

export type ExpenseCategory = 
  | "Rent"
  | "Payroll"
  | "Marketing"
  | "Supplies"
  | "Utilities"
  | "Travel"
  | "Software"
  | "Equipment"
  | "Insurance"
  | "Uncategorized";

export type Revenue = {
  date: string;
  amount: number;
};

export type ForecastData = {
  date: string;
  predicted: number;
  lowerBound: number;
  upperBound: number;
};

export type CategoryBreakdown = {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
};

// Generate mock expenses
export const generateMockExpenses = (count: number): Expense[] => {
  const categories: ExpenseCategory[] = [
    "Rent", "Payroll", "Marketing", "Supplies", "Utilities", 
    "Travel", "Software", "Equipment", "Insurance", "Uncategorized"
  ];
  
  const vendors = [
    "Amazon", "Office Depot", "WeWork", "Salesforce", "Adobe", 
    "Verizon", "American Airlines", "Dell", "Staples", "Uber"
  ];
  
  const descriptions = [
    "Monthly subscription", "Office supplies", "Team lunch", "Conference tickets",
    "New equipment", "Software license", "Utility bill", "Marketing campaign",
    "Travel expenses", "Consulting services"
  ];

  return Array.from({ length: count }).map((_, i) => {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = format(subDays(new Date(), daysAgo), "yyyy-MM-dd");
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    let amount;
    // Make amounts more realistic based on category
    switch(category) {
      case "Rent":
        amount = 1500 + Math.random() * 3500;
        break;
      case "Payroll":
        amount = 3000 + Math.random() * 7000;
        break;
      case "Marketing":
        amount = 500 + Math.random() * 2500;
        break;
      default:
        amount = 50 + Math.random() * 950;
    }
    
    return {
      id: `exp-${i + 1}`,
      date,
      amount: parseFloat(amount.toFixed(2)),
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      category,
      vendor: vendors[Math.floor(Math.random() * vendors.length)]
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate mock revenue
export const generateMockRevenue = (months: number): Revenue[] => {
  return Array.from({ length: months }).map((_, i) => {
    const date = format(subMonths(new Date(), i), "yyyy-MM");
    // Generate revenue that generally increases over time
    const baseRevenue = 15000 + (months - i) * 500;
    const variance = baseRevenue * 0.2; // 20% variance
    const amount = baseRevenue + (Math.random() * variance * 2 - variance);
    
    return {
      date,
      amount: parseFloat(amount.toFixed(2))
    };
  }).reverse();
};

// Generate mock forecast data
export const generateMockForecast = (months: number): ForecastData[] => {
  const lastKnownRevenue = generateMockRevenue(1)[0].amount;
  
  return Array.from({ length: months }).map((_, i) => {
    const date = format(subMonths(new Date(), -i - 1), "yyyy-MM");
    const trend = 1 + (0.03 + Math.random() * 0.04); // 3-7% growth trend
    const predicted = lastKnownRevenue * Math.pow(trend, i + 1);
    const uncertainty = 0.1 + (i * 0.02); // Increasing uncertainty over time
    
    return {
      date,
      predicted: parseFloat(predicted.toFixed(2)),
      lowerBound: parseFloat((predicted * (1 - uncertainty)).toFixed(2)),
      upperBound: parseFloat((predicted * (1 + uncertainty)).toFixed(2))
    };
  });
};

// Calculate category breakdown from expenses
export const calculateCategoryBreakdown = (expenses: Expense[]): CategoryBreakdown[] => {
  const categoryTotals: Record<ExpenseCategory, number> = {
    "Rent": 0,
    "Payroll": 0,
    "Marketing": 0,
    "Supplies": 0,
    "Utilities": 0,
    "Travel": 0,
    "Software": 0,
    "Equipment": 0,
    "Insurance": 0,
    "Uncategorized": 0
  };
  
  expenses.forEach(expense => {
    categoryTotals[expense.category] += expense.amount;
  });
  
  const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }))
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
};

// Generate realistic financial metrics
export const generateFinancialMetrics = (expenses: Expense[], revenue: Revenue[]) => {
  const totalRevenue = revenue.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = totalRevenue - totalExpenses;
  const profitMargin = (profit / totalRevenue) * 100;
  
  // Calculate month-over-month growth
  const currentMonthRevenue = revenue[revenue.length - 1]?.amount || 0;
  const previousMonthRevenue = revenue[revenue.length - 2]?.amount || 0;
  const revenueGrowth = previousMonthRevenue > 0 
    ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
    : 0;
  
  return {
    totalRevenue,
    totalExpenses,
    profit,
    profitMargin: parseFloat(profitMargin.toFixed(2)),
    revenueGrowth: parseFloat(revenueGrowth.toFixed(2))
  };
};

// Initialize mock data
export const mockExpenses = generateMockExpenses(50);
export const mockRevenue = generateMockRevenue(12);
export const mockForecast = generateMockForecast(6);
export const mockCategoryBreakdown = calculateCategoryBreakdown(mockExpenses);
export const mockFinancialMetrics = generateFinancialMetrics(mockExpenses, mockRevenue);
