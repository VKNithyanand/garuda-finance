
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import { OptimizationRecommendation, calculatePotentialSavings } from "@/utils/optimizationUtils";
import { useEffect, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { toast } from "sonner";
import { OptimizationHeader } from "./optimization/OptimizationHeader";
import { OptimizationItem } from "./optimization/OptimizationItem";
import { OptimizationFooter } from "./optimization/OptimizationFooter";
import { generateOptimizationReport, downloadReport } from "@/utils/optimizationReportUtils";

interface OptimizationCardProps {
  recommendations: OptimizationRecommendation[];
  className?: string;
  dataSource?: "mock" | "imported";
}

const OptimizationCard = ({ recommendations, className, dataSource = "mock" }: OptimizationCardProps) => {
  const [visibleRecommendations, setVisibleRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [implementedItems, setImplementedItems] = useState<string[]>([]);
  const [savings, setSavings] = useState(0);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const totalPotentialSavings = calculatePotentialSavings(recommendations);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleRecommendations(recommendations);
    }, 500);
    return () => clearTimeout(timer);
  }, [recommendations]);

  const handleImplement = (id: string, savings: number) => {
    if (!implementedItems.includes(id)) {
      setImplementedItems([...implementedItems, id]);
      setSavings(prev => prev + savings);
      toast.success("Optimization implemented!", {
        description: `You've added ${savings} in potential savings.`,
        action: {
          label: "View Report",
          onClick: () => console.log("Optimization report viewed"),
        },
      });
    }
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast.success("Cost Optimization Report Generated", {
        description: `Report includes ${implementedItems.length} implemented optimizations with ${savings} in savings.`,
        action: {
          label: "Download",
          onClick: () => handleDownloadReport(),
        },
      });
    }, 2000);
  };
  
  const handleDownloadReport = () => {
    const reportData = generateOptimizationReport(
      recommendations,
      implementedItems,
      totalPotentialSavings,
      savings
    );
    downloadReport(reportData);
    
    toast.success("Report downloaded", {
      description: "Your optimization report has been saved to your downloads folder."
    });
  };
  
  return (
    <Card className={`${className} animate-fade-in`}>
      <CardHeader>
        <OptimizationHeader 
          savings={savings}
          totalPotentialSavings={totalPotentialSavings}
          dataSource={dataSource}
        />
      </CardHeader>
      <CardContent>
        {visibleRecommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] bg-muted/40 rounded-md">
            <TrendingDown className="h-10 w-10 text-muted-foreground mb-2 animate-pulse" />
            <p className="text-muted-foreground">Analyzing expenses for cost-saving opportunities...</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {visibleRecommendations.map((recommendation) => (
              <OptimizationItem
                key={recommendation.id}
                recommendation={recommendation}
                isImplemented={implementedItems.includes(recommendation.id)}
                onImplement={handleImplement}
              />
            ))}
          </Accordion>
        )}
        {visibleRecommendations.length > 0 && (
          <OptimizationFooter
            implementedCount={implementedItems.length}
            totalCount={visibleRecommendations.length}
            isGeneratingReport={isGeneratingReport}
            onGenerateReport={handleGenerateReport}
            onDownloadReport={handleDownloadReport}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizationCard;
