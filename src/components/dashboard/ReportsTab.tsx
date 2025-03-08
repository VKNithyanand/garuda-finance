
import FinancialReportCard from "../FinancialReportCard";
import OptimizationCard from "../OptimizationCard";
import { getFromStorage } from "@/utils/storageUtils";
import { useEffect, useState } from "react";

interface ReportsTabProps {
  optimizationRecommendations: any[];
}

const ReportsTab = ({ optimizationRecommendations }: ReportsTabProps) => {
  const [dataSource, setDataSource] = useState<"mock" | "imported">("mock");
  
  useEffect(() => {
    const checkDataSource = async () => {
      try {
        const source = await getFromStorage('data-source');
        if (source) {
          // Fix the type error by ensuring we only set valid values
          setDataSource(source === "imported" ? "imported" : "mock");
        }
      } catch (error) {
        console.error("Error checking data source:", error);
      }
    };
    
    checkDataSource();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FinancialReportCard />
      <OptimizationCard recommendations={optimizationRecommendations} />
    </div>
  );
};

export default ReportsTab;
