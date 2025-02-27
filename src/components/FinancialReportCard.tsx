
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Download, PieChart, Printer, Share2, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { toast } from "sonner";

type ReportType = "expense" | "budget" | "forecast" | "optimization";

interface ReportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  type: ReportType;
}

const reportOptions: ReportOption[] = [
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

const FinancialReportCard = () => {
  const [selectedReport, setSelectedReport] = useState<ReportOption | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const handleGenerateReport = () => {
    if (!selectedReport) return;
    
    setIsGenerating(true);
    toast("Generating report...", {
      description: `Your ${selectedReport.title} is being prepared.`
    });
    
    // Simulate report generation with a delay
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedReport(`${selectedReport.title} - ${new Date().toLocaleDateString()}`);
      toast.success("Report ready!", {
        description: `Your ${selectedReport.title} has been generated successfully.`
      });
    }, 2000);
  };

  const handleDownload = () => {
    if (!generatedReport) return;
    
    // In a real app, this would trigger a file download
    toast.success("Report downloaded", {
      description: "Your report has been saved to your downloads folder."
    });
  };

  const handleShare = () => {
    if (!generatedReport) return;
    
    // In a real app, this would open sharing options
    toast.success("Sharing options", {
      description: "Sharing options have been opened."
    });
  };

  const handlePrint = () => {
    if (!generatedReport) return;
    
    // In a real app, this would open print dialog
    window.print();
    toast("Print dialog opened", {
      description: "Use your browser's print functionality to print the report."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Automated Financial Reports
        </CardTitle>
        <CardDescription>
          Generate AI-powered reports for insights and decision-making
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full mb-4">Generate a new report</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Generate Financial Report</DialogTitle>
              <DialogDescription>
                Choose the type of report you want to generate
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {reportOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`flex items-start p-3 rounded-md cursor-pointer border transition-all ${
                    selectedReport?.id === option.id ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedReport(option)}
                >
                  <div className="mr-3 mt-0.5">
                    <option.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{option.title}</h4>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleGenerateReport}
                disabled={!selectedReport || isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {generatedReport ? (
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{generatedReport}</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-muted/40 rounded-md flex items-center justify-center">
                <PieChart className="h-16 w-16 text-muted-foreground/50" />
              </div>
              <div className="h-20 bg-muted/40 rounded-md flex items-center justify-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-16 bg-muted/40 rounded-md"></div>
                <div className="h-16 bg-muted/40 rounded-md"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center h-[200px] text-center">
            <FileText className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground mb-1">No reports generated yet</p>
            <p className="text-xs text-muted-foreground/80">
              Generate a report to gain insights into your finances
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground items-center">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs">
          View report history
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FinancialReportCard;
