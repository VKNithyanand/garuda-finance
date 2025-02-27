
import { Expense, ExpenseCategory } from "./mockData";

// Types for optimization recommendations
export interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  category: ExpenseCategory;
  confidence: number;
  implementationDifficulty: 'easy' | 'medium' | 'hard';
}

// Simulate AI-based analysis of expenses to generate cost-saving recommendations
export const analyzeExpensesForOptimizations = (expenses: Expense[]): OptimizationRecommendation[] => {
  const recommendations: OptimizationRecommendation[] = [];
  
  // Group expenses by category
  const expensesByCategory: Record<ExpenseCategory, Expense[]> = {} as Record<ExpenseCategory, Expense[]>;
  
  expenses.forEach(expense => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = [];
    }
    expensesByCategory[expense.category].push(expense);
  });
  
  // Analyze for category-specific optimization opportunities
  Object.entries(expensesByCategory).forEach(([category, categoryExpenses]) => {
    const typedCategory = category as ExpenseCategory;
    
    // Skip categories with very few expenses
    if (categoryExpenses.length < 2) return;
    
    // Calculate total spend in category
    const totalCategorySpend = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Look for duplicate vendors (potential consolidation)
    const vendorCounts: Record<string, {count: number, total: number}> = {};
    categoryExpenses.forEach(expense => {
      if (!vendorCounts[expense.vendor]) {
        vendorCounts[expense.vendor] = { count: 0, total: 0 };
      }
      vendorCounts[expense.vendor].count += 1;
      vendorCounts[expense.vendor].total += expense.amount;
    });
    
    // Find vendors with multiple transactions
    Object.entries(vendorCounts).forEach(([vendor, stats]) => {
      if (stats.count >= 3) {
        // Suggest bulk purchasing or contract negotiation
        recommendations.push({
          id: `consolidate-${typedCategory}-${vendor}`.toLowerCase().replace(/\s+/g, '-'),
          title: `Consolidate ${vendor} purchases`,
          description: `You've made ${stats.count} separate purchases from ${vendor} totaling $${stats.total.toFixed(2)}. Consider negotiating a bulk purchase agreement to save on costs.`,
          potentialSavings: stats.total * 0.15, // Estimate 15% savings from consolidation
          category: typedCategory,
          confidence: 0.75 + (Math.random() * 0.15),
          implementationDifficulty: 'easy'
        });
      }
    });
    
    // Category-specific recommendations
    switch (typedCategory) {
      case 'Software':
        if (totalCategorySpend > 5000) {
          recommendations.push({
            id: 'software-audit',
            title: 'Software license audit',
            description: `Your software expenses total $${totalCategorySpend.toFixed(2)}. Consider auditing licenses to identify unused subscriptions and negotiate enterprise discounts.`,
            potentialSavings: totalCategorySpend * 0.25,
            category: 'Software',
            confidence: 0.85,
            implementationDifficulty: 'medium'
          });
        }
        break;
        
      case 'Utilities':
        recommendations.push({
          id: 'utility-optimization',
          title: 'Optimize utility usage',
          description: 'Consider energy-efficient equipment and practices to reduce utility costs over time.',
          potentialSavings: totalCategorySpend * 0.12,
          category: 'Utilities',
          confidence: 0.7,
          implementationDifficulty: 'medium'
        });
        break;
        
      case 'Travel':
        if (totalCategorySpend > 3000) {
          recommendations.push({
            id: 'travel-policy',
            title: 'Implement travel policy guidelines',
            description: 'Create clear travel expense guidelines and preferred vendors to control travel costs.',
            potentialSavings: totalCategorySpend * 0.2,
            category: 'Travel',
            confidence: 0.8,
            implementationDifficulty: 'medium'
          });
        }
        break;
        
      case 'Supplies':
        recommendations.push({
          id: 'supplies-inventory',
          title: 'Implement supplies inventory system',
          description: 'Track office supplies usage to prevent overordering and waste.',
          potentialSavings: totalCategorySpend * 0.18,
          category: 'Supplies',
          confidence: 0.82,
          implementationDifficulty: 'easy'
        });
        break;
        
      case 'Marketing':
        recommendations.push({
          id: 'marketing-roi',
          title: 'Evaluate marketing ROI',
          description: 'Analyze marketing channel performance to focus spending on high-return activities.',
          potentialSavings: totalCategorySpend * 0.3,
          category: 'Marketing',
          confidence: 0.75,
          implementationDifficulty: 'hard'
        });
        break;
    }
  });
  
  // General recommendations based on overall spending patterns
  if (expenses.length > 10) {
    recommendations.push({
      id: 'expense-policy',
      title: 'Develop formal expense policy',
      description: 'Implementing a clear expense policy can reduce overall expenses by setting spending limits and approval workflows.',
      potentialSavings: expenses.reduce((sum, exp) => sum + exp.amount, 0) * 0.08,
      category: 'Uncategorized',
      confidence: 0.9,
      implementationDifficulty: 'medium'
    });
  }
  
  return recommendations;
};

// Calculate potential total savings
export const calculatePotentialSavings = (recommendations: OptimizationRecommendation[]): number => {
  return recommendations.reduce((total, rec) => total + rec.potentialSavings, 0);
};

// Categorize recommendations by implementation difficulty
export const categorizeByDifficulty = (recommendations: OptimizationRecommendation[]): Record<string, OptimizationRecommendation[]> => {
  return recommendations.reduce((acc, rec) => {
    if (!acc[rec.implementationDifficulty]) {
      acc[rec.implementationDifficulty] = [];
    }
    acc[rec.implementationDifficulty].push(rec);
    return acc;
  }, {} as Record<string, OptimizationRecommendation[]>);
};
