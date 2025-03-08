
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import NewExpenseDialog from "../NewExpenseDialog";
import { Expense } from "@/utils/mockData";

interface DashboardHeaderProps {
  dataSource: "mock" | "imported";
  onAddExpense: (expense: Expense) => void;
}

const DashboardHeader = ({ dataSource, onAddExpense }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
        <p className="text-muted-foreground">
          Track, analyze, and optimize your business expenses
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1">
          <Zap className="h-3.5 w-3.5 mr-1" />
          {dataSource === "imported" ? "Using Imported Data" : "Using Mock Data"}
        </Badge>
        <NewExpenseDialog onAddExpense={onAddExpense} />
      </div>
    </div>
  );
};

export default DashboardHeader;
