
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { ReportOption, reportOptions } from "./ReportOptions";

interface GenerateReportDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedReport: ReportOption | null;
  setSelectedReport: (report: ReportOption | null) => void;
  isGenerating: boolean;
  onGenerateReport: () => void;
}

export const GenerateReportDialog = ({
  isOpen,
  setIsOpen,
  selectedReport,
  setSelectedReport,
  isGenerating,
  onGenerateReport
}: GenerateReportDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mb-4" onClick={() => setIsOpen(true)}>Generate a new report</Button>
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
            onClick={onGenerateReport}
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
  );
};
