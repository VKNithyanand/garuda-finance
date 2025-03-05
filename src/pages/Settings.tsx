
import { useState } from "react";
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
import { Save, Wand2, Settings2, BrainCircuit, FileText, BarChart } from "lucide-react";

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
    forecastAlerts: false
  });

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

  const saveSettings = () => {
    // In a real app, this would save to an API
    toast.success("Settings saved successfully", {
      description: "Your preference changes have been applied"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure your AI and application preferences
            </p>
          </div>
          <Button onClick={saveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="ai" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ai">
              <BrainCircuit className="h-4 w-4 mr-2" />
              AI Settings
            </TabsTrigger>
            <TabsTrigger value="data">
              <FileText className="h-4 w-4 mr-2" />
              Data Management
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <BarChart className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="account">
              <Settings2 className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">AI Behavior</CardTitle>
                <CardDescription>
                  Configure how the AI interacts with your financial data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                
                <Separator />
                
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
                    <p className="text-sm text-muted-foreground">
                      Set minimum confidence level for AI suggestions (higher = fewer but more accurate suggestions)
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
                
                <Button variant="outline" className="w-full">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Test AI Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Data Storage & Management</CardTitle>
                <CardDescription>
                  Configure how your financial data is stored and managed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                
                <Separator />
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">Export All Data</Button>
                  <Button variant="outline" className="w-full">Import Data</Button>
                  <Button variant="destructive" className="w-full">Delete All Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
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
                
                <Button variant="outline" className="w-full">
                  Test Notification
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="email"
                      value="business@example.com"
                      readOnly
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company"
                      type="text"
                      value="Example Business LLC"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="usd">
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
                
                <Separator />
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">Change Password</Button>
                  <Button variant="outline" className="w-full">Manage Subscription</Button>
                  <Button variant="destructive" className="w-full">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
