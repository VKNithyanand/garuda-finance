
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { parseExpenseCSV, parseRevenueCSV, parseForecastCSV, validateExpenseData, validateRevenueData, validateForecastData } from "@/utils/csvUtils";
import { FileUp, Database, Upload, Info } from "lucide-react";
import { toast } from "sonner";
import { saveToStorage } from "@/utils/storageUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DatasetUploaderProps {
  onExpensesLoaded: (expenses: any[]) => void;
  onRevenueLoaded: (revenue: any[]) => void;
  onForecastLoaded: (forecast: any[]) => void;
}

const DatasetUploader = ({
  onExpensesLoaded,
  onRevenueLoaded,
  onForecastLoaded
}: DatasetUploaderProps) => {
  const [activeTab, setActiveTab] = useState("expenses");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const content = await file.text();
      
      let parsedData;
      let isValid = false;
      
      switch (activeTab) {
        case "expenses":
          parsedData = parseExpenseCSV(content);
          isValid = validateExpenseData(parsedData);
          if (isValid) {
            onExpensesLoaded(parsedData);
            await saveToStorage('expense-data', JSON.stringify(parsedData));
            toast.success(`Loaded ${parsedData.length} expenses from CSV`, {
              description: "All dashboard visualizations will now use this data"
            });
          }
          break;
        case "revenue":
          parsedData = parseRevenueCSV(content);
          isValid = validateRevenueData(parsedData);
          if (isValid) {
            onRevenueLoaded(parsedData);
            await saveToStorage('revenue-data', JSON.stringify(parsedData));
            toast.success(`Loaded ${parsedData.length} revenue entries from CSV`, {
              description: "Revenue charts and forecasts will now use this data"
            });
          }
          break;
        case "forecast":
          parsedData = parseForecastCSV(content);
          isValid = validateForecastData(parsedData);
          if (isValid) {
            onForecastLoaded(parsedData);
            await saveToStorage('forecast-data', JSON.stringify(parsedData));
            toast.success(`Loaded ${parsedData.length} forecast entries from CSV`, {
              description: "Forecast predictions will now use this data"
            });
          }
          break;
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process the file");
    } finally {
      setIsProcessing(false);
      // Clear the input so the same file can be loaded again
      event.target.value = '';
    }
  };

  return (
    <Card className="w-full overflow-hidden border border-primary/10 shadow-md">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <Database className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-medium">Import Datasets</CardTitle>
              <CardDescription>Upload your financial data to enhance visualizations and forecasts</CardDescription>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  All visualizations, forecasts, and reports will use the data you upload here.
                  Each dataset type affects different parts of the dashboard.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4 grid grid-cols-3 bg-secondary/20">
            <TabsTrigger value="expenses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Expenses</TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Revenue</TabsTrigger>
            <TabsTrigger value="forecast" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Forecast</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expenses" className="mt-0">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border border-border">
                Upload a CSV file containing expense data with columns: 
                <code className="bg-background px-1 py-0.5 rounded text-xs ml-1">id, date, amount, description, category, vendor</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 group">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                    className="cursor-pointer opacity-0 absolute inset-0 w-full h-full z-10"
                  />
                  <div className="border-2 border-dashed border-primary/20 group-hover:border-primary/50 bg-background rounded-md p-4 text-center transition-all">
                    <Upload className="h-5 w-5 mx-auto mb-2 text-muted-foreground group-hover:text-primary" />
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {isProcessing ? "Processing..." : "Choose a CSV file or drag & drop"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="mt-0">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border border-border">
                Upload a CSV file containing revenue data with columns: 
                <code className="bg-background px-1 py-0.5 rounded text-xs ml-1">date (YYYY-MM), amount</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 group">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                    className="cursor-pointer opacity-0 absolute inset-0 w-full h-full z-10"
                  />
                  <div className="border-2 border-dashed border-primary/20 group-hover:border-primary/50 bg-background rounded-md p-4 text-center transition-all">
                    <Upload className="h-5 w-5 mx-auto mb-2 text-muted-foreground group-hover:text-primary" />
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {isProcessing ? "Processing..." : "Choose a CSV file or drag & drop"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="forecast" className="mt-0">
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border border-border">
                Upload a CSV file containing forecast data with columns: 
                <code className="bg-background px-1 py-0.5 rounded text-xs ml-1">date (YYYY-MM), predicted, lowerBound, upperBound</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 group">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                    className="cursor-pointer opacity-0 absolute inset-0 w-full h-full z-10"
                  />
                  <div className="border-2 border-dashed border-primary/20 group-hover:border-primary/50 bg-background rounded-md p-4 text-center transition-all">
                    <Upload className="h-5 w-5 mx-auto mb-2 text-muted-foreground group-hover:text-primary" />
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {isProcessing ? "Processing..." : "Choose a CSV file or drag & drop"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DatasetUploader;
