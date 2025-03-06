
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GeneratedReport, formatDate, getReportTypeIcon } from "@/utils/reportDisplayUtils";

interface ReportHistoryDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  reportHistory: GeneratedReport[];
  onViewReport: (report: GeneratedReport) => void;
}

export const ReportHistoryDialog = ({
  isOpen,
  setIsOpen,
  reportHistory,
  onViewReport
}: ReportHistoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setIsOpen(true)}>
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
              {reportHistory.map((report) => {
                const ReportIcon = getReportTypeIcon(report.type);
                
                return (
                  <div 
                    key={report.id} 
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 cursor-pointer"
                    onClick={() => onViewReport(report)}
                  >
                    <div className="flex items-center">
                      <ReportIcon className="h-4 w-4 mr-2 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{report.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(report.date)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
