
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingDown, CheckCircle2 } from "lucide-react";
import { OptimizationRecommendation, calculatePotentialSavings } from "@/utils/optimizationUtils";
import { useEffect, useState } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OptimizationCardProps {
  recommendations: OptimizationRecommendation[];
  className?: string;
}

const OptimizationCard = ({ recommendations, className }: OptimizationCardProps) => {
  const [visibleRecommendations, setVisibleRecommendations] = useState<OptimizationRecommendation[]>([]);
  const totalPotentialSavings = calculatePotentialSavings(recommendations);
  
  useEffect(() => {
    // Animate recommendations appearing
    const timer = setTimeout(() => {
      setVisibleRecommendations(recommendations);
    }, 500);
    return () => clearTimeout(timer);
  }, [recommendations]);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-amber-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Cost Optimization</CardTitle>
            <CardDescription>AI-powered cost-saving opportunities</CardDescription>
          </div>
          <div className="flex items-center bg-primary/10 p-2 rounded-lg">
            <Coins className="h-5 w-5 text-primary mr-2" />
            <div>
              <p className="text-sm font-medium">Potential Savings</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(totalPotentialSavings)}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {visibleRecommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] bg-muted/40 rounded-md">
            <TrendingDown className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Analyzing expenses for cost-saving opportunities...</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {visibleRecommendations.map((recommendation, index) => (
              <AccordionItem key={recommendation.id} value={recommendation.id} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-col items-start text-left">
                    <div className="flex items-center w-full">
                      <span className="font-medium">{recommendation.title}</span>
                      <Badge variant="outline" className="ml-auto">
                        {formatCurrency(recommendation.potentialSavings)}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1 w-full">
                      <Badge className={`${getDifficultyColor(recommendation.implementationDifficulty)} text-white text-xs capitalize mr-2`}>
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
                        Potential savings: <span className="text-primary font-bold">{formatCurrency(recommendation.potentialSavings)}</span>
                      </span>
                      <button className="inline-flex items-center justify-center text-xs bg-primary/10 hover:bg-primary/20 text-primary font-medium py-1 px-3 rounded-full transition-colors">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Implement
                      </button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizationCard;
