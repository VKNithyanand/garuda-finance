import { useState } from "react";
import Header from "./Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatasetUploader from "./DatasetUploader";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useExpenseOperations } from "@/hooks/useExpenseOperations";
import { useDatasetOperations } from "@/hooks/useDatasetOperations";
import { calculateDashboardMetrics } from "@/utils/dashboardMetrics";
import DashboardHeader from "./dashboard/DashboardHeader";
import MetricsSection from "./dashboard/MetricsSection";
import OverviewTab from "./dashboard/OverviewTab";
import ReportsTab from "./dashboard/ReportsTab";
import SecurityTab from "./dashboard/SecurityTab";
import CricbuzzButton from "./CricbuzzButton";

const Dashboard = () => {
  const {
    expenses,
    setExpenses,
    revenueData,
    setRevenueData,
    forecastData,
    setForecastData,
    optimizationRecommendations,
    setOptimizationRecommendations,
    isLoading,
    expenseTrends,
    setExpenseTrends,
    anomalies,
    setAnomalies,
    dataSource,
    setDataSource
  } = useDashboardData();

  const {
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteExpense
  } = useExpenseOperations(
    expenses,
    setExpenses,
    setOptimizationRecommendations,
    setExpenseTrends,
    setAnomalies
  );

  const {
    handleExpensesUploaded,
    handleRevenueUploaded,
    handleForecastUploaded
  } = useDatasetOperations(
    setExpenses,
    setRevenueData,
    setForecastData,
    setOptimizationRecommendations,
    setExpenseTrends,
    setAnomalies,
    setDataSource
  );

  const metrics = calculateDashboardMetrics(
    expenses,
    revenueData,
    optimizationRecommendations
  );

  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <main className="container py-6">
        <DashboardHeader 
          dataSource={dataSource} 
          onAddExpense={handleAddExpense} 
        />

        <MetricsSection metrics={metrics} />

        <div className="mb-6">
          <DatasetUploader 
            onExpensesLoaded={handleExpensesUploaded}
            onRevenueLoaded={handleRevenueUploaded}
            onForecastLoaded={handleForecastUploaded}
          />
        </div>

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <OverviewTab 
              expenses={expenses}
              metrics={metrics}
              revenueData={revenueData}
              forecastData={forecastData}
              optimizationRecommendations={optimizationRecommendations}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <ReportsTab 
              optimizationRecommendations={optimizationRecommendations} 
            />
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </main>
      
      <CricbuzzButton />
    </div>
  );
};

export default Dashboard;
