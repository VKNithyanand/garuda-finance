
import { Expense, ExpenseCategory } from './mockData';
import { toast } from 'sonner';

// Function to categorize expenses based on description and vendor
export const categorizeThroughAI = (description: string, vendor: string): ExpenseCategory => {
  const descLower = description.toLowerCase();
  const vendorLower = vendor.toLowerCase();
  
  if (descLower.includes('rent') || vendorLower.includes('property')) {
    return 'Rent';
  } else if (descLower.includes('salary') || descLower.includes('payroll') || vendorLower.includes('adp')) {
    return 'Payroll';
  } else if (descLower.includes('ad') || descLower.includes('campaign') || vendorLower.includes('facebook') || vendorLower.includes('google')) {
    return 'Marketing';
  } else if (descLower.includes('paper') || descLower.includes('supplies') || vendorLower.includes('staples') || vendorLower.includes('office')) {
    return 'Supplies';
  } else if (descLower.includes('electric') || descLower.includes('water') || descLower.includes('gas') || vendorLower.includes('utility')) {
    return 'Utilities';
  } else if (descLower.includes('flight') || descLower.includes('hotel') || vendorLower.includes('airline') || vendorLower.includes('travel')) {
    return 'Travel';
  } else if (descLower.includes('subscription') || descLower.includes('software') || vendorLower.includes('adobe') || vendorLower.includes('microsoft')) {
    return 'Software';
  } else if (descLower.includes('computer') || descLower.includes('hardware') || vendorLower.includes('dell') || vendorLower.includes('apple')) {
    return 'Equipment';
  } else if (descLower.includes('insurance') || descLower.includes('policy') || vendorLower.includes('insurance')) {
    return 'Insurance';
  } else {
    return 'Uncategorized';
  }
};

// Simulate AI processing of an expense
export const processExpenseWithAI = async (expense: Expense): Promise<Expense> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Analyze expense description and vendor to determine if it's categorized correctly
  const updatedExpense = { ...expense };
  
  // Logic to categorize based on description and vendor
  const suggestedCategory = categorizeThroughAI(expense.description, expense.vendor);
  
  // If expense is uncategorized or the suggested category is different from current
  if (expense.category === 'Uncategorized' || (suggestedCategory !== expense.category && Math.random() > 0.3)) {
    updatedExpense.category = suggestedCategory;
  }
  
  return updatedExpense;
};

// Analyze expense trends
export const analyzeExpenseTrends = async (expenses: Expense[]): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Group expenses by month
  const expensesByMonth: Record<string, number> = {};
  expenses.forEach(expense => {
    const month = expense.date.substring(0, 7); // YYYY-MM
    if (!expensesByMonth[month]) {
      expensesByMonth[month] = 0;
    }
    expensesByMonth[month] += expense.amount;
  });
  
  // Calculate month-over-month change
  const months = Object.keys(expensesByMonth).sort();
  const trends = [];
  
  for (let i = 1; i < months.length; i++) {
    const currentMonth = months[i];
    const previousMonth = months[i-1];
    const change = ((expensesByMonth[currentMonth] - expensesByMonth[previousMonth]) / expensesByMonth[previousMonth]) * 100;
    
    trends.push({
      month: currentMonth,
      amount: expensesByMonth[currentMonth],
      previousAmount: expensesByMonth[previousMonth],
      percentChange: change
    });
  }
  
  return {
    trends,
    averageMonthlyExpense: Object.values(expensesByMonth).reduce((sum, amount) => sum + amount, 0) / months.length,
    highestMonth: months.reduce((highest, month) => 
      expensesByMonth[month] > expensesByMonth[highest] ? month : highest, months[0]
    ),
    lowestMonth: months.reduce((lowest, month) => 
      expensesByMonth[month] < expensesByMonth[lowest] ? month : lowest, months[0]
    )
  };
};

// Analyze an expense report for anomalies
export const detectAnomalies = async (expenses: Expense[]): Promise<any> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  // Group by category to find outliers
  const expensesByCategory: Record<string, Expense[]> = {};
  expenses.forEach(expense => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = [];
    }
    expensesByCategory[expense.category].push(expense);
  });
  
  const anomalies = [];
  
  // Find anomalies in each category
  Object.entries(expensesByCategory).forEach(([category, categoryExpenses]) => {
    if (categoryExpenses.length < 3) return; // Need at least 3 for meaningful stats
    
    // Calculate mean and standard deviation
    const amounts = categoryExpenses.map(e => e.amount);
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    
    // Flag expenses that are more than 2 standard deviations away from the mean
    categoryExpenses.forEach(expense => {
      if (Math.abs(expense.amount - mean) > 2 * stdDev) {
        anomalies.push({
          expense,
          meanAmount: mean,
          deviation: (expense.amount - mean) / stdDev,
          significance: expense.amount > mean ? 'high' : 'low'
        });
      }
    });
  });
  
  // Find duplicate or similar transactions
  const potentialDuplicates = [];
  for (let i = 0; i < expenses.length; i++) {
    for (let j = i + 1; j < expenses.length; j++) {
      const a = expenses[i];
      const b = expenses[j];
      
      // Check if transactions are on the same day, same vendor, and similar amount
      if (a.date === b.date && a.vendor === b.vendor) {
        // Either exact amount match or very close (within 1%)
        const amountDiff = Math.abs(a.amount - b.amount) / Math.max(a.amount, b.amount);
        if (amountDiff < 0.01) {
          potentialDuplicates.push({ expense1: a, expense2: b });
        }
      }
    }
  }
  
  return {
    anomalies,
    potentialDuplicates,
    summary: {
      totalAnomalies: anomalies.length,
      totalDuplicates: potentialDuplicates.length,
      highValueAnomalies: anomalies.filter(a => a.significance === 'high').length,
      savings: potentialDuplicates.reduce((sum, { expense1 }) => sum + expense1.amount, 0)
    }
  };
};

// New function to implement AI suggestions for cost optimization
export const generateCostOptimizationSuggestions = async (expenses: Expense[]): Promise<string[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const suggestions: string[] = [];
  
  // Group expenses by category
  const expensesByCategory: Record<string, number> = {};
  expenses.forEach(expense => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = 0;
    }
    expensesByCategory[expense.category] += expense.amount;
  });
  
  // Total expenses
  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  
  // Check for high spending categories
  const categoryThresholds: Record<string, number> = {
    'Software': 0.12, // 12% of total expenses
    'Travel': 0.10,
    'Supplies': 0.08,
    'Marketing': 0.15,
  };
  
  Object.entries(expensesByCategory).forEach(([category, amount]) => {
    const percentage = amount / totalExpenses;
    const threshold = categoryThresholds[category as ExpenseCategory] || 0.20;
    
    if (percentage > threshold) {
      if (category === 'Software') {
        suggestions.push(`Your software expenses (${(percentage * 100).toFixed(1)}% of total) seem high. Consider auditing subscriptions for unused services.`);
      } else if (category === 'Travel') {
        suggestions.push(`Travel expenses represent ${(percentage * 100).toFixed(1)}% of your total spending. Consider implementing a stricter travel policy or using video conferencing.`);
      } else if (category === 'Supplies') {
        suggestions.push(`Office supplies account for ${(percentage * 100).toFixed(1)}% of expenses. Consider bulk purchasing or negotiating with suppliers for better rates.`);
      } else if (category === 'Marketing') {
        suggestions.push(`Marketing costs (${(percentage * 100).toFixed(1)}% of total) are significant. Review campaign ROI and focus on high-performing channels.`);
      }
    }
  });
  
  // Duplicate expense detection
  const { potentialDuplicates } = await detectAnomalies(expenses);
  if (potentialDuplicates.length > 0) {
    suggestions.push(`Detected ${potentialDuplicates.length} potential duplicate transactions that could save approximately $${potentialDuplicates.reduce((sum, { expense1 }) => sum + expense1.amount, 0).toFixed(2)}.`);
  }
  
  // Vendor analysis (find multiple vendors for same category)
  const vendorsByCategory: Record<string, Set<string>> = {};
  expenses.forEach(expense => {
    if (!vendorsByCategory[expense.category]) {
      vendorsByCategory[expense.category] = new Set();
    }
    vendorsByCategory[expense.category].add(expense.vendor);
  });
  
  Object.entries(vendorsByCategory).forEach(([category, vendors]) => {
    if (vendors.size > 3 && ['Supplies', 'Software', 'Equipment'].includes(category)) {
      suggestions.push(`You're using ${vendors.size} different vendors for ${category}. Consider consolidating to negotiate better rates.`);
    }
  });
  
  // Add general suggestions if we don't have enough specific ones
  if (suggestions.length < 3) {
    suggestions.push("Consider implementing a formal approval process for expenses above a certain threshold.");
    suggestions.push("Regularly review recurring expenses to identify services that are no longer needed.");
    suggestions.push("Negotiate early payment discounts with your regular vendors.");
  }
  
  return suggestions;
};
