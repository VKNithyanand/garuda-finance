
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Download, PieChart, Printer, Share2, BarChart3, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateReport } from "@/utils/reportUtils";
import { saveToStorage, getFromStorage } from "@/utils/storageUtils";

type ReportType = "expense" | "budget" | "forecast" | "optimization";

interface ReportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  type: ReportType;
}

interface GeneratedReport {
  id: string;
  title: string;
  date: string;
  type: ReportType;
  data: any;
  charts: string[];
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
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [reportHistory, setReportHistory] = useState<GeneratedReport[]>([]);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  // Load previously generated reports from storage
  useEffect(() => {
    const loadReports = async () => {
      try {
        const savedReports = await getFromStorage('report-history');
        if (savedReports) {
          setReportHistory(JSON.parse(savedReports));
        }
      } catch (error) {
        console.error("Failed to load saved reports:", error);
      }
    };
    
    loadReports();
  }, []);

  const handleGenerateReport = async () => {
    if (!selectedReport) return;
    
    setIsGenerating(true);
    toast.info("Generating report...", {
      description: `Your ${selectedReport.title} is being prepared.`
    });
    
    try {
      // Generate the actual report data
      const reportData = await generateReport(selectedReport.type);
      
      const newReport = {
        id: `report-${Date.now()}`,
        title: selectedReport.title,
        date: new Date().toISOString(),
        type: selectedReport.type,
        data: reportData,
        charts: ["pie-chart", "bar-chart", "line-chart"].slice(0, 2 + Math.floor(Math.random() * 2))
      };
      
      // Save the new report
      setGeneratedReport(newReport);
      
      // Add to history and save
      const updatedHistory = [newReport, ...reportHistory].slice(0, 10); // Keep only 10 most recent
      setReportHistory(updatedHistory);
      await saveToStorage('report-history', JSON.stringify(updatedHistory));
      
      toast.success("Report ready!", {
        description: `Your ${selectedReport.title} has been generated successfully.`
      });
      
      // Close the dialog
      setIsGenerateDialogOpen(false);
    } catch (error) {
      console.error("Report generation failed:", error);
      toast.error("Report generation failed", {
        description: "There was an error processing your request. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedReport) return;
    
    try {
      // Convert report to blob for download
      const reportBlob = new Blob(
        [JSON.stringify(generatedReport.data, null, 2)], 
        { type: 'application/json' }
      );
      
      // Create download link
      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedReport.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Report downloaded", {
        description: "Your report has been saved to your downloads folder."
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed", {
        description: "There was an error downloading your report."
      });
    }
  };

  const handleShare = () => {
    if (!generatedReport) return;
    
    // In a real app, this would use the Web Share API or custom sharing
    if (navigator.share) {
      navigator.share({
        title: generatedReport.title,
        text: `Financial report generated on ${new Date(generatedReport.date).toLocaleDateString()}`,
        url: window.location.href
      }).then(() => {
        toast.success("Report shared successfully");
      }).catch(error => {
        console.error("Sharing failed:", error);
        toast("Sharing options", {
          description: "Sharing options have been opened."
        });
      });
    } else {
      toast("Sharing options", {
        description: "Sharing options have been opened."
      });
    }
  };

  const handlePrint = () => {
    if (!generatedReport) return;
    
    // In a real app, this would generate a printable version
    window.print();
    toast("Print dialog opened", {
      description: "Use your browser's print functionality to print the report."
    });
  };

  const handleViewReport = (report: GeneratedReport) => {
    setGeneratedReport(report);
    setIsHistoryDialogOpen(false);
  };

  // Format the date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4" onClick={() => setIsGenerateDialogOpen(true)}>Generate a new report</Button>
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
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : "Generate Report"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {generatedReport ? (
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{generatedReport.title} - {formatDate(generatedReport.date)}</h3>
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
              {generatedReport.charts.includes('pie-chart') && (
                <div className="h-32 bg-muted/40 rounded-md flex items-center justify-center">
                  <PieChart className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
              {generatedReport.charts.includes('bar-chart') && (
                <div className="h-20 bg-muted/40 rounded-md flex items-center justify-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
                </div>
              )}
              {generatedReport.charts.includes('line-chart') && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-16 bg-muted/40 rounded-md"></div>
                  <div className="h-16 bg-muted/40 rounded-md"></div>
                </div>
              )}
              <div className="mt-4 pt-3 border-t">
                <h4 className="text-sm font-medium mb-2">Key Findings</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {generatedReport.data.insights.map((insight: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
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
        <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setIsHistoryDialogOpen(true)}>
              View report history
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Report History</DialogTitle>
              <DialogDescription>
                View or reopen your previously generated reports
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto">
              {reportHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No report history found
                </div>
              ) : (
                <div className="space-y-2">
                  {reportHistory.map((report) => (
                    <div 
                      key={report.id} 
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 cursor-pointer"
                      onClick={() => handleViewReport(report)}
                    >
                      <div className="flex items-center">
                        {report.type === 'expense' && <PieChart className="h-4 w-4 mr-2 text-primary" />}
                        {report.type === 'budget' && <BarChart3 className="h-4 w-4 mr-2 text-primary" />}
                        {report.type === 'forecast' && <TrendingUp className="h-4 w-4 mr-2 text-primary" />}
                        {report.type === 'optimization' && <FileText className="h-4 w-4 mr-2 text-primary" />}
                        <div>
                          <p className="text-sm font-medium">{report.title}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(report.date)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default FinancialReportCard;
