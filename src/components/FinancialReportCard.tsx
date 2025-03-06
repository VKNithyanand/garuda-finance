
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar } from "lucide-react";
import { toast } from "sonner";
import { generateReport } from "@/utils/reportUtils";
import { saveToStorage, getFromStorage } from "@/utils/storageUtils";
import { GenerateReportDialog } from "./financial-report/GenerateReportDialog";
import { ReportHistoryDialog } from "./financial-report/ReportHistoryDialog";
import { ReportDisplay } from "./financial-report/ReportDisplay";
import { NoReportPlaceholder } from "./financial-report/NoReportPlaceholder";
import { ReportOption } from "./financial-report/ReportOptions";
import { GeneratedReport } from "@/utils/reportDisplayUtils";

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
        <GenerateReportDialog
          isOpen={isGenerateDialogOpen}
          setIsOpen={setIsGenerateDialogOpen}
          selectedReport={selectedReport}
          setSelectedReport={setSelectedReport}
          isGenerating={isGenerating}
          onGenerateReport={handleGenerateReport}
        />

        {generatedReport ? (
          <ReportDisplay
            report={generatedReport}
            onDownload={handleDownload}
            onShare={handleShare}
            onPrint={handlePrint}
          />
        ) : (
          <NoReportPlaceholder />
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground items-center">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
        <ReportHistoryDialog
          isOpen={isHistoryDialogOpen}
          setIsOpen={setIsHistoryDialogOpen}
          reportHistory={reportHistory}
          onViewReport={handleViewReport}
        />
      </CardFooter>
    </Card>
  );
};

export default FinancialReportCard;
