
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { OptimizationRecommendation } from "@/utils/optimizationUtils";
import { getDifficultyColor, formatCurrency } from "@/utils/optimizationReportUtils";
import { Progress } from "@/components/ui/progress";

interface OptimizationItemProps {
  recommendation: OptimizationRecommendation;
  isImplemented: boolean;
  onImplement: (id: string, savings: number) => void;
}

export const OptimizationItem = ({ 
  recommendation, 
  isImplemented, 
  onImplement 
}: OptimizationItemProps) => {
  return (
    <AccordionItem 
      value={recommendation.id} 
      className={`animate-fade-in ${isImplemented ? 'border-l-4 border-green-500' : ''}`}
    >
      <AccordionTrigger className="hover:no-underline group">
        <div className="flex flex-col items-start text-left w-full">
          <div className="flex items-center w-full">
            <span className="font-medium group-hover:text-primary transition-colors">
              {recommendation.title}
            </span>
            <Badge variant="outline" className="ml-auto group-hover:bg-primary/10 transition-colors">
              {formatCurrency(recommendation.potentialSavings)}
            </Badge>
          </div>
          <div className="flex items-center mt-1 w-full">
            <Badge 
              className={`${getDifficultyColor(recommendation.implementationDifficulty)} text-white text-xs capitalize mr-2`}
            >
              {recommendation.implementationDifficulty}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Category: {recommendation.category}
            </span>
            <div className="ml-auto flex items-center">
              <span className="text-xs text-muted-foreground mr-1">Confidence:</span>
              <Progress value={recommendation.confidence * 100} className="h-2 w-16" />
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pl-4 border-l-2 border-primary/20 mt-2">
          <p className="text-sm text-muted-foreground mb-3">
            {recommendation.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              Potential savings: <span className="text-primary font-bold">
                {formatCurrency(recommendation.potentialSavings)}
              </span>
            </span>
            {isImplemented ? (
              <Badge className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Implemented
              </Badge>
            ) : (
              <Button 
                size="sm" 
                className="inline-flex items-center justify-center text-xs bg-primary/10 hover:bg-primary/20 text-primary font-medium py-1 px-3 rounded-full transition-colors"
                variant="ghost"
                onClick={() => onImplement(recommendation.id, recommendation.potentialSavings)}
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Implement
              </Button>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
