
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Expense, ExpenseCategory } from "@/utils/mockData";
import { categorizeThroughAI } from "@/utils/aiUtils";
import { PlusIcon, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NewExpenseDialogProps {
  onAddExpense: (expense: Expense) => void;
}

const NewExpenseDialog = ({ onAddExpense }: NewExpenseDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    description: '',
    category: 'Uncategorized',
    vendor: ''
  });

  const resetForm = () => {
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      description: '',
      category: 'Uncategorized',
      vendor: ''
    });
  };

  const handleInputChange = (field: keyof Expense, value: any) => {
    setNewExpense({
      ...newExpense,
      [field]: value
    });
  };

  const handleSubmit = () => {
    if (!newExpense.description || !newExpense.vendor || newExpense.amount <= 0) {
      toast("Missing information", {
        description: "Please fill in all required fields"
      });
      return;
    }

    const expense: Expense = {
      id: `exp-${Date.now()}`,
      date: newExpense.date || new Date().toISOString().split('T')[0],
      amount: parseFloat(newExpense.amount?.toString() || "0"),
      description: newExpense.description || "",
      category: newExpense.category as ExpenseCategory || "Uncategorized",
      vendor: newExpense.vendor || ""
    };

    onAddExpense(expense);
    setIsOpen(false);
    resetForm();
    toast("Expense added", {
      description: `Added ${expense.description} for $${expense.amount.toFixed(2)}`
    });
  };

  const handleAutoDetect = () => {
    if (!newExpense.description || !newExpense.vendor) {
      toast("Missing information", {
        description: "Please provide at least description and vendor for AI categorization"
      });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const suggestedCategory = categorizeThroughAI(
        newExpense.description || "",
        newExpense.vendor || ""
      );
      
      setNewExpense({
        ...newExpense,
        category: suggestedCategory
      });
      
      setIsProcessing(false);
      toast("Category detected", {
        description: `AI suggests "${suggestedCategory}" for this expense`
      });
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon size={16} />
          <span>Add Expense</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle>New Expense</DialogTitle>
          <DialogDescription>
            Add a new business expense to your records
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              className="col-span-3"
              value={newExpense.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="col-span-3"
              value={newExpense.amount || ''}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vendor" className="text-right">
              Vendor
            </Label>
            <Input
              id="vendor"
              placeholder="Vendor or merchant name"
              className="col-span-3"
              value={newExpense.vendor}
              onChange={(e) => handleInputChange('vendor', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Brief description of expense"
              className="col-span-3"
              value={newExpense.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Select
                value={newExpense.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
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
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleAutoDetect}
                disabled={isProcessing || !newExpense.description || !newExpense.vendor}
                title="Auto-detect category"
              >
                <Wand2 size={16} className={isProcessing ? "animate-pulse" : ""} />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Expense</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewExpenseDialog;
