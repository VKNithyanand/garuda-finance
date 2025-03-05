
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { parseExpenseCSV, parseRevenueCSV, parseForecastCSV, validateExpenseData, validateRevenueData, validateForecastData } from "@/utils/csvUtils";
import { FileUp } from "lucide-react";
import { toast } from "sonner";
import { saveToStorage } from "@/utils/storageUtils";

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
            toast.success(`Loaded ${parsedData.length} expenses from CSV`);
          }
          break;
        case "revenue":
          parsedData = parseRevenueCSV(content);
          isValid = validateRevenueData(parsedData);
          if (isValid) {
            onRevenueLoaded(parsedData);
            await saveToStorage('revenue-data', JSON.stringify(parsedData));
            toast.success(`Loaded ${parsedData.length} revenue entries from CSV`);
          }
          break;
        case "forecast":
          parsedData = parseForecastCSV(content);
          isValid = validateForecastData(parsedData);
          if (isValid) {
            onForecastLoaded(parsedData);
            await saveToStorage('forecast-data', JSON.stringify(parsedData));
            toast.success(`Loaded ${parsedData.length} forecast entries from CSV`);
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
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Import Datasets</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="expenses" className="flex-1">Expenses</TabsTrigger>
            <TabsTrigger value="revenue" className="flex-1">Revenue</TabsTrigger>
            <TabsTrigger value="forecast" className="flex-1">Forecast</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expenses" className="mt-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload a CSV file containing expense data with columns: id, date, amount, description, category, vendor
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                  className="flex-1"
                />
                <Button disabled={isProcessing} size="icon">
                  <FileUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="mt-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload a CSV file containing revenue data with columns: date (YYYY-MM), amount
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                  className="flex-1"
                />
                <Button disabled={isProcessing} size="icon">
                  <FileUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="forecast" className="mt-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload a CSV file containing forecast data with columns: date (YYYY-MM), predicted, lowerBound, upperBound
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                  className="flex-1"
                />
                <Button disabled={isProcessing} size="icon">
                  <FileUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DatasetUploader;
