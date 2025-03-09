import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CircleDashed, TrendingUp, Calendar, Download, Database, ArrowUpDown, BrainCircuit } from "lucide-react";
import { generateMockForecast, ForecastData, generateInsightsFromForecast } from "@/utils/mockData";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getFromStorage, saveToStorage } from "@/utils/storageUtils";
import DatasetUploader from "@/components/DatasetUploader";
import CricbuzzButton from "@/components/CricbuzzButton";

const AIForecast = () => {
  const [forecastPeriod, setForecastPeriod] = useState("6months");
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [model, setModel] = useState("arima");
  const [dataSource, setDataSource] = useState<"mock" | "imported">("mock");

  useEffect(() => {
    loadSavedForecastData();
  }, []);

  const loadSavedForecastData = async () => {
    try {
      const savedData = await getFromStorage('forecast-data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setForecastData(parsedData);
        setInsights(generateInsightsFromForecast(parsedData));
        const source = await getFromStorage('data-source');
        setDataSource(source === "imported" ? "imported" : "mock");
      } else {
        generateForecast();
      }
    } catch (error) {
      console.error("Error loading saved forecast data:", error);
      generateForecast();
    }
  };

  const generateForecast = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const months = forecastPeriod === "3months" ? 3 : 
                  forecastPeriod === "6months" ? 6 : 
                  forecastPeriod === "12months" ? 12 : 24;
    
    const data = generateMockForecast(months);
    setForecastData(data);
    
    const newInsights = generateInsightsFromForecast(data);
    setInsights(newInsights);
    
    try {
      await saveToStorage('forecast-data', JSON.stringify(data));
      await saveToStorage('data-source', "mock");
      setDataSource("mock");
    } catch (error) {
      console.error("Failed to save forecast data:", error);
    }
    
    setIsLoading(false);
    
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

  const handleForecastLoaded = async (importedForecast: ForecastData[]) => {
    setForecastData(importedForecast);
    
    const newInsights = generateInsightsFromForecast(importedForecast);
    setInsights(newInsights);
    
    setDataSource("imported");
    
    try {
      await saveToStorage('forecast-data', JSON.stringify(importedForecast));
      await saveToStorage('data-source', "imported");
    } catch (error) {
      console.error("Failed to save imported forecast data:", error);
    }
    
    toast.success("Using imported forecast data", {
      description: "AI predictions will now be based on your uploaded data"
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

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

  const handleExportForecast = () => {
    try {
      const headers = ["date", "predicted", "lowerBound", "upperBound"];
      const csvRows = [headers.join(",")];
      
      forecastData.forEach(item => {
        const row = [
          item.date,
          item.predicted,
          item.lowerBound,
          item.upperBound
        ].join(",");
        csvRows.push(row);
      });
      
      const csvString = csvRows.join("\n");
      
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `revenue_forecast_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Forecast data exported successfully");
    } catch (error) {
      console.error("Error exporting forecast:", error);
      toast.error("Failed to export forecast data");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CricbuzzButton />
      <main className="container py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-500 text-transparent bg-clip-text">
              AI Revenue Forecasting
            </h1>
            <p className="text-muted-foreground">
              Advanced AI-powered revenue predictions for business planning
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-secondary/30 px-3 py-1.5 rounded-full text-xs font-medium text-secondary-foreground flex items-center">
              <Database className="h-3.5 w-3.5 mr-1" />
              {dataSource === "imported" ? "Using Imported Data" : "Using Mock Data"}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <DatasetUploader 
            onExpensesLoaded={() => {}}
            onRevenueLoaded={() => {}}
            onForecastLoaded={handleForecastLoaded}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="border border-primary/10 shadow-md">
            <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Forecast Settings
              </CardTitle>
              <CardDescription>Configure your forecast parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Period</label>
                <Select value={forecastPeriod} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="border-primary/20">
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
                  <SelectTrigger className="border-primary/20">
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
                className="w-full mt-4 bg-gradient-to-r from-primary to-indigo-500 hover:opacity-90 transition-opacity"
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

          <Card className="lg:col-span-3 border border-primary/10 shadow-md">
            <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-medium">Revenue Forecast</CardTitle>
                  <CardDescription>AI-generated projection using {model.toUpperCase()} model</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-primary/20 hover:bg-primary/5"
                  onClick={handleExportForecast}
                >
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
          <Card className="border border-primary/10 shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                AI Insights
              </CardTitle>
              <CardDescription>Automated analysis of your financial forecast</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2 p-2 rounded-md bg-secondary/10 hover:bg-secondary/20 transition-colors">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-primary/10 shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Forecast Parameters
              </CardTitle>
              <CardDescription>Details about the forecasting model</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Tabs defaultValue="model">
                <TabsList className="mb-4 bg-secondary/20">
                  <TabsTrigger 
                    value="model" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Model Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="data" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Data Sources
                  </TabsTrigger>
                  <TabsTrigger 
                    value="training" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Training
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="model" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 bg-secondary/10 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Model Type</p>
                      <p className="text-sm font-medium">{model.toUpperCase()}</p>
                    </div>
                    <div className="space-y-1 bg-secondary/10 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Confidence Level</p>
                      <p className="text-sm font-medium">85%</p>
                    </div>
                    <div className="space-y-1 bg-secondary/10 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Forecast Period</p>
                      <p className="text-sm font-medium">
                        {forecastPeriod === "3months" ? "3 Months" : 
                         forecastPeriod === "6months" ? "6 Months" : 
                         forecastPeriod === "12months" ? "12 Months" : "24 Months"}
                      </p>
                    </div>
                    <div className="space-y-1 bg-secondary/10 p-3 rounded-md">
                      <p className="text-xs text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="data">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This forecast is based on {dataSource === "imported" ? "imported data" : "historical transaction data"} from the following sources:
                    </p>
                    <ul className="space-y-2">
                      <li className="text-sm flex items-center gap-2 p-2 rounded-md bg-secondary/10">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Historical expense records (last 12 months)</span>
                      </li>
                      <li className="text-sm flex items-center gap-2 p-2 rounded-md bg-secondary/10">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Revenue transactions (last 12 months)</span>
                      </li>
                      <li className="text-sm flex items-center gap-2 p-2 rounded-md bg-secondary/10">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Recurring subscription data</span>
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
                      <div className="space-y-1 bg-secondary/10 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">Training Epochs</p>
                        <p className="text-sm font-medium">1000</p>
                      </div>
                      <div className="space-y-1 bg-secondary/10 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">Learning Rate</p>
                        <p className="text-sm font-medium">0.001</p>
                      </div>
                      <div className="space-y-1 bg-secondary/10 p-3 rounded-md">
                        <p className="text-xs text-muted-foreground">Validation Split</p>
                        <p className="text-sm font-medium">20%</p>
                      </div>
                      <div className="space-y-1 bg-secondary/10 p-3 rounded-md">
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
