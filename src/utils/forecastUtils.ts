
import { Revenue, ForecastData } from "./mockData";

// Simulated time-series forecasting
export const generateForecast = (historicalData: Revenue[], months: number): ForecastData[] => {
  // Extract just the revenue amounts
  const values = historicalData.map(d => d.amount);
  
  // Calculate simple moving average for last 3 periods
  const movingAvgPeriods = Math.min(3, values.length);
  const recentValues = values.slice(-movingAvgPeriods);
  const averageRevenue = recentValues.reduce((sum, val) => sum + val, 0) / movingAvgPeriods;
  
  // Calculate average growth rate
  let growthRates: number[] = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i-1] > 0) {
      growthRates.push(values[i] / values[i-1] - 1);
    }
  }
  
  const avgGrowthRate = growthRates.length > 0
    ? growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length
    : 0.03; // Default to 3% if we don't have enough data
    
  // Calculate trend volatility to determine confidence intervals
  const volatility = growthRates.length > 0
    ? Math.sqrt(growthRates.reduce((sum, rate) => sum + Math.pow(rate - avgGrowthRate, 2), 0) / growthRates.length)
    : 0.02; // Default volatility
  
  // Generate forecast
  const forecast: ForecastData[] = [];
  let lastPredicted = values[values.length - 1] || averageRevenue;
  
  for (let i = 0; i < months; i++) {
    // Apply growth with some random variation
    const growthNoise = (Math.random() - 0.5) * volatility;
    const adjustedGrowth = avgGrowthRate + growthNoise;
    const predictedValue = lastPredicted * (1 + adjustedGrowth);
    
    // Uncertainty increases with time
    const uncertaintyFactor = 0.1 + (i * 0.03);
    const lowerBound = predictedValue * (1 - uncertaintyFactor);
    const upperBound = predictedValue * (1 + uncertaintyFactor);
    
    // Format date for next month
    const lastDate = new Date();
    lastDate.setMonth(lastDate.getMonth() + i + 1);
    const dateString = `${lastDate.getFullYear()}-${String(lastDate.getMonth() + 1).padStart(2, '0')}`;
    
    forecast.push({
      date: dateString,
      predicted: parseFloat(predictedValue.toFixed(2)),
      lowerBound: parseFloat(lowerBound.toFixed(2)),
      upperBound: parseFloat(upperBound.toFixed(2))
    });
    
    lastPredicted = predictedValue;
  }
  
  return forecast;
};

// Analyze historical data and extract insights
export const generateInsights = (historicalData: Revenue[]): string[] => {
  if (historicalData.length < 3) {
    return ["Not enough historical data to generate meaningful insights."];
  }
  
  const insights: string[] = [];
  const values = historicalData.map(d => d.amount);
  
  // Check for overall trend
  const firstVal = values[0];
  const lastVal = values[values.length - 1];
  const percentChange = ((lastVal - firstVal) / firstVal) * 100;
  
  if (percentChange > 20) {
    insights.push(`Strong growth trend: Revenue increased by ${percentChange.toFixed(1)}% over the analyzed period.`);
  } else if (percentChange > 5) {
    insights.push(`Moderate growth trend: Revenue increased by ${percentChange.toFixed(1)}% over the analyzed period.`);
  } else if (percentChange < -10) {
    insights.push(`Significant decline: Revenue decreased by ${Math.abs(percentChange).toFixed(1)}% over the analyzed period.`);
  } else if (percentChange < 0) {
    insights.push(`Slight decline: Revenue decreased by ${Math.abs(percentChange).toFixed(1)}% over the analyzed period.`);
  } else {
    insights.push(`Stable revenue: Only ${percentChange.toFixed(1)}% change over the analyzed period.`);
  }
  
  // Check for recent trend
  const recentValues = values.slice(-3);
  if (recentValues.length >= 3) {
    if (recentValues[2] > recentValues[1] && recentValues[1] > recentValues[0]) {
      insights.push("Recent upward momentum: Revenue has increased for 3 consecutive months.");
    } else if (recentValues[2] < recentValues[1] && recentValues[1] < recentValues[0]) {
      insights.push("Recent downward trend: Revenue has decreased for 3 consecutive months.");
    }
  }
  
  // Check for seasonality (very simple approach)
  const monthlyDiffs: number[] = [];
  for (let i = 1; i < values.length; i++) {
    monthlyDiffs.push(values[i] - values[i-1]);
  }
  
  const positiveMonths = monthlyDiffs.filter(diff => diff > 0).length;
  const negativeMonths = monthlyDiffs.filter(diff => diff < 0).length;
  
  if (positiveMonths > negativeMonths * 2) {
    insights.push("Consistent growth: Most months show revenue increases.");
  } else if (negativeMonths > positiveMonths * 2) {
    insights.push("Concerning pattern: Most months show revenue decreases.");
  } else {
    insights.push("Mixed performance: Alternating months of growth and decline suggest possible seasonal patterns.");
  }
  
  return insights;
};
