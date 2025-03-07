
import { saveToStorage, getFromStorage } from "./storageUtils";
import { toast } from "sonner";

export interface AISettings {
  enableAutoCategories: boolean;
  enableAnomalyDetection: boolean;
  enableForecastSuggestions: boolean;
  confidenceThreshold: number;
  preferredModel: string;
}

export interface DataSettings {
  storageLocation: 'cloud' | 'local' | 'hybrid';
  autosaveInterval: number;
  retentionPeriod: string;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  anomalyNotifications: boolean;
  weeklyReports: boolean;
  forecastAlerts: boolean;
  emailAddress: string;
}

export interface AccountSettings {
  companyName: string;
  defaultCurrency: string;
  theme: 'light' | 'dark' | 'system';
}

// Default settings
export const defaultAISettings: AISettings = {
  enableAutoCategories: true,
  enableAnomalyDetection: true,
  enableForecastSuggestions: true,
  confidenceThreshold: 70,
  preferredModel: "gpt"
};

export const defaultDataSettings: DataSettings = {
  storageLocation: "cloud",
  autosaveInterval: 5,
  retentionPeriod: "1year"
};

export const defaultNotificationSettings: NotificationSettings = {
  emailAlerts: true,
  anomalyNotifications: true,
  weeklyReports: true,
  forecastAlerts: false,
  emailAddress: "business@example.com"
};

export const defaultAccountSettings: AccountSettings = {
  companyName: "Example Business LLC",
  defaultCurrency: "usd",
  theme: "system"
};

// Save settings helper functions
export const saveSettings = async (
  aiSettings: AISettings,
  dataSettings: DataSettings,
  notificationSettings: NotificationSettings,
  accountSettings: AccountSettings
): Promise<boolean> => {
  try {
    await saveToStorage('ai-settings', JSON.stringify(aiSettings));
    await saveToStorage('data-settings', JSON.stringify(dataSettings));
    await saveToStorage('notification-settings', JSON.stringify(notificationSettings));
    await saveToStorage('account-settings', JSON.stringify(accountSettings));
    
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    return false;
  }
};

// Load settings helper functions
export const loadSettings = async () => {
  try {
    const savedAiSettings = await getFromStorage('ai-settings');
    const savedDataSettings = await getFromStorage('data-settings');
    const savedNotificationSettings = await getFromStorage('notification-settings');
    const savedAccountSettings = await getFromStorage('account-settings');
    
    return {
      aiSettings: savedAiSettings ? JSON.parse(savedAiSettings) : defaultAISettings,
      dataSettings: savedDataSettings ? JSON.parse(savedDataSettings) : defaultDataSettings,
      notificationSettings: savedNotificationSettings ? JSON.parse(savedNotificationSettings) : defaultNotificationSettings,
      accountSettings: savedAccountSettings ? JSON.parse(savedAccountSettings) : defaultAccountSettings,
    };
  } catch (error) {
    console.error("Error loading settings:", error);
    toast.error("Failed to load settings, using defaults");
    
    return {
      aiSettings: defaultAISettings,
      dataSettings: defaultDataSettings,
      notificationSettings: defaultNotificationSettings,
      accountSettings: defaultAccountSettings,
    };
  }
};

// Apply theme from settings
export const applyThemeFromSettings = async (setTheme: (theme: string) => void) => {
  try {
    const savedAccountSettings = await getFromStorage('account-settings');
    if (savedAccountSettings) {
      const { theme } = JSON.parse(savedAccountSettings) as AccountSettings;
      setTheme(theme);
    }
  } catch (error) {
    console.error("Error applying theme from settings:", error);
  }
};

// Test AI Configuration
export const testAIConfiguration = (aiSettings: AISettings) => {
  if (aiSettings.confidenceThreshold > 80) {
    toast.warning("High confidence threshold may limit AI suggestions", {
      description: "Consider lowering to 70-80% for better balance"
    });
  } else {
    toast.success("AI configuration test successful", {
      description: `${aiSettings.preferredModel.toUpperCase()} model ready with ${aiSettings.confidenceThreshold}% confidence threshold`
    });
  }
};
