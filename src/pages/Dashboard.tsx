
import MainLayout from "@/components/layout/MainLayout";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { toast } from "sonner";

const Dashboard = () => {
  // Show a welcome toast when dashboard loads
  useEffect(() => {
    toast.success("Welcome to your dashboard", {
      description: "View your test statistics and performance data"
    });
  }, []);
  
  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-heading">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your progress and performance
            </p>
          </div>
          
          <Tabs defaultValue="personal" className="mt-4 md:mt-0">
            <TabsList>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="animate-in">
          <DashboardOverview />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
