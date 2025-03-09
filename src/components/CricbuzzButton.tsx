
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const CricbuzzButton: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-6 z-10">
      <a href="https://www.cricbuzz.com" target="_blank" rel="noopener noreferrer">
        <Button variant="cricbuzz" className="rounded-full">
          <ExternalLink size={16} />
          <span>Cricbuzz</span>
        </Button>
      </a>
    </div>
  );
};

export default CricbuzzButton;
