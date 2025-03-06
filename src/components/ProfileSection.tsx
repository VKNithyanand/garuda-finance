import { useState } from "react";
import { 
  UserRound, Settings, LogOut, CreditCard, KeyRound, HelpCircle, 
  BellRing, Trophy, BadgeCheck, Star, Wand2, Shield, Heart, Bookmark,
  Calendar, LineChart, Sun, Moon, PieChartIcon, BarChart
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const ProfileSection = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    role: "Financial Manager",
    avatar: "", // We'll use fallback for now
    planTier: "Pro",
    memberSince: "March 2023",
    badges: [
      { name: "Data Expert", icon: <LineChart className="h-4 w-4 text-[#8B5CF6]" /> },
      { name: "Early Adopter", icon: <Star className="h-4 w-4 text-[#F97316]" /> },
      { name: "Verified", icon: <BadgeCheck className="h-4 w-4 text-[#0EA5E9]" /> }
    ],
    theme: {
      mode: "system",
      color: "purple"
    },
    notifications: {
      email: true,
      push: true,
      weekly: false,
      updates: true,
      tips: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30
    }
  });
  
  const handleSettingsSave = () => {
    setOpenSettings(false);
    toast.success("Settings updated", {
      description: "Your profile settings have been saved successfully."
    });
  };
  
  const handleLogout = () => {
    toast.success("Logged out", {
      description: "You have been logged out successfully."
    });
  };

  const renderBadge = (badge, index) => (
    <div key={index} className="flex items-center gap-1 bg-[#F1F0FB] px-2 py-1 rounded-full text-xs">
      {badge.icon}
      <span>{badge.name}</span>
    </div>
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 px-2 relative" size="sm">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-[#9b87f5]">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="bg-[#9b87f5] text-primary-foreground">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">{profile.name}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-2 py-1">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-[#9b87f5]">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="bg-[#9b87f5] text-primary-foreground">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none flex items-center">
                    {profile.name}
                    <BadgeCheck className="h-4 w-4 ml-1 text-[#9b87f5]" />
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">{profile.email}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs bg-[#E5DEFF] text-[#7E69AB] px-1.5 py-0.5 rounded-sm font-medium">
                      {profile.planTier}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      Member since {profile.memberSince}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {profile.badges.map(renderBadge)}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="py-2">
              <UserRound className="mr-2 h-4 w-4 text-[#9b87f5]" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2" onClick={() => setOpenSettings(true)}>
              <Settings className="mr-2 h-4 w-4 text-[#9b87f5]" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2">
              <CreditCard className="mr-2 h-4 w-4 text-[#9b87f5]" />
              <span>Billing & Plans</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2">
              <BellRing className="mr-2 h-4 w-4 text-[#9b87f5]" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2">
              <Bookmark className="mr-2 h-4 w-4 text-[#9b87f5]" />
              <span>Saved Reports</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2">
              <Calendar className="mr-2 h-4 w-4 text-[#9b87f5]" />
              <span>Scheduled Tasks</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="py-2">
              <KeyRound className="mr-2 h-4 w-4 text-[#9b87f5]" />
              <span>Security</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-2">
              <HelpCircle className="mr-2 h-4 w-4 text-[#9b87f5]" />
              <span>Help & Support</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="py-2" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4 text-[#9b87f5]" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-[#9b87f5]" />
              Profile Settings
            </DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4 pt-4">
              <div className="flex flex-col items-center space-y-3 mb-4">
                <Avatar className="h-24 w-24 border-2 border-[#9b87f5]">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-2xl bg-[#9b87f5] text-primary-foreground">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" className="bg-[#E5DEFF] text-[#7E69AB] border-[#9b87f5] hover:bg-[#D6BCFA]">
                  Change avatar
                </Button>
              </div>
              
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={profile.role}
                    onChange={(e) => setProfile({...profile, role: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                
                <div className="mt-2 border rounded-md p-4 bg-[#F1F0FB]">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Trophy className="h-4 w-4 mr-2 text-[#9b87f5]" />
                    Achievements & Badges
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map(renderBadge)}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs bg-white hover:bg-[#E5DEFF]"
                    >
                      <Wand2 className="h-3 w-3 mr-1" />
                      Add Badge
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Theme</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`flex-col h-auto py-3 px-2 ${profile.theme.mode === 'light' ? 'border-[#9b87f5] bg-[#E5DEFF]' : ''}`}
                      onClick={() => setProfile({...profile, theme: {...profile.theme, mode: 'light'}})}
                    >
                      <Sun className="h-5 w-5 mb-1" />
                      <span>Light</span>
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className={`flex-col h-auto py-3 px-2 ${profile.theme.mode === 'dark' ? 'border-[#9b87f5] bg-[#E5DEFF]' : ''}`}
                      onClick={() => setProfile({...profile, theme: {...profile.theme, mode: 'dark'}})}
                    >
                      <Moon className="h-5 w-5 mb-1" />
                      <span>Dark</span>
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      className={`flex-col h-auto py-3 px-2 ${profile.theme.mode === 'system' ? 'border-[#9b87f5] bg-[#E5DEFF]' : ''}`}
                      onClick={() => setProfile({...profile, theme: {...profile.theme, mode: 'system'}})}
                    >
                      <Settings className="h-5 w-5 mb-1" />
                      <span>System</span>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Accent Color</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {['purple', 'blue', 'green', 'orange', 'pink'].map((color) => {
                      const colorMap = {
                        purple: '#9b87f5',
                        blue: '#0EA5E9',
                        green: '#10B981',
                        orange: '#F97316',
                        pink: '#D946EF'
                      };
                      return (
                        <button
                          key={color}
                          className={`h-8 w-8 rounded-full border-2 ${profile.theme.color === color ? 'ring-2 ring-offset-2 ring-[#9b87f5]' : ''}`}
                          style={{ backgroundColor: colorMap[color] }}
                          onClick={() => setProfile({...profile, theme: {...profile.theme, color}})}
                        />
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Dashboard Layout</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      <PieChartIcon className="h-4 w-4 mr-2" />
                      Compact
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <BarChart className="h-4 w-4 mr-2" />
                      Expanded
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive important updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={profile.notifications.email}
                    onCheckedChange={(checked) => 
                      setProfile({
                        ...profile, 
                        notifications: {...profile.notifications, email: checked}
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">Get real-time alerts on your device</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={profile.notifications.push}
                    onCheckedChange={(checked) => 
                      setProfile({
                        ...profile, 
                        notifications: {...profile.notifications, push: checked}
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-report">Weekly Financial Summary</Label>
                    <p className="text-xs text-muted-foreground">Receive a comprehensive weekly report</p>
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={profile.notifications.weekly}
                    onCheckedChange={(checked) => 
                      setProfile({
                        ...profile, 
                        notifications: {...profile.notifications, weekly: checked}
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="product-updates">Product Updates</Label>
                    <p className="text-xs text-muted-foreground">Stay informed about new features</p>
                  </div>
                  <Switch
                    id="product-updates"
                    checked={profile.notifications.updates}
                    onCheckedChange={(checked) => 
                      setProfile({
                        ...profile, 
                        notifications: {...profile.notifications, updates: checked}
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="tips-tricks">Tips & Tricks</Label>
                    <p className="text-xs text-muted-foreground">Get helpful advice to optimize your finances</p>
                  </div>
                  <Switch
                    id="tips-tricks"
                    checked={profile.notifications.tips}
                    onCheckedChange={(checked) => 
                      setProfile({
                        ...profile, 
                        notifications: {...profile.notifications, tips: checked}
                      })
                    }
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor" className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-[#9b87f5]" />
                      Two-Factor Authentication
                    </Label>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={profile.security.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setProfile({
                        ...profile, 
                        security: {...profile.security, twoFactorAuth: checked}
                      })
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="session-timeout"
                      type="number"
                      value={profile.security.sessionTimeout}
                      onChange={(e) => setProfile({
                        ...profile, 
                        security: {...profile.security, sessionTimeout: parseInt(e.target.value) || 30}
                      })}
                    />
                    <Button variant="outline" className="bg-[#E5DEFF] text-[#7E69AB] border-[#9b87f5] hover:bg-[#D6BCFA]">
                      Reset Password
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-md border p-4 mt-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <KeyRound className="h-4 w-4 mr-2 text-[#9b87f5]" />
                    Connected Devices
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Manage devices that have access to your account
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <div>
                        <p className="text-sm font-medium">MacBook Pro</p>
                        <p className="text-xs text-muted-foreground">Last active: Today</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/90">
                        Remove
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <div>
                        <p className="text-sm font-medium">iPhone 13</p>
                        <p className="text-xs text-muted-foreground">Last active: Yesterday</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/90">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenSettings(false)}>Cancel</Button>
            <Button 
              onClick={handleSettingsSave} 
              className="bg-[#9b87f5] hover:bg-[#7E69AB]"
            >
              <Heart className="h-4 w-4 mr-2" />
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileSection;
