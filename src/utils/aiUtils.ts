
import { Expense, ExpenseCategory } from "./mockData";

// Simple keyword-based categorization to simulate AI
const keywordMap: Record<ExpenseCategory, string[]> = {
  "Rent": ["rent", "lease", "office space", "coworking", "wework", "regus"],
  "Payroll": ["salary", "payroll", "wage", "compensation", "bonus", "commission"],
  "Marketing": ["ads", "advertising", "promotion", "campaign", "social media", "seo"],
  "Supplies": ["supplies", "paper", "ink", "pens", "office depot", "staples"],
  "Utilities": ["utility", "electric", "water", "gas", "internet", "phone", "verizon"],
  "Travel": ["travel", "flight", "hotel", "uber", "lyft", "taxi", "airfare"],
  "Software": ["software", "subscription", "saas", "license", "adobe", "salesforce"],
  "Equipment": ["equipment", "hardware", "computer", "laptop", "printer", "device"],
  "Insurance": ["insurance", "coverage", "policy", "health", "liability"],
  "Uncategorized": []
};

// Simulated AI-based categorization
export const categorizeThroughAI = (description: string, vendor: string): ExpenseCategory => {
  const combinedText = `${description.toLowerCase()} ${vendor.toLowerCase()}`;
  
  for (const [category, keywords] of Object.entries(keywordMap)) {
    if (category !== "Uncategorized" && keywords.some(keyword => combinedText.includes(keyword))) {
      return category as ExpenseCategory;
    }
  }
  
  return "Uncategorized";
};

// Mock function to simulate AI processing with delay
export const processExpenseWithAI = async (expense: Expense): Promise<Expense> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (expense.category === "Uncategorized") {
        const suggestedCategory = categorizeThroughAI(expense.description, expense.vendor);
        resolve({
          ...expense,
          category: suggestedCategory
        });
      } else {
        resolve(expense);
      }
    }, 600); // Simulate AI processing time
  });
};

// Process a batch of expenses
export const batchProcessExpenses = async (expenses: Expense[]): Promise<Expense[]> => {
  return await Promise.all(
    expenses.map(expense => processExpenseWithAI(expense))
  );
};

// Get a confidence score for the AI categorization (mock)
export const getConfidenceScore = (description: string, vendor: string, category: ExpenseCategory): number => {
  const combinedText = `${description.toLowerCase()} ${vendor.toLowerCase()}`;
  const keywords = keywordMap[category] || [];
  
  let matchCount = 0;
  keywords.forEach(keyword => {
    if (combinedText.includes(keyword)) matchCount++;
  });
  
  if (keywords.length === 0) return 0;
  const baseConfidence = (matchCount / keywords.length) * 0.7;
  
  // Add some randomness to make it look more realistic
  return Math.min(baseConfidence + Math.random() * 0.3, 0.98);
};
