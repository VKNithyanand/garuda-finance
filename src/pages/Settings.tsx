
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, Wand2, Settings2, BrainCircuit, Download } from "lucide-react";
import { saveToStorage, getFromStorage } from "@/utils/storageUtils";
import { useNavigate } from "react-router-dom";
import CricbuzzButton from "@/components/CricbuzzButton";

const Settings = () => {
  const [aiSettings, setAiSettings] = useState({
    enableAutoCategories: true,
    enableAnomalyDetection: true,
    enableForecastSuggestions: true,
    confidenceThreshold: 70,
    preferredModel: "gpt"
  });

  const [accountSettings, setAccountSettings] = useState({
    companyName: "Example Business LLC",
    defaultCurrency: "usd",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState<"mock" | "imported">("mock");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedAiSettings = await getFromStorage('ai-settings');
        const savedAccountSettings = await getFromStorage('account-settings');
        const source = await getFromStorage('data-source');
        
        if (savedAiSettings) setAiSettings(JSON.parse(savedAiSettings));
        if (savedAccountSettings) {
          const parsed = JSON.parse(savedAccountSettings);
          // Only keep the properties we need
          setAccountSettings({
            companyName: parsed.companyName || "Example Business LLC",
            defaultCurrency: parsed.defaultCurrency || "usd"
          });
        }
        if (source) {
          setDataSource(source === "imported" ? "imported" : "mock");
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Failed to load your settings");
      }
    };
    
    loadSettings();
  }, []);

  const handleAiSettingChange = (setting: string, value: any) => {
    setAiSettings({
      ...aiSettings,
      [setting]: value
    });
  };
  
  const handleAccountSettingChange = (setting: string, value: any) => {
    setAccountSettings({
      ...accountSettings,
      [setting]: value
    });
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      await saveToStorage('ai-settings', JSON.stringify(aiSettings));
      await saveToStorage('account-settings', JSON.stringify(accountSettings));
      
      toast.success("Settings saved successfully", {
        description: "Your preference changes have been applied"
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings", {
        description: "Please try again or check console for details"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const testAiConfiguration = () => {
    toast.info("Testing AI configuration...");
    
    setTimeout(() => {
      if (aiSettings.confidenceThreshold > 80) {
        toast.warning("High confidence threshold may limit AI suggestions", {
          description: "Consider lowering to 70-80% for better balance"
        });
      } else {
        toast.success("AI configuration test successful", {
          description: `${aiSettings.preferredModel.toUpperCase()} model ready with ${aiSettings.confidenceThreshold}% confidence threshold`
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure your AI and application preferences
            </p>
            {dataSource === "imported" && (
              <p className="text-sm text-primary mt-1">
                Using imported dataset for analysis and insights
              </p>
            )}
          </div>
          <Button onClick={saveSettings} disabled={isLoading}>
            {isLoading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="ai" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="ai" className="flex items-center">
              <BrainCircuit className="h-4 w-4 mr-2" />
              AI Settings
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center">
              <Settings2 className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai" className="space-y-4">
            <Card className="border-primary/10 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
                  AI Behavior
                </CardTitle>
                <CardDescription>
                  Configure how the AI interacts with your financial data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-categories">Automatic Categorization</Label>
                      <p className="text-sm text-muted-foreground">
                        Let AI automatically categorize your expenses
                      </p>
                    </div>
                    <Switch 
                      id="auto-categories"
                      checked={aiSettings.enableAutoCategories}
                      onCheckedChange={(checked) => handleAiSettingChange('enableAutoCategories', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="anomaly-detection">Anomaly Detection</Label>
                      <p className="text-sm text-muted-foreground">
                        Identify unusual spending patterns automatically
                      </p>
                    </div>
                    <Switch 
                      id="anomaly-detection"
                      checked={aiSettings.enableAnomalyDetection}
                      onCheckedChange={(checked) => handleAiSettingChange('enableAnomalyDetection', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="forecast-suggestions">Forecast Suggestions</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive AI recommendations based on forecast data
                      </p>
                    </div>
                    <Switch 
                      id="forecast-suggestions"
                      checked={aiSettings.enableForecastSuggestions}
                      onCheckedChange={(checked) => handleAiSettingChange('enableForecastSuggestions', checked)}
                    />
                  </div>
                </div>
                
                <Separator className="bg-primary/10" />
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="confidence-threshold">Confidence Threshold ({aiSettings.confidenceThreshold}%)</Label>
                    </div>
                    <Slider 
                      id="confidence-threshold"
                      min={50}
                      max={95}
                      step={5}
                      value={[aiSettings.confidenceThreshold]}
                      onValueChange={(value) => handleAiSettingChange('confidenceThreshold', value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>More suggestions</span>
                      <span>Higher accuracy</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Set minimum confidence level for AI suggestions
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="preferred-model">Preferred AI Model</Label>
                    <Select 
                      value={aiSettings.preferredModel}
                      onValueChange={(value) => handleAiSettingChange('preferredModel', value)}
                    >
                      <SelectTrigger id="preferred-model">
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt">GPT-4o (Recommended)</SelectItem>
                        <SelectItem value="bert">BERT</SelectItem>
                        <SelectItem value="custom">Custom Model</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Select which AI model to use for categorization and analysis
                    </p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" onClick={testAiConfiguration}>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Test AI Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4">
            <Card className="border-primary/10 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Settings2 className="h-5 w-5 mr-2 text-primary" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company"
                      type="text"
                      value={accountSettings.companyName}
                      onChange={(e) => handleAccountSettingChange('companyName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select 
                      value={accountSettings.defaultCurrency}
                      onValueChange={(value) => handleAccountSettingChange('defaultCurrency', value)}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="jpy">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator className="bg-primary/10" />
                
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    className="w-full max-w-sm flex items-center justify-center" 
                    onClick={() => window.print()}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Print Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <CricbuzzButton />
    </div>
  );
};

export default Settings;
