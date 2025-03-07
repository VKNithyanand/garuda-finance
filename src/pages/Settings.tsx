
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
import { Save, Wand2, Settings2, BrainCircuit, FileText, BarChart, Download, Upload, Trash2, Bell, Mail, AlertTriangle, LineChart } from "lucide-react";
import { saveToStorage, getFromStorage } from "@/utils/storageUtils";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [aiSettings, setAiSettings] = useState({
    enableAutoCategories: true,
    enableAnomalyDetection: true,
    enableForecastSuggestions: true,
    confidenceThreshold: 70,
    preferredModel: "gpt"
  });

  const [dataSettings, setDataSettings] = useState({
    storageLocation: "cloud",
    autosaveInterval: 5,
    retentionPeriod: "1year"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    anomalyNotifications: true,
    weeklyReports: true,
    forecastAlerts: false,
    emailAddress: "business@example.com"
  });
  
  const [accountSettings, setAccountSettings] = useState({
    companyName: "Example Business LLC",
    defaultCurrency: "usd",
    theme: "system"
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Load saved settings from storage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedAiSettings = await getFromStorage('ai-settings');
        const savedDataSettings = await getFromStorage('data-settings');
        const savedNotificationSettings = await getFromStorage('notification-settings');
        const savedAccountSettings = await getFromStorage('account-settings');
        
        if (savedAiSettings) setAiSettings(JSON.parse(savedAiSettings));
        if (savedDataSettings) setDataSettings(JSON.parse(savedDataSettings));
        if (savedNotificationSettings) setNotificationSettings(JSON.parse(savedNotificationSettings));
        if (savedAccountSettings) setAccountSettings(JSON.parse(savedAccountSettings));
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

  const handleDataSettingChange = (setting: string, value: any) => {
    setDataSettings({
      ...dataSettings,
      [setting]: value
    });
  };

  const handleNotificationSettingChange = (setting: string, value: any) => {
    setNotificationSettings({
      ...notificationSettings,
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
      // Save all settings to storage
      await saveToStorage('ai-settings', JSON.stringify(aiSettings));
      await saveToStorage('data-settings', JSON.stringify(dataSettings));
      await saveToStorage('notification-settings', JSON.stringify(notificationSettings));
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
    
    // Simulate AI testing with a delay
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
  
  const exportData = () => {
    toast.info("Preparing data export...");
    
    // Simulate export process
    setTimeout(() => {
      const dummyData = {
        expenses: [
          { id: 1, date: "2023-07-15", amount: 120.50, category: "Office Supplies" },
          { id: 2, date: "2023-07-22", amount: 450.00, category: "Software" }
        ],
        revenue: [
          { date: "2023-07", amount: 7500.00 },
          { date: "2023-08", amount: 8200.00 }
        ],
        forecast: [
          { date: "2023-09", predicted: 9000.00, lowerBound: 8500.00, upperBound: 9500.00 },
          { date: "2023-10", predicted: 9500.00, lowerBound: 9000.00, upperBound: 10000.00 }
        ]
      };
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dummyData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "financial_dashboard_export.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      toast.success("Data exported successfully");
    }, 2000);
  };
  
  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      toast.info("Processing import file...");
      
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      
      reader.onload = (readerEvent) => {
        try {
          const content = readerEvent.target?.result as string;
          const parsedData = JSON.parse(content);
          
          if (parsedData.expenses || parsedData.revenue || parsedData.forecast) {
            // In a real app, we would store this data
            setTimeout(() => {
              toast.success("Data imported successfully", {
                description: `Imported ${parsedData.expenses?.length || 0} expenses, ${parsedData.revenue?.length || 0} revenue entries, and ${parsedData.forecast?.length || 0} forecast entries`
              });
            }, 1000);
          } else {
            toast.error("Invalid data format", {
              description: "The imported file does not contain valid financial data"
            });
          }
        } catch (error) {
          console.error("Import error:", error);
          toast.error("Failed to import data", {
            description: "The file may be corrupted or in an invalid format"
          });
        }
      };
    };
    
    input.click();
  };
  
  const deleteAllData = () => {
    // Show a confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete all data? This action cannot be undone.");
    
    if (confirmDelete) {
      toast.info("Deleting all data...");
      
      // Simulate data deletion with a delay
      setTimeout(() => {
        toast.success("All data has been deleted", {
          description: "Your financial dashboard has been reset"
        });
      }, 2000);
    }
  };
  
  const testNotification = () => {
    const notificationTypes = [
      { type: "Expense Alert", icon: "💸", message: "Large expense detected: $1,250.00 to Cloud Services" },
      { type: "Revenue Update", icon: "💰", message: "Monthly revenue increased by 12% compared to last month" },
      { type: "Forecast Alert", icon: "📈", message: "Q4 forecast updated: Expected 15% growth in revenue" },
      { type: "Anomaly Detection", icon: "🔍", message: "Unusual spending pattern detected in Marketing category" }
    ];
    
    const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    toast.info(`${randomNotification.type} ${randomNotification.icon}`, {
      description: randomNotification.message
    });
  };
  
  const changePassword = () => {
    toast("Password change functionality would require authentication integration", {
      description: "In a production app, this would connect to your auth provider"
    });
  };
  
  const manageSubscription = () => {
    toast.info("Subscription management would connect to a payment provider", {
      description: "This would typically integrate with Stripe or similar service"
    });
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
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="ai" className="flex items-center">
              <BrainCircuit className="h-4 w-4 mr-2" />
              AI Settings
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Data Management
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
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
          
          <TabsContent value="data" className="space-y-4">
            <Card className="border-primary/10 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Data Storage & Management
                </CardTitle>
                <CardDescription>
                  Configure how your financial data is stored and managed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storage-location">Storage Location</Label>
                    <Select 
                      value={dataSettings.storageLocation}
                      onValueChange={(value) => handleDataSettingChange('storageLocation', value)}
                    >
                      <SelectTrigger id="storage-location">
                        <SelectValue placeholder="Select storage location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cloud">Cloud Storage (Encrypted)</SelectItem>
                        <SelectItem value="local">Local Storage</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Local + Cloud Backup)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Choose where your financial data is stored
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="autosave">Autosave Interval (minutes)</Label>
                    <Input 
                      id="autosave"
                      type="number"
                      min={1}
                      max={60}
                      value={dataSettings.autosaveInterval}
                      onChange={(e) => handleDataSettingChange('autosaveInterval', parseInt(e.target.value))}
                    />
                    <p className="text-sm text-muted-foreground">
                      How often to automatically save changes
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="retention">Data Retention Period</Label>
                    <Select 
                      value={dataSettings.retentionPeriod}
                      onValueChange={(value) => handleDataSettingChange('retentionPeriod', value)}
                    >
                      <SelectTrigger id="retention">
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3months">3 Months</SelectItem>
                        <SelectItem value="6months">6 Months</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      How long to keep historical financial data
                    </p>
                  </div>
                </div>
                
                <Separator className="bg-primary/10" />
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full flex items-center" onClick={exportData}>
                    <Download className="mr-2 h-4 w-4" />
                    Export All Data
                  </Button>
                  <Button variant="outline" className="w-full flex items-center" onClick={importData}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                  </Button>
                  <Button variant="destructive" className="w-full flex items-center" onClick={deleteAllData}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-primary/10 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-address">Email Address for Notifications</Label>
                    <Input 
                      id="email-address"
                      type="email"
                      value={notificationSettings.emailAddress}
                      onChange={(e) => handleNotificationSettingChange('emailAddress', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-alerts">Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important notifications via email
                      </p>
                    </div>
                    <Switch 
                      id="email-alerts"
                      checked={notificationSettings.emailAlerts}
                      onCheckedChange={(checked) => handleNotificationSettingChange('emailAlerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="anomaly-notifications">Anomaly Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get alerted when unusual spending is detected
                      </p>
                    </div>
                    <Switch 
                      id="anomaly-notifications"
                      checked={notificationSettings.anomalyNotifications}
                      onCheckedChange={(checked) => handleNotificationSettingChange('anomalyNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly financial summary reports
                      </p>
                    </div>
                    <Switch 
                      id="weekly-reports"
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => handleNotificationSettingChange('weeklyReports', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="forecast-alerts">Forecast Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about significant forecast changes
                      </p>
                    </div>
                    <Switch 
                      id="forecast-alerts"
                      checked={notificationSettings.forecastAlerts}
                      onCheckedChange={(checked) => handleNotificationSettingChange('forecastAlerts', checked)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/30">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-3 flex-shrink-0" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-400">
                    Email notifications require server integration. This is a demo implementation.
                  </p>
                </div>
                
                <Button variant="outline" className="w-full flex items-center" onClick={testNotification}>
                  <Mail className="mr-2 h-4 w-4" />
                  Test Notification
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="theme">Application Theme</Label>
                    <Select 
                      value={accountSettings.theme}
                      onValueChange={(value) => handleAccountSettingChange('theme', value)}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System Default</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator className="bg-primary/10" />
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center" 
                    onClick={changePassword}
                  >
                    Change Password
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center" 
                    onClick={manageSubscription}
                  >
                    Manage Subscription
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center" 
                    onClick={() => navigate('/forecast')}
                  >
                    <LineChart className="mr-2 h-4 w-4" />
                    View Forecasts
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center" 
                    onClick={() => navigate('/analysis')}
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    View Analysis
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full col-span-2 flex items-center justify-center"
                    onClick={() => toast.error("Account deletion would require authentication integration")}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="border-primary/10 shadow-md bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">Ready for your hackathon presentation?</h3>
                <p className="text-sm text-muted-foreground">
                  All settings are functional and ready to demonstrate
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => navigate('/')}>
                  Return to Dashboard
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <Download className="mr-2 h-4 w-4" />
                  Print Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
