
import { OptimizationRecommendation } from "./optimizationUtils";

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500';
    case 'medium':
      return 'bg-amber-500';
    case 'hard':
      return 'bg-red-500';
    default:
      return 'bg-slate-500';
  }
};

export const generateOptimizationReport = (
  recommendations: OptimizationRecommendation[],
  implementedItems: string[],
  totalPotentialSavings: number,
  savings: number
) => {
  return {
    title: "Cost Optimization Report",
    date: new Date().toISOString(),
    totalPotentialSavings: formatCurrency(totalPotentialSavings),
    implementedSavings: formatCurrency(savings),
    implementedCount: implementedItems.length,
    totalRecommendations: recommendations.length,
    implementedItems: recommendations.filter(rec => implementedItems.includes(rec.id)),
    pendingItems: recommendations.filter(rec => !implementedItems.includes(rec.id)),
  };
};

export const downloadReport = (reportData: any) => {
  const reportBlob = new Blob(
    [JSON.stringify(reportData, null, 2)], 
    { type: 'application/json' }
  );
  
  const url = URL.createObjectURL(reportBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cost-optimization-report-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
