import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import CricbuzzButton from "@/components/CricbuzzButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CircleDashed, AlertCircle, TrendingUp, Search, DollarSign } from "lucide-react";
import { 
  mockExpenses, 
  Expense, 
  generateVendorAnalysis 
} from "@/utils/mockData";
import { 
  analyzeExpenseTrends, 
  detectAnomalies, 
  generateCostOptimizationSuggestions 
} from "@/utils/aiUtils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from "recharts";

const AIAnalysis = () => {
  const [expenses] = useState<Expense[]>(mockExpenses);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [isLoadingAnomalies, setIsLoadingAnomalies] = useState(false);
  const [isLoadingOptimization, setIsLoadingOptimization] = useState(false);
  const [trends, setTrends] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any>(null);
  const [optimization, setOptimization] = useState<string[]>([]);
  const [vendorAnalysis, setVendorAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("trends");

  useEffect(() => {
    setVendorAnalysis(generateVendorAnalysis(expenses));
    
    handleAnalyzeTrends();
  }, [expenses]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === "trends" && !trends) {
      handleAnalyzeTrends();
    } else if (value === "anomalies" && !anomalies) {
      handleDetectAnomalies();
    } else if (value === "optimization" && optimization.length === 0) {
      handleGenerateOptimization();
    }
  };

  const handleAnalyzeTrends = async () => {
    if (trends) return;
    
    setIsLoadingTrends(true);
    toast.info("Analyzing expense trends...");
    
    try {
      const trendData = await analyzeExpenseTrends(expenses);
      setTrends(trendData);
      toast.success("Expense trend analysis complete");
    } catch (error) {
      console.error("Failed to analyze trends:", error);
      toast.error("Failed to analyze trends");
    } finally {
      setIsLoadingTrends(false);
    }
  };

  const handleDetectAnomalies = async () => {
    if (anomalies) return;
    
    setIsLoadingAnomalies(true);
    toast.info("Detecting expense anomalies...");
    
    try {
      const anomalyData = await detectAnomalies(expenses);
      setAnomalies(anomalyData);
      toast.success("Anomaly detection complete", {
        description: `Found ${anomalyData.anomalies.length} anomalies and ${anomalyData.potentialDuplicates.length} potential duplicates`
      });
    } catch (error) {
      console.error("Failed to detect anomalies:", error);
      toast.error("Failed to detect anomalies");
    } finally {
      setIsLoadingAnomalies(false);
    }
  };

  const handleGenerateOptimization = async () => {
    if (optimization.length > 0) return;
    
    setIsLoadingOptimization(true);
    toast.info("Generating cost optimization suggestions...");
    
    try {
      const suggestions = await generateCostOptimizationSuggestions(expenses);
      setOptimization(suggestions);
      toast.success("Cost optimization suggestions ready");
    } catch (error) {
      console.error("Failed to generate optimization suggestions:", error);
      toast.error("Failed to generate optimization suggestions");
    } finally {
      setIsLoadingOptimization(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Expense Analysis</h1>
            <p className="text-muted-foreground">
              Advanced analytics and insights for your business expenses
            </p>
          </div>
        </div>

        <Tabs defaultValue="trends" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="trends">Expense Trends</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trends ? (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Average Monthly</CardTitle>
                      <CardDescription>Average monthly expenses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(trends.averageMonthlyExpense)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Highest Month</CardTitle>
                      <CardDescription>Month with highest expenses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {trends.highestMonth}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(trends.trends.find((t: any) => t.month === trends.highestMonth)?.amount || 0)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Lowest Month</CardTitle>
                      <CardDescription>Month with lowest expenses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {trends.lowestMonth}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(trends.trends.find((t: any) => t.month === trends.lowestMonth)?.amount || 0)}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="md:col-span-3">
                  <CardContent className="pt-6 flex justify-center items-center h-[100px]">
                    {isLoadingTrends ? (
                      <div className="flex items-center">
                        <CircleDashed className="h-5 w-5 animate-spin mr-2" />
                        <span>Analyzing expense trends...</span>
                      </div>
                    ) : (
                      <Button onClick={handleAnalyzeTrends}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Analyze Expense Trends
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
            
            {trends && trends.trends.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Month-over-Month Expense Changes</CardTitle>
                  <CardDescription>Percentage change in monthly expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trends.trends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                          axisLine={{ stroke: "hsl(var(--muted))" }}
                          tickLine={{ stroke: "hsl(var(--muted))" }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `${value.toFixed(0)}%`}
                          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                          axisLine={{ stroke: "hsl(var(--muted))" }}
                          tickLine={{ stroke: "hsl(var(--muted))" }}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Change']}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Bar 
                          dataKey="percentChange" 
                          name="Change" 
                          radius={[4, 4, 0, 0]} 
                        >
                          {trends.trends.map((entry: any, index: number) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.percentChange >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))"} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {vendorAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Top Vendors Analysis</CardTitle>
                  <CardDescription>Your highest expense vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Vendors</p>
                        <p className="text-2xl font-bold">{vendorAnalysis.vendorCount}</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Spend</p>
                        <p className="text-2xl font-bold">{formatCurrency(vendorAnalysis.totalSpend)}</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Avg. Vendor Spend</p>
                        <p className="text-2xl font-bold">{formatCurrency(vendorAnalysis.averageVendorSpend)}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium mb-2">Top 5 Vendors by Spend</h3>
                      <div className="space-y-2">
                        {vendorAnalysis.topVendors.map((vendor: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2 border-b">
                            <div>
                              <p className="font-medium">{vendor.vendor}</p>
                              <p className="text-xs text-muted-foreground">
                                {vendor.frequency} transactions · Avg {formatCurrency(vendor.averageTransaction)}
                              </p>
                            </div>
                            <p className="font-bold">{formatCurrency(vendor.amount)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="anomalies" className="space-y-4">
            {anomalies ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Total Anomalies</CardTitle>
                      <CardDescription>Unusual expense patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{anomalies.summary.totalAnomalies}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">High Value</CardTitle>
                      <CardDescription>Unusually high expenses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{anomalies.summary.highValueAnomalies}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Duplicates</CardTitle>
                      <CardDescription>Potential duplicate payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{anomalies.summary.totalDuplicates}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Potential Savings</CardTitle>
                      <CardDescription>From fixing duplicates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(anomalies.summary.savings)}</div>
                    </CardContent>
                  </Card>
                </div>
                
                {anomalies.anomalies.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-medium">Anomalous Expenses</CardTitle>
                      <CardDescription>Expenses that deviate significantly from the norm</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {anomalies.anomalies.slice(0, 5).map((item: any, i: number) => (
                          <div key={i} className="flex items-start p-3 border rounded-lg">
                            <div className={`mr-3 p-2 rounded-full ${item.significance === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning-foreground'}`}>
                              <AlertCircle className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium">{item.expense.vendor} - {item.expense.description}</p>
                                <p className="font-bold">{formatCurrency(item.expense.amount)}</p>
                              </div>
                              <div className="flex justify-between mt-1">
                                <p className="text-sm text-muted-foreground">
                                  {item.significance === 'high' ? 'Higher' : 'Lower'} than average by 
                                  {' '}{Math.abs(item.deviation).toFixed(1)} standard deviations
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Category avg: {formatCurrency(item.meanAmount)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {anomalies.anomalies.length > 5 && (
                          <Button variant="ghost" className="w-full">
                            Show {anomalies.anomalies.length - 5} more anomalies
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {anomalies.potentialDuplicates.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-medium">Potential Duplicate Transactions</CardTitle>
                      <CardDescription>Transactions that appear to be duplicates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {anomalies.potentialDuplicates.slice(0, 3).map((item: any, i: number) => (
                          <div key={i} className="p-3 border rounded-lg">
                            <div className="flex justify-between mb-2">
                              <p className="font-medium">
                                <span className="px-2 py-1 bg-destructive/10 text-destructive rounded text-xs mr-2">
                                  Duplicate
                                </span>
                                {item.expense1.vendor}
                              </p>
                              <p className="font-bold">{formatCurrency(item.expense1.amount)}</p>
                            </div>
                            <div className="flex justify-between text-sm">
                              <div>
                                <p>Description: {item.expense1.description}</p>
                                <p>Date: {new Date(item.expense1.date).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <p>ID: {item.expense1.id}</p>
                                <p>Category: {item.expense1.category}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {anomalies.potentialDuplicates.length > 3 && (
                          <Button variant="ghost" className="w-full">
                            Show {anomalies.potentialDuplicates.length - 3} more duplicates
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 flex justify-center items-center h-[200px]">
                  {isLoadingAnomalies ? (
                    <div className="flex items-center">
                      <CircleDashed className="h-5 w-5 animate-spin mr-2" />
                      <span>Detecting expense anomalies...</span>
                    </div>
                  ) : (
                    <Button onClick={handleDetectAnomalies}>
                      <Search className="h-4 w-4 mr-2" />
                      Detect Expense Anomalies
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="optimization" className="space-y-4">
            {optimization.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Cost Optimization Suggestions</CardTitle>
                  <CardDescription>AI-generated recommendations to reduce expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimization.map((suggestion, i) => (
                      <div key={i} className="flex items-start p-3 border rounded-lg">
                        <div className="mr-3 p-2 rounded-full bg-primary/10 text-primary">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <p>{suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 flex justify-center items-center h-[200px]">
                  {isLoadingOptimization ? (
                    <div className="flex items-center">
                      <CircleDashed className="h-5 w-5 animate-spin mr-2" />
                      <span>Generating optimization suggestions...</span>
                    </div>
                  ) : (
                    <Button onClick={handleGenerateOptimization}>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Generate Cost Optimization Suggestions
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <CricbuzzButton />
    </div>
  );
};

export default AIAnalysis;
