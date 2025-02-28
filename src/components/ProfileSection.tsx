
import { useState } from "react";
import { UserRound, Settings, LogOut, UserCog, CreditCard, KeyRound, HelpCircle, BellRing } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const ProfileSection = () => {
  const { toast } = useToast();
  const [openSettings, setOpenSettings] = useState(false);
  const [profile, setProfile] = useState({
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    role: "Financial Manager",
    avatar: "", // We'll use fallback for now
    notifications: {
      email: true,
      push: true,
      weekly: false
    }
  });
  
  const handleSettingsSave = () => {
    setOpenSettings(false);
    toast({
      title: "Settings updated",
      description: "Your profile settings have been saved successfully."
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully."
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 px-2 relative" size="sm">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
              <p className="text-xs leading-none text-muted-foreground">{profile.role}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserRound className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DialogTrigger asChild onClick={() => setOpenSettings(true)}>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BellRing className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <KeyRound className="mr-2 h-4 w-4" />
              <span>Security</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openSettings} onOpenChange={setOpenSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center space-y-3 mb-2">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-2xl">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">Change avatar</Button>
            </div>
            
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
            
            <div className="border-t pt-4 mt-2">
              <h4 className="font-medium mb-3">Notification Preferences</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive notifications via email</p>
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
                    <p className="text-xs text-muted-foreground">Receive push notifications</p>
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
                    <Label htmlFor="weekly-report">Weekly Report</Label>
                    <p className="text-xs text-muted-foreground">Receive weekly financial summary</p>
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
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenSettings(false)}>Cancel</Button>
            <Button onClick={handleSettingsSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileSection;
