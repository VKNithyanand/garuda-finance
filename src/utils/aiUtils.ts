
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
  const description = expense.description.toLowerCase();
  const vendor = expense.vendor.toLowerCase();
  
  if (expense.category === 'Uncategorized') {
    // Try to categorize uncategorized expenses
    if (description.includes('rent') || vendor.includes('property')) {
      updatedExpense.category = 'Rent';
    } else if (description.includes('salary') || description.includes('payroll') || vendor.includes('adp')) {
      updatedExpense.category = 'Payroll';
    } else if (description.includes('ad') || description.includes('campaign') || vendor.includes('facebook') || vendor.includes('google')) {
      updatedExpense.category = 'Marketing';
    } else if (description.includes('paper') || description.includes('supplies') || vendor.includes('staples') || vendor.includes('office')) {
      updatedExpense.category = 'Supplies';
    } else if (description.includes('electric') || description.includes('water') || description.includes('gas') || vendor.includes('utility')) {
      updatedExpense.category = 'Utilities';
    } else if (description.includes('flight') || description.includes('hotel') || vendor.includes('airline') || vendor.includes('travel')) {
      updatedExpense.category = 'Travel';
    } else if (description.includes('subscription') || description.includes('software') || vendor.includes('adobe') || vendor.includes('microsoft')) {
      updatedExpense.category = 'Software';
    } else if (description.includes('computer') || description.includes('hardware') || vendor.includes('dell') || vendor.includes('apple')) {
      updatedExpense.category = 'Equipment';
    } else if (description.includes('insurance') || description.includes('policy') || vendor.includes('insurance')) {
      updatedExpense.category = 'Insurance';
    }
  } else {
    // Check if current category makes sense, suggest a better one if needed
    // Define the category patterns with proper type
    const categoryPatterns: Record<string, string[]> = {
      'Rent': ['rent', 'lease', 'property', 'office space'],
      'Payroll': ['salary', 'wage', 'payroll', 'bonus', 'compensation'],
      'Marketing': ['ad', 'campaign', 'promotion', 'marketing', 'advertising'],
      'Supplies': ['paper', 'supplies', 'office supplies', 'stationery'],
      'Utilities': ['electric', 'water', 'gas', 'utility', 'power'],
      'Travel': ['flight', 'hotel', 'travel', 'trip', 'fare'],
      'Software': ['subscription', 'software', 'license', 'saas'],
      'Equipment': ['computer', 'hardware', 'printer', 'equipment'],
      'Insurance': ['insurance', 'policy', 'coverage', 'premium'],
      'Uncategorized': []
    };
    
    // Check if the expense matches a different category better
    let bestMatch: ExpenseCategory = 'Uncategorized';
    let bestMatchScore = 0;
    
    Object.entries(categoryPatterns).forEach(([category, patterns]) => {
      let score = 0;
      patterns.forEach(pattern => {
        if (description.includes(pattern) || vendor.includes(pattern)) {
          score++;
        }
      });
      
      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = category as ExpenseCategory;
      }
    });
    
    if (bestMatchScore > 0 && bestMatch !== expense.category) {
      updatedExpense.category = bestMatch;
    }
  }
  
  return updatedExpense;
};

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
