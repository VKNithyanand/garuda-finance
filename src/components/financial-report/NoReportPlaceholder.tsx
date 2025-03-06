
import { FileText } from "lucide-react";

export const NoReportPlaceholder = () => {
  return (
    <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center h-[200px] text-center">
      <FileText className="h-10 w-10 text-muted-foreground/50 mb-2" />
      <p className="text-muted-foreground mb-1">No reports generated yet</p>
      <p className="text-xs text-muted-foreground/80">
        Generate a report to gain insights into your finances
      </p>
    </div>
  );
};
