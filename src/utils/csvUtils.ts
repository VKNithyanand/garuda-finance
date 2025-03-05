
import { Expense, ExpenseCategory, Revenue, ForecastData } from './mockData';
import Papa from 'papaparse';
import { toast } from 'sonner';

// Function to parse CSV data for expenses
export const parseExpenseCSV = (csvContent: string): Expense[] => {
  try {
    const { data, errors } = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      console.error("CSV parsing errors:", errors);
      toast.error("Error parsing CSV file");
      return [];
    }

    // Map CSV data to Expense objects
    const expenses: Expense[] = data.map((row: any, index: number) => {
      // Handle category validation
      const categories: ExpenseCategory[] = [
        "Rent", "Payroll", "Marketing", "Supplies", "Utilities", 
        "Travel", "Software", "Equipment", "Insurance", "Uncategorized"
      ];
      
      const category = categories.includes(row.category) 
        ? row.category as ExpenseCategory 
        : "Uncategorized";

      return {
        id: row.id || `exp-${index + 1}`,
        date: row.date || new Date().toISOString().split('T')[0],
        amount: parseFloat(row.amount) || 0,
        description: row.description || "Imported expense",
        category: category,
        vendor: row.vendor || "Unknown vendor"
      };
    });

    return expenses;
  } catch (error) {
    console.error("Failed to parse expense CSV:", error);
    toast.error("Failed to parse the CSV file");
    return [];
  }
};

// Function to parse CSV data for revenue
export const parseRevenueCSV = (csvContent: string): Revenue[] => {
  try {
    const { data, errors } = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      console.error("CSV parsing errors:", errors);
      toast.error("Error parsing CSV file");
      return [];
    }

    // Map CSV data to Revenue objects
    const revenue: Revenue[] = data.map((row: any) => {
      return {
        date: row.date || new Date().toISOString().split('T')[0].substring(0, 7),
        amount: parseFloat(row.amount) || 0
      };
    }).sort((a, b) => a.date.localeCompare(b.date));

    return revenue;
  } catch (error) {
    console.error("Failed to parse revenue CSV:", error);
    toast.error("Failed to parse the CSV file");
    return [];
  }
};

// Function to parse CSV data for forecast
export const parseForecastCSV = (csvContent: string): ForecastData[] => {
  try {
    const { data, errors } = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      console.error("CSV parsing errors:", errors);
      toast.error("Error parsing CSV file");
      return [];
    }

    // Map CSV data to ForecastData objects
    const forecast: ForecastData[] = data.map((row: any) => {
      return {
        date: row.date || new Date().toISOString().split('T')[0].substring(0, 7),
        predicted: parseFloat(row.predicted) || 0,
        lowerBound: parseFloat(row.lowerBound) || 0,
        upperBound: parseFloat(row.upperBound) || 0
      };
    }).sort((a, b) => a.date.localeCompare(b.date));

    return forecast;
  } catch (error) {
    console.error("Failed to parse forecast CSV:", error);
    toast.error("Failed to parse the CSV file");
    return [];
  }
};

// Function to validate an expense dataset
export const validateExpenseData = (expenses: Expense[]): boolean => {
  if (!Array.isArray(expenses) || expenses.length === 0) {
    toast.error("Invalid expense data: Empty or not an array");
    return false;
  }

  // Check if all required properties exist
  for (const expense of expenses) {
    if (!expense.date || !expense.amount || expense.amount < 0) {
      toast.error("Invalid expense data: Missing date or amount");
      return false;
    }
  }

  return true;
};

// Function to validate a revenue dataset
export const validateRevenueData = (revenue: Revenue[]): boolean => {
  if (!Array.isArray(revenue) || revenue.length === 0) {
    toast.error("Invalid revenue data: Empty or not an array");
    return false;
  }

  // Check if all required properties exist
  for (const entry of revenue) {
    if (!entry.date || !entry.amount || entry.amount < 0) {
      toast.error("Invalid revenue data: Missing date or amount");
      return false;
    }
  }

  return true;
};

// Function to validate a forecast dataset
export const validateForecastData = (forecast: ForecastData[]): boolean => {
  if (!Array.isArray(forecast) || forecast.length === 0) {
    toast.error("Invalid forecast data: Empty or not an array");
    return false;
  }

  // Check if all required properties exist
  for (const entry of forecast) {
    if (!entry.date || !entry.predicted || 
        entry.lowerBound === undefined || entry.upperBound === undefined) {
      toast.error("Invalid forecast data: Missing required fields");
      return false;
    }
  }

  return true;
};
