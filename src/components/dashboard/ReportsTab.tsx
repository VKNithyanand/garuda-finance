
import FinancialReportCard from "../FinancialReportCard";
import OptimizationCard from "../OptimizationCard";

interface ReportsTabProps {
  optimizationRecommendations: any[];
}

const ReportsTab = ({ optimizationRecommendations }: ReportsTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FinancialReportCard />
      <OptimizationCard recommendations={optimizationRecommendations} />
    </div>
  );
};

export default ReportsTab;
