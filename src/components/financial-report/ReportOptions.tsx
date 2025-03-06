
import { PieChart, BarChart3, TrendingUp, FileText } from "lucide-react";

export type ReportType = "expense" | "budget" | "forecast" | "optimization";

export interface ReportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  type: ReportType;
}

export const reportOptions: ReportOption[] = [
  {
    id: "expense-report",
    title: "Expense Analysis",
    description: "Detailed breakdown of your spending patterns",
    icon: PieChart,
    type: "expense"
  },
  {
    id: "budget-report",
    title: "Budget Compliance",
    description: "How well you're staying within budget limits",
    icon: BarChart3,
    type: "budget"
  },
  {
    id: "forecast-report",
    title: "Financial Forecast",
    description: "Projected financials for the next quarter",
    icon: TrendingUp,
    type: "forecast"
  },
  {
    id: "optimization-report",
    title: "Savings Opportunities",
    description: "AI-generated cost optimization analysis",
    icon: FileText,
    type: "optimization"
  }
];
