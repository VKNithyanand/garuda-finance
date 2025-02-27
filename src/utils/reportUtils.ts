
import { Expense, ExpenseCategory, generateMockExpenses, generateMockRevenue, generateMockForecast, calculateCategoryBreakdown } from './mockData';
import { analyzeExpensesForOptimizations } from './optimizationUtils';

// Define report result types
export interface ReportResult {
  title: string;
  date: string;
  summary: string;
  data: any;
  insights: string[];
}

/**
 * Generate a financial report based on type
 */
export const generateReport = async (reportType: string): Promise<ReportResult> => {
  // For demo purposes, we're using mock data
  // In a real app, this would fetch actual data from a database
  const mockExpenses = generateMockExpenses(50);
  const mockRevenue = generateMockRevenue(12);
  const mockForecast = generateMockForecast(6);
  
  // Simulate network delay for API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  switch (reportType) {
    case 'expense':
      return generateExpenseReport(mockExpenses);
    case 'budget':
      return generateBudgetReport(mockExpenses, mockRevenue);
    case 'forecast':
      return generateForecastReport(mockRevenue, mockForecast);
    case 'optimization':
      return generateOptimizationReport(mockExpenses);
    default:
      throw new Error(`Unknown report type: ${reportType}`);
  }
};

/**
 * Generate an expense analysis report
 */
const generateExpenseReport = (expenses: Expense[]): ReportResult => {
  const categoryBreakdown = calculateCategoryBreakdown(expenses);
  const totalSpend = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate month-over-month change
  const thisMonth = new Date().getMonth();
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === thisMonth;
  });
  
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === lastMonth;
  });
  
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const monthOverMonthChange = lastMonthTotal !== 0 
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
    : 0;
  
  // Generate insights based on the data
  const insights = [
    `Total expenses for the period: $${totalSpend.toLocaleString()}`,
    `Month-over-month change: ${monthOverMonthChange.toFixed(1)}%`,
    `Largest expense category: ${categoryBreakdown[0]?.category || 'N/A'} (${categoryBreakdown[0]?.percentage.toFixed(1) || 0}%)`,
    `Average transaction amount: $${(totalSpend / expenses.length).toFixed(2)}`,
    `Number of transactions: ${expenses.length}`
  ];
  
  // Add category-specific insights
  if (categoryBreakdown.length > 0) {
    // Find categories with significant percentage
    const significantCategories = categoryBreakdown
      .filter(cat => cat.percentage > 15)
      .map(cat => `${cat.category} accounts for ${cat.percentage.toFixed(1)}% of total expenses`);
    
    if (significantCategories.length > 0) {
      insights.push(...significantCategories);
    }
  }
  
  return {
    title: 'Expense Analysis',
    date: new Date().toISOString(),
    summary: `Analysis of ${expenses.length} expenses totaling $${totalSpend.toLocaleString()}`,
    data: {
      totalExpenses: totalSpend,
      categoryBreakdown,
      monthOverMonthChange,
      transactionCount: expenses.length,
      averageTransaction: totalSpend / expenses.length
    },
    insights
  };
};

/**
 * Generate a budget compliance report
 */
const generateBudgetReport = (expenses: Expense[], revenue: any[]): ReportResult => {
  // For demo purposes, we'll create a simulated budget
  const categories: ExpenseCategory[] = [
    "Rent", "Payroll", "Marketing", "Supplies", "Utilities", 
    "Travel", "Software", "Equipment", "Insurance", "Uncategorized"
  ];
  
  const mockBudget = categories.reduce((budget, category) => {
    // Random budget between $1000 and $10000
    budget[category] = Math.round((1000 + Math.random() * 9000) * 100) / 100;
    return budget;
  }, {} as Record<ExpenseCategory, number>);
  
  // Calculate actual spending by category
  const actualSpending = categories.reduce((actual, category) => {
    actual[category] = expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return actual;
  }, {} as Record<ExpenseCategory, number>);
  
  // Calculate variance and compliance
  const complianceData = categories.map(category => {
    const budgeted = mockBudget[category];
    const actual = actualSpending[category];
    const variance = budgeted - actual;
    const percentUtilized = (actual / budgeted) * 100;
    
    return {
      category,
      budgeted,
      actual,
      variance,
      percentUtilized,
      status: percentUtilized <= 100 ? 'Within Budget' : 'Over Budget'
    };
  });
  
  // Sort by percentage utilized, descending
  complianceData.sort((a, b) => b.percentUtilized - a.percentUtilized);
  
  // Generate insights
  const overBudgetCategories = complianceData.filter(item => item.percentUtilized > 100);
  const underBudgetCategories = complianceData.filter(item => item.percentUtilized < 80);
  
  const insights = [
    `Total budget utilization: ${((complianceData.reduce((sum, item) => sum + item.actual, 0) / 
      complianceData.reduce((sum, item) => sum + item.budgeted, 0)) * 100).toFixed(1)}%`,
    `${overBudgetCategories.length} categories are over budget`,
    `${underBudgetCategories.length} categories are under 80% utilized`
  ];
  
  // Add specific insights for over-budget categories
  if (overBudgetCategories.length > 0) {
    overBudgetCategories.slice(0, 3).forEach(item => {
      insights.push(`${item.category} is ${(item.percentUtilized - 100).toFixed(1)}% over budget ($${item.variance.toFixed(2)} overspent)`);
    });
  }
  
  return {
    title: 'Budget Compliance',
    date: new Date().toISOString(),
    summary: `Budget compliance analysis across ${categories.length} expense categories`,
    data: {
      complianceData,
      overBudgetCategories: overBudgetCategories.length,
      underBudgetCategories: underBudgetCategories.length,
      totalBudget: Object.values(mockBudget).reduce((sum, amount) => sum + amount, 0),
      totalActual: Object.values(actualSpending).reduce((sum, amount) => sum + amount, 0)
    },
    insights
  };
};

/**
 * Generate a financial forecast report
 */
const generateForecastReport = (revenue: any[], forecast: any[]): ReportResult => {
  // Calculate revenue trends
  const revenueValues = revenue.map(item => item.amount);
  const revenueGrowthRates = [];
  
  for (let i = 1; i < revenueValues.length; i++) {
    const growthRate = ((revenueValues[i] - revenueValues[i-1]) / revenueValues[i-1]) * 100;
    revenueGrowthRates.push(growthRate);
  }
  
  // Calculate average growth rate
  const avgGrowthRate = revenueGrowthRates.reduce((sum, rate) => sum + rate, 0) / revenueGrowthRates.length;
  
  // Generate confidence intervals based on historical volatility
  const volatility = calculateVolatility(revenueGrowthRates);
  
  // Generate insights
  const insights = [
    `Average monthly growth rate: ${avgGrowthRate.toFixed(2)}%`,
    `Growth trend: ${avgGrowthRate > 0 ? 'Positive' : 'Negative'}`,
    `Forecast confidence: ${volatility < 5 ? 'High' : volatility < 15 ? 'Medium' : 'Low'}`,
    `Projected revenue in 6 months: $${forecast[forecast.length - 1].predicted.toLocaleString()}`
  ];
  
  // Add seasonal insights if detected
  const seasonalPatterns = detectSeasonalPatterns(revenueValues);
  if (seasonalPatterns.detected) {
    insights.push(`Seasonal pattern detected: ${seasonalPatterns.description}`);
  }
  
  // Add business recommendation
  if (avgGrowthRate > 10) {
    insights.push('Consider expanding operations based on strong growth trend');
  } else if (avgGrowthRate > 0) {
    insights.push('Maintain current strategy while focusing on optimization');
  } else {
    insights.push('Evaluate cost-cutting measures due to negative growth trend');
  }
  
  return {
    title: 'Financial Forecast',
    date: new Date().toISOString(),
    summary: `6-month financial forecast with ${volatility < 10 ? 'high' : volatility < 20 ? 'medium' : 'low'} confidence`,
    data: {
      historicalRevenue: revenue,
      forecastData: forecast,
      avgGrowthRate,
      volatility,
      confidenceLevel: volatility < 5 ? 'High' : volatility < 15 ? 'Medium' : 'Low',
      seasonalPatterns
    },
    insights
  };
};

/**
 * Generate an optimization report
 */
const generateOptimizationReport = (expenses: Expense[]): ReportResult => {
  // Get optimization recommendations
  const recommendations = analyzeExpensesForOptimizations(expenses);
  
  // Calculate potential savings
  const totalPotentialSavings = recommendations.reduce(
    (sum, rec) => sum + rec.potentialSavings, 
    0
  );
  
  // Group by implementation difficulty
  const byDifficulty = recommendations.reduce((groups, rec) => {
    if (!groups[rec.implementationDifficulty]) {
      groups[rec.implementationDifficulty] = [];
    }
    groups[rec.implementationDifficulty].push(rec);
    return groups;
  }, {} as Record<string, any[]>);
  
  // Group by category
  const byCategory = recommendations.reduce((groups, rec) => {
    if (!groups[rec.category]) {
      groups[rec.category] = [];
    }
    groups[rec.category].push(rec);
    return groups;
  }, {} as Record<string, any[]>);
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Generate insights
  const insights = [
    `Total potential savings: $${totalPotentialSavings.toLocaleString()} (${((totalPotentialSavings / totalExpenses) * 100).toFixed(1)}% of expenses)`,
    `${recommendations.length} cost-saving opportunities identified`,
    `${byDifficulty['easy']?.length || 0} easy-to-implement recommendations`,
    `Highest savings category: ${getHighestSavingsCategory(byCategory)}`
  ];
  
  // Add top recommendations
  const topRecommendations = recommendations
    .sort((a, b) => b.potentialSavings - a.potentialSavings)
    .slice(0, 3);
  
  topRecommendations.forEach(rec => {
    insights.push(`${rec.title}: Save $${rec.potentialSavings.toLocaleString()}`);
  });
  
  return {
    title: 'Cost Optimization',
    date: new Date().toISOString(),
    summary: `${recommendations.length} cost-saving opportunities with potential savings of $${totalPotentialSavings.toLocaleString()}`,
    data: {
      recommendations,
      byDifficulty,
      byCategory,
      totalPotentialSavings,
      percentOfExpenses: (totalPotentialSavings / totalExpenses) * 100,
      implementationRoadmap: generateImplementationRoadmap(recommendations)
    },
    insights
  };
};

// Helper function to calculate volatility (standard deviation)
const calculateVolatility = (values: number[]): number => {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(variance);
};

// Helper function to detect seasonal patterns
const detectSeasonalPatterns = (values: number[]): { detected: boolean, description: string } => {
  // This is a simplified algorithm for demonstration
  // A real implementation would use time series analysis
  
  // For this demo, we'll just return random results
  const detected = Math.random() > 0.5;
  
  let description = '';
  if (detected) {
    const patterns = [
      'Higher revenue in Q4',
      'Monthly cyclical pattern',
      'Weekend vs weekday variance',
      'Quarterly seasonal effect'
    ];
    description = patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  return { detected, description };
};

// Helper function to get highest savings category
const getHighestSavingsCategory = (byCategory: Record<string, any[]>): string => {
  let highestCategory = '';
  let highestSavings = 0;
  
  Object.entries(byCategory).forEach(([category, recs]) => {
    const categorySavings = recs.reduce((sum, rec) => sum + rec.potentialSavings, 0);
    if (categorySavings > highestSavings) {
      highestSavings = categorySavings;
      highestCategory = category;
    }
  });
  
  return `${highestCategory} ($${highestSavings.toLocaleString()})`;
};

// Helper function to generate implementation roadmap
const generateImplementationRoadmap = (recommendations: any[]): any[] => {
  // Sort by implementation difficulty and savings potential
  const sortedRecs = [...recommendations].sort((a, b) => {
    // First by difficulty (easy first)
    const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
    const diffDiff = difficultyOrder[a.implementationDifficulty as keyof typeof difficultyOrder] - 
                    difficultyOrder[b.implementationDifficulty as keyof typeof difficultyOrder];
    
    if (diffDiff !== 0) return diffDiff;
    
    // Then by savings (highest first)
    return b.potentialSavings - a.potentialSavings;
  });
  
  // Create a timeline with phases
  return [
    {
      phase: 'Phase 1: Quick Wins (Week 1-2)',
      recommendations: sortedRecs.filter(r => r.implementationDifficulty === 'easy').slice(0, 3)
    },
    {
      phase: 'Phase 2: Medium Effort (Week 3-6)',
      recommendations: sortedRecs.filter(r => r.implementationDifficulty === 'medium').slice(0, 3)
    },
    {
      phase: 'Phase 3: Strategic Changes (Week 7-12)',
      recommendations: sortedRecs.filter(r => r.implementationDifficulty === 'hard').slice(0, 2)
    }
  ];
};
