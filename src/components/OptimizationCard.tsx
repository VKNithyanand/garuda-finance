
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coins, TrendingDown, CheckCircle2, ArrowRight, Sparkles, BarChart3, BadgeDollarSign } from "lucide-react";
import { OptimizationRecommendation, calculatePotentialSavings } from "@/utils/optimizationUtils";
import { useEffect, useState } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

interface OptimizationCardProps {
  recommendations: OptimizationRecommendation[];
  className?: string;
}

const OptimizationCard = ({ recommendations, className }: OptimizationCardProps) => {
  const [visibleRecommendations, setVisibleRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [implementedItems, setImplementedItems] = useState<string[]>([]);
  const [savings, setSavings] = useState(0);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
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

  const handleImplement = (id: string, savings: number) => {
    if (!implementedItems.includes(id)) {
      setImplementedItems([...implementedItems, id]);
      setSavings(prev => prev + savings);
      toast.success("Optimization implemented!", {
        description: `You've added ${formatCurrency(savings)} in potential savings.`,
        action: {
          label: "View Report",
          onClick: () => console.log("Optimization report viewed"),
        },
      });
    }
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast.success("Cost Optimization Report Generated", {
        description: `Report includes ${implementedItems.length} implemented optimizations with ${formatCurrency(savings)} in savings.`,
        action: {
          label: "Download",
          onClick: () => {
            console.log("Downloading optimization report");
            toast.success("Report downloaded successfully");
          },
        },
      });
    }, 2000);
  };
  
  return (
    <Card className={`${className} animate-fade-in`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeDollarSign className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-lg font-medium">Cost Optimization</CardTitle>
              <CardDescription>AI-powered cost-saving opportunities</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-2 rounded-lg hover-scale transition-all">
              <p className="text-sm font-medium">Implemented Savings</p>
              <p className="text-xl font-bold">{formatCurrency(savings)}</p>
            </div>
            <div className="flex items-center bg-primary/10 p-2 rounded-lg hover-scale transition-all">
              <Coins className="h-5 w-5 text-primary mr-2" />
              <div>
                <p className="text-sm font-medium">Potential Savings</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(totalPotentialSavings)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress bar showing implemented vs potential savings */}
        {totalPotentialSavings > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Implementation Progress</span>
              <span>{Math.round((savings / totalPotentialSavings) * 100)}%</span>
            </div>
            <Progress value={(savings / totalPotentialSavings) * 100} className="h-2" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {visibleRecommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] bg-muted/40 rounded-md">
            <TrendingDown className="h-10 w-10 text-muted-foreground mb-2 animate-pulse" />
            <p className="text-muted-foreground">Analyzing expenses for cost-saving opportunities...</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {visibleRecommendations.map((recommendation, index) => (
              <AccordionItem 
                key={recommendation.id} 
                value={recommendation.id} 
                className={`animate-fade-in ${implementedItems.includes(recommendation.id) ? 'border-l-4 border-green-500' : ''}`} 
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <AccordionTrigger className="hover:no-underline group">
                  <div className="flex flex-col items-start text-left w-full">
                    <div className="flex items-center w-full">
                      <span className="font-medium group-hover:text-primary transition-colors">{recommendation.title}</span>
                      <Badge variant="outline" className="ml-auto group-hover:bg-primary/10 transition-colors">
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
                      {implementedItems.includes(recommendation.id) ? (
                        <Badge className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Implemented
                        </Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          className="inline-flex items-center justify-center text-xs bg-primary/10 hover:bg-primary/20 text-primary font-medium py-1 px-3 rounded-full transition-colors"
                          variant="ghost"
                          onClick={() => handleImplement(recommendation.id, recommendation.potentialSavings)}
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Implement
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {visibleRecommendations.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>{implementedItems.length} of {visibleRecommendations.length} optimizations implemented</span>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
            >
              {isGeneratingReport ? (
                <>Generating... <Sparkles className="h-4 w-4 animate-pulse" /></>
              ) : (
                <>Generate Optimization Report <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizationCard;
