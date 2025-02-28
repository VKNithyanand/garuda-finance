
import Dashboard from "@/components/Dashboard";
import { Toaster } from "sonner";

const Index = () => {
  return (
    <>
      <Dashboard />
      <Toaster richColors position="top-right" closeButton />
    </>
  );
};

export default Index;
