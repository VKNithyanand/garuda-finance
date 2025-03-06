
import { ReportType } from "@/components/financial-report/ReportOptions";
import { PieChart, BarChart3, TrendingUp, FileText } from "lucide-react";

export interface GeneratedReport {
  id: string;
  title: string;
  date: string;
  type: ReportType;
  data: any;
  charts: string[];
}

// Format the date for display
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get the icon for a report type
export const getReportTypeIcon = (type: ReportType) => {
  switch(type) {
    case 'expense': return PieChart;
    case 'budget': return BarChart3;
    case 'forecast': return TrendingUp;
    case 'optimization': return FileText;
    default: return FileText;
  }
};
