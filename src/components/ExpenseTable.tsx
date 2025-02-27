
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Expense } from "@/utils/mockData";
import { processExpenseWithAI } from "@/utils/aiUtils";
import { FileEdit, MoreVertical, Trash2, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ExpenseTableProps {
  expenses: Expense[];
  onUpdateExpense: (updatedExpense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  className?: string;
}

const ExpenseTable = ({ expenses, onUpdateExpense, onDeleteExpense, className }: ExpenseTableProps) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleAIProcess = async (expense: Expense) => {
    setProcessingId(expense.id);
    try {
      const processedExpense = await processExpenseWithAI(expense);
      onUpdateExpense(processedExpense);
      
      if (processedExpense.category !== expense.category) {
        toast(`AI categorized expense as "${processedExpense.category}"`, {
          description: "The expense category was updated based on the description and vendor",
          icon: <Zap className="h-4 w-4 text-primary" />
        });
      } else {
        toast("AI analysis complete", {
          description: "The current category seems accurate"
        });
      }
    } catch (error) {
      toast("AI processing failed", {
        description: "There was an error while analyzing the expense"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openEditDialog = (expense: Expense) => {
    setEditingExpense({...expense});
    setIsDialogOpen(true);
  };

  const saveExpenseChanges = () => {
    if (editingExpense) {
      onUpdateExpense(editingExpense);
      setIsDialogOpen(false);
      setEditingExpense(null);
      toast("Expense updated successfully");
    }
  };

  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expenses.slice(0, 5).map((expense) => (
                  <tr key={expense.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm">{expense.date}</td>
                    <td className="px-4 py-3 text-sm">{expense.vendor}</td>
                    <td className="px-4 py-3 text-sm truncate max-w-[200px]">{expense.description}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary-foreground">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border border-border">
                          <DropdownMenuItem onClick={() => openEditDialog(expense)} className="cursor-pointer">
                            <FileEdit className="h-4 w-4 mr-2" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleAIProcess(expense)}
                            className="cursor-pointer"
                            disabled={processingId === expense.id}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            <span>{processingId === expense.id ? "Processing..." : "AI Categorize"}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDeleteExpense(expense.id)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={editingExpense.date}
                  onChange={(e) => setEditingExpense({...editingExpense, date: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor" className="text-right">
                  Vendor
                </Label>
                <Input
                  id="vendor"
                  value={editingExpense.vendor}
                  onChange={(e) => setEditingExpense({...editingExpense, vendor: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={editingExpense.description}
                  onChange={(e) => setEditingExpense({...editingExpense, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select 
                  value={editingExpense.category} 
                  onValueChange={(value) => setEditingExpense({...editingExpense, category: value as any})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rent">Rent</SelectItem>
                    <SelectItem value="Payroll">Payroll</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Supplies">Supplies</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={editingExpense.amount}
                  onChange={(e) => setEditingExpense({...editingExpense, amount: parseFloat(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={saveExpenseChanges}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpenseTable;
