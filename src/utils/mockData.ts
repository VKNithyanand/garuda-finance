
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

// Simulate AI processing of expenses
export const batchProcessExpenses = async (expenses: Expense[]): Promise<Expense[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(expenses);
    }, 500);
  });
};

// Generate insights from revenue data
export const generateInsights = (revenue: Revenue[]): string[] => {
  if (revenue.length < 3) {
    return ["Insufficient data for insights"];
  }
  
  const currentMonth = parseFloat(revenue[revenue.length - 1].amount.toFixed(2));
  const lastMonth = parseFloat(revenue[revenue.length - 2].amount.toFixed(2));
  const lastYear = parseFloat(revenue[0].amount.toFixed(2));
  
  const monthlyGrowth = ((currentMonth - lastMonth) / lastMonth) * 100;
  const yearlyGrowth = ((currentMonth - lastYear) / lastYear) * 100;
  
  const insights = [];
  
  if (monthlyGrowth > 0) {
    insights.push(`Revenue increased by ${monthlyGrowth.toFixed(1)}% compared to last month.`);
  } else {
    insights.push(`Revenue decreased by ${Math.abs(monthlyGrowth).toFixed(1)}% compared to last month.`);
  }
  
  if (yearlyGrowth > 0) {
    insights.push(`Annual growth is positive at ${yearlyGrowth.toFixed(1)}%.`);
  } else {
    insights.push(`Annual growth is negative at ${Math.abs(yearlyGrowth).toFixed(1)}%.`);
  }
  
  // Add trend analysis
  const recentTrend = calculateRecentTrend(revenue.slice(-6).map(r => r.amount));
  if (recentTrend > 3) {
    insights.push("Strong growth trend detected in the last 6 months.");
  } else if (recentTrend > 0) {
    insights.push("Moderate growth trend detected in the last 6 months.");
  } else if (recentTrend > -3) {
    insights.push("Slight decline in revenue over the last 6 months.");
  } else {
    insights.push("Significant downward trend in the last 6 months.");
  }
  
  // Add seasonal insight if data shows patterns
  if (revenue.length >= 12) {
    insights.push("Consider analyzing seasonal patterns to optimize your marketing strategy.");
  }
  
  return insights;
};

// New function to generate insights from forecast data
export const generateInsightsFromForecast = (forecast: ForecastData[]): string[] => {
  if (forecast.length < 2) {
    return ["Insufficient data for insights"];
  }
  
  const insights: string[] = [];
  
  // Calculate average growth rate
  let totalGrowth = 0;
  for (let i = 1; i < forecast.length; i++) {
    const prevValue = forecast[i-1].predicted;
    const currValue = forecast[i].predicted;
    const growth = ((currValue - prevValue) / prevValue) * 100;
    totalGrowth += growth;
  }
  
  const avgGrowth = totalGrowth / (forecast.length - 1);
  
  // Overall growth trend insight
  if (avgGrowth > 5) {
    insights.push(`Strong growth forecast: Average monthly increase of ${avgGrowth.toFixed(1)}%.`);
  } else if (avgGrowth > 2) {
    insights.push(`Moderate growth forecast: Average monthly increase of ${avgGrowth.toFixed(1)}%.`);
  } else if (avgGrowth > 0) {
    insights.push(`Slight growth forecast: Average monthly increase of ${avgGrowth.toFixed(1)}%.`);
  } else {
    insights.push(`Declining forecast: Average monthly decrease of ${Math.abs(avgGrowth).toFixed(1)}%.`);
  }
  
  // First to last month comparison
  const firstMonth = forecast[0].predicted;
  const lastMonth = forecast[forecast.length - 1].predicted;
  const totalChange = ((lastMonth - firstMonth) / firstMonth) * 100;
  
  insights.push(
    `Total forecasted ${totalChange > 0 ? 'growth' : 'decline'} of ${Math.abs(totalChange).toFixed(1)}% over the next ${forecast.length} months.`
  );
  
  // Uncertainty analysis
  const lastMonthUncertainty = ((forecast[forecast.length - 1].upperBound - forecast[forecast.length - 1].lowerBound) / forecast[forecast.length - 1].predicted) * 100;
  
  if (lastMonthUncertainty > 30) {
    insights.push(`High uncertainty in long-term forecast (±${(lastMonthUncertainty/2).toFixed(1)}%). Consider shorter planning cycles.`);
  } else if (lastMonthUncertainty > 15) {
    insights.push(`Moderate uncertainty in long-term forecast (±${(lastMonthUncertainty/2).toFixed(1)}%).`);
  } else {
    insights.push(`Low uncertainty in forecast (±${(lastMonthUncertainty/2).toFixed(1)}%). High confidence in predictions.`);
  }
  
  // Actionable recommendation
  if (avgGrowth > 3) {
    insights.push("With strong projected growth, consider investing in capacity expansion or new product development.");
  } else if (avgGrowth < 0) {
    insights.push("With projected decline, focus on cost optimization and exploring new revenue streams.");
  } else {
    insights.push("With stable growth projections, focus on operational efficiency and customer retention.");
  }
  
  return insights;
};

// Helper function to calculate the trend over a series of numbers
const calculateRecentTrend = (numbers: number[]): number => {
  if (numbers.length < 2) return 0;
  
  let sum = 0;
  for (let i = 1; i < numbers.length; i++) {
    const percentChange = ((numbers[i] - numbers[i-1]) / numbers[i-1]) * 100;
    sum += percentChange;
  }
  
  return sum / (numbers.length - 1);
};

// Initialize mock data
export const mockExpenses = generateMockExpenses(50);
export const mockRevenue = generateMockRevenue(12);
export const mockForecast = generateMockForecast(6);
export const mockCategoryBreakdown = calculateCategoryBreakdown(mockExpenses);
export const mockFinancialMetrics = generateFinancialMetrics(mockExpenses, mockRevenue);
