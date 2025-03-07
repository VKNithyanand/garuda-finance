
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CircleDashed, TrendingUp, Calendar, Download } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { saveToStorage } from "@/utils/storageUtils";
import DatasetUploader from "@/components/DatasetUploader";
import { generateMockForecast, ForecastData, generateInsightsFromForecast } from "@/utils/mockData";

const AIForecast = () => {
  const [forecastPeriod, setForecastPeriod] = useState("6months");
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [model, setModel] = useState("arima");
  const [dataSource, setDataSource] = useState<"mock" | "imported">("mock");

  useEffect(() => {
    // Load existing data from storage or generate mock data if none exists
    const loadExistingData = async () => {
      try {
        // Try to load forecast data from storage
        const storedForecastData = localStorage.getItem('forecast-data');
        if (storedForecastData) {
          const parsedData = JSON.parse(storedForecastData);
          setForecastData(parsedData);
          setDataSource("imported");
          
          // Generate insights based on the loaded forecast
          const newInsights = generateInsightsFromForecast(parsedData);
          setInsights(newInsights);
        } else {
          // If no stored data, generate mock forecast
          generateForecast();
        }

        // Load revenue data for context
        const storedRevenueData = localStorage.getItem('revenue-data');
        if (storedRevenueData) {
          setRevenueData(JSON.parse(storedRevenueData));
        }
        
        // Load expense data for context
        const storedExpenseData = localStorage.getItem('expense-data');
        if (storedExpenseData) {
          setExpenses(JSON.parse(storedExpenseData));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        generateForecast(); // Fallback to mock data
      }
    };
    
    loadExistingData();
  }, []);

  const generateForecast = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Map periods to number of months
    const months = {
      "3months": 3,
      "6months": 6,
      "12months": 12,
      "24months": 24
    }[forecastPeriod] || 6;
    
    // Generate forecast data
    const data = generateMockForecast(months);
    setForecastData(data);
    
    // Save to storage
    await saveToStorage('forecast-data', JSON.stringify(data));
    
    // Generate insights based on the forecast
    const newInsights = generateInsightsFromForecast(data);
    setInsights(newInsights);
    
    setIsLoading(false);
    setDataSource("mock");
    
    toast.success("Forecast successfully generated", {
      description: `Using ${model.toUpperCase()} model for ${months} months prediction`
    });
  };

  const handlePeriodChange = (value: string) => {
    setForecastPeriod(value);
  };

  const handleModelChange = (value: string) => {
    setModel(value);
  };
  
  const handleForecastUploaded = (importedForecast: ForecastData[]) => {
    setForecastData(importedForecast);
    setDataSource("imported");
    
    // Generate insights based on the loaded forecast
    const newInsights = generateInsightsFromForecast(importedForecast);
    setInsights(newInsights);
  };
  
  const handleRevenueUploaded = (importedRevenue: any[]) => {
    setRevenueData(importedRevenue);
  };
  
  const handleExpensesUploaded = (importedExpenses: any[]) => {
    setExpenses(importedExpenses);
  };

  // Format for the chart tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 border border-border p-3 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="font-medium text-sm mb-1">{label}</p>
          <p className="text-primary font-bold">
            Forecast: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            Range: {formatCurrency(payload[1]?.value || 0)} - {formatCurrency(payload[2]?.value || 0)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Revenue Forecasting</h1>
            <p className="text-muted-foreground">
              Advanced AI-powered revenue predictions for business planning
            </p>
          </div>
          <div>
            <Button variant="outline" size="sm">
              {dataSource === "imported" ? "Using Imported Data" : "Using Generated Data"}
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <DatasetUploader 
            onExpensesLoaded={handleExpensesUploaded}
            onRevenueLoaded={handleRevenueUploaded}
            onForecastLoaded={handleForecastUploaded}
            setDataSource={setDataSource}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Forecast Settings</CardTitle>
              <CardDescription>Configure your forecast parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Period</label>
                <Select value={forecastPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3months">3 Months</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="12months">12 Months</SelectItem>
                    <SelectItem value="24months">24 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Model Type</label>
                <Select value={model} onValueChange={handleModelChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arima">ARIMA</SelectItem>
                    <SelectItem value="lstm">LSTM</SelectItem>
                    <SelectItem value="prophet">Prophet</SelectItem>
                    <SelectItem value="ensemble">Ensemble</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                className="w-full mt-4"
                onClick={generateForecast}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Generate Forecast
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-medium">Revenue Forecast</CardTitle>
                  <CardDescription>AI-generated projection using {model.toUpperCase()} model</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-1">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={forecastData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgba(16, 185, 129, 0.3)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="rgba(16, 185, 129, 0.3)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgba(99, 102, 241, 0.1)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="rgba(99, 102, 241, 0.1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={{ stroke: "hsl(var(--muted))" }}
                      tickLine={{ stroke: "hsl(var(--muted))" }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value / 1000}k`}
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={{ stroke: "hsl(var(--muted))" }}
                      tickLine={{ stroke: "hsl(var(--muted))" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="predicted" 
                      name="Prediction"
                      stroke="#10B981" 
                      strokeWidth={2}
                      fill="url(#forecastGradient)" 
                      animationDuration={1500}
                      animationBegin={300}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="lowerBound" 
                      name="Range"
                      stroke="transparent"
                      fill="transparent"
                      animationDuration={1500}
                      animationBegin={300}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="upperBound"
                      name="Range (hidden)" 
                      legendType="none"
                      stroke="transparent"
                      fill="url(#rangeGradient)" 
                      animationDuration={1500}
                      animationBegin={300}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">AI Insights</CardTitle>
              <CardDescription>Automated analysis of your financial forecast</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                      <TrendingUp className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Forecast Parameters</CardTitle>
              <CardDescription>Details about the forecasting model</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="model">
                <TabsList className="mb-4">
                  <TabsTrigger value="model">Model Info</TabsTrigger>
                  <TabsTrigger value="data">Data Sources</TabsTrigger>
                  <TabsTrigger value="training">Training</TabsTrigger>
                </TabsList>
                <TabsContent value="model" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Model Type</p>
                      <p className="text-sm font-medium">{model.toUpperCase()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Confidence Level</p>
                      <p className="text-sm font-medium">85%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Forecast Period</p>
                      <p className="text-sm font-medium">
                        {forecastPeriod === "3months" ? "3 Months" : 
                         forecastPeriod === "6months" ? "6 Months" : 
                         forecastPeriod === "12months" ? "12 Months" : "24 Months"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="data">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This forecast is based on {dataSource === "imported" ? "imported" : "generated"} data:
                    </p>
                    <ul className="space-y-2">
                      <li className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {expenses.length ? 
                            `${expenses.length} expense records` : 
                            "No expense data available"}
                        </span>
                      </li>
                      <li className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {revenueData.length ? 
                            `${revenueData.length} revenue records` : 
                            "No revenue data available"}
                        </span>
                      </li>
                      <li className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {forecastData.length ? 
                            `${forecastData.length} forecast periods` : 
                            "No forecast data available"}
                        </span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="training">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      The AI model is trained using the following parameters:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Training Epochs</p>
                        <p className="text-sm font-medium">1000</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Learning Rate</p>
                        <p className="text-sm font-medium">0.001</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Validation Split</p>
                        <p className="text-sm font-medium">20%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Optimization</p>
                        <p className="text-sm font-medium">Adam</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AIForecast;
