import { useState } from "react";
import { AnalyticsSidebar } from "@/components/analytics/AnalyticsSidebar";
import { AnalyticsTopbar } from "@/components/analytics/AnalyticsTopbar";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Database,
  Zap,
  Moon,
  Sun,
  Check,
  ChevronRight,
  Mail,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Zap },
  { id: "api", label: "API Keys", icon: Key },
  { id: "data", label: "Data & Privacy", icon: Database },
];

export default function AnalyticsSettings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    matchAlerts: true,
    predictions: true,
    weeklyDigest: false,
    marketing: false,
  });

  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      <AnalyticsSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnalyticsTopbar title="Settings" />
        <main className="flex-1 overflow-auto">
          <div className="flex">
            {/* Settings Sidebar */}
            <div className="w-64 border-r border-white/5 p-6">
              <nav className="space-y-1">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      activeSection === section.id
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                    )}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Settings Content */}
            <div className="flex-1 p-8">
              {/* Profile Section */}
              {activeSection === "profile" && (
                <div className="max-w-2xl space-y-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                      Profile Settings
                    </h2>
                    <p className="text-muted-foreground">
                      Manage your account details and preferences
                    </p>
                  </div>

                  {/* Avatar */}
                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Profile Picture
                    </h3>
                    <div className="flex items-center gap-6">
                      <Avatar className="w-20 h-20 border-2 border-primary/30">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                        <AvatarFallback>AC</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline">Upload New Photo</Button>
                        <p className="text-xs text-muted-foreground">
                          JPG, GIF or PNG. Max size 2MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">
                          First Name
                        </label>
                        <Input
                          defaultValue="Alex"
                          className="bg-[#0a0a0f] border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">
                          Last Name
                        </label>
                        <Input
                          defaultValue="Chen"
                          className="bg-[#0a0a0f] border-white/10"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm text-muted-foreground mb-2 block">
                          Email
                        </label>
                        <Input
                          defaultValue="alex.chen@arenax.com"
                          className="bg-[#0a0a0f] border-white/10"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm text-muted-foreground mb-2 block">
                          Role
                        </label>
                        <Input
                          defaultValue="Lead Analyst"
                          className="bg-[#0a0a0f] border-white/10"
                          disabled
                        />
                      </div>
                    </div>
                    <Button className="mt-4 bg-primary hover:bg-primary/90">
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <div className="max-w-2xl space-y-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                      Notifications
                    </h2>
                    <p className="text-muted-foreground">
                      Configure how and when you receive notifications
                    </p>
                  </div>

                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Notification Channels
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">
                              Email Notifications
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications via email
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(v) =>
                            setNotifications({ ...notifications, email: v })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">
                              Push Notifications
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Receive push notifications on your devices
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(v) =>
                            setNotifications({ ...notifications, push: v })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Notification Types
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div>
                          <p className="font-medium text-foreground">
                            Match Alerts
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Get notified about live matches and results
                          </p>
                        </div>
                        <Switch
                          checked={notifications.matchAlerts}
                          onCheckedChange={(v) =>
                            setNotifications({
                              ...notifications,
                              matchAlerts: v,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div>
                          <p className="font-medium text-foreground">
                            Prediction Updates
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Notifications about your predictions
                          </p>
                        </div>
                        <Switch
                          checked={notifications.predictions}
                          onCheckedChange={(v) =>
                            setNotifications({
                              ...notifications,
                              predictions: v,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div>
                          <p className="font-medium text-foreground">
                            Weekly Digest
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Weekly summary of your analytics
                          </p>
                        </div>
                        <Switch
                          checked={notifications.weeklyDigest}
                          onCheckedChange={(v) =>
                            setNotifications({
                              ...notifications,
                              weeklyDigest: v,
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-foreground">
                            Marketing
                          </p>
                          <p className="text-sm text-muted-foreground">
                            News and product updates
                          </p>
                        </div>
                        <Switch
                          checked={notifications.marketing}
                          onCheckedChange={(v) =>
                            setNotifications({ ...notifications, marketing: v })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Section */}
              {activeSection === "appearance" && (
                <div className="max-w-2xl space-y-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                      Appearance
                    </h2>
                    <p className="text-muted-foreground">
                      Customize the look and feel of your dashboard
                    </p>
                  </div>

                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Theme
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={() => setTheme("light")}
                        className={cn(
                          "p-4 rounded-xl border transition-all",
                          theme === "light"
                            ? "border-primary bg-primary/10"
                            : "border-white/10 hover:border-white/20",
                        )}
                      >
                        <Sun className="w-6 h-6 mb-2 mx-auto text-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          Light
                        </p>
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={cn(
                          "p-4 rounded-xl border transition-all",
                          theme === "dark"
                            ? "border-primary bg-primary/10"
                            : "border-white/10 hover:border-white/20",
                        )}
                      >
                        <Moon className="w-6 h-6 mb-2 mx-auto text-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          Dark
                        </p>
                      </button>
                      <button
                        onClick={() => setTheme("system")}
                        className={cn(
                          "p-4 rounded-xl border transition-all",
                          theme === "system"
                            ? "border-primary bg-primary/10"
                            : "border-white/10 hover:border-white/20",
                        )}
                      >
                        <Settings className="w-6 h-6 mb-2 mx-auto text-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          System
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Accent Color
                    </h3>
                    <div className="flex items-center gap-3">
                      {[
                        "#6366f1",
                        "#8b5cf6",
                        "#06b6d4",
                        "#10b981",
                        "#f59e0b",
                        "#ef4444",
                      ].map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-full border-2 border-white/20 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === "security" && (
                <div className="max-w-2xl space-y-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                      Security
                    </h2>
                    <p className="text-muted-foreground">
                      Manage your account security and authentication
                    </p>
                  </div>

                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">
                          Current Password
                        </label>
                        <Input
                          type="password"
                          className="bg-[#0a0a0f] border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">
                          New Password
                        </label>
                        <Input
                          type="password"
                          className="bg-[#0a0a0f] border-white/10"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">
                          Confirm New Password
                        </label>
                        <Input
                          type="password"
                          className="bg-[#0a0a0f] border-white/10"
                        />
                      </div>
                    </div>
                    <Button className="mt-4 bg-primary hover:bg-primary/90">
                      Update Password
                    </Button>
                  </div>

                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Badge className="bg-success/20 text-success border-success/30">
                        Enabled
                      </Badge>
                    </div>
                    <Button variant="outline">Configure 2FA</Button>
                  </div>

                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Active Sessions
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              Chrome on MacOS
                            </p>
                            <p className="text-sm text-muted-foreground">
                              San Francisco, USA • Current session
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-success/20 text-success border-success/30">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted/20 flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              Safari on iPhone
                            </p>
                            <p className="text-sm text-muted-foreground">
                              San Francisco, USA • 2 hours ago
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations Section */}
              {activeSection === "integrations" && (
                <div className="max-w-2xl space-y-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                      Integrations
                    </h2>
                    <p className="text-muted-foreground">
                      Connect third-party services and APIs
                    </p>
                  </div>

                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Connected Services
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#5865F2]/20 flex items-center justify-center">
                            <span className="text-[#5865F2] font-bold">D</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              Discord
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Receive alerts in Discord
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-success/20 text-success border-success/30">
                          Connected
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#1DA1F2]/20 flex items-center justify-center">
                            <span className="text-[#1DA1F2] font-bold">T</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              Twitter
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Share predictions on Twitter
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Connect
                        </Button>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#7289DA]/20 flex items-center justify-center">
                            <span className="text-[#7289DA] font-bold">S</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Slack</p>
                            <p className="text-sm text-muted-foreground">
                              Team notifications in Slack
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* API Section */}
              {activeSection === "api" && (
                <div className="max-w-2xl space-y-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                      API Keys
                    </h2>
                    <p className="text-muted-foreground">
                      Manage API keys for programmatic access
                    </p>
                  </div>

                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">
                        Your API Keys
                      </h3>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        Generate New Key
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-[#0a0a0f] rounded-lg p-4 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">
                            Production Key
                          </span>
                          <Badge className="bg-success/20 text-success border-success/30">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-muted-foreground bg-muted/10 px-2 py-1 rounded">
                            ax_prod_xxxx...xxxx
                          </code>
                          <Button variant="ghost" size="sm">
                            Copy
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created Jan 15, 2024 • Last used 2 hours ago
                        </p>
                      </div>
                      <div className="bg-[#0a0a0f] rounded-lg p-4 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">
                            Development Key
                          </span>
                          <Badge className="bg-success/20 text-success border-success/30">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-muted-foreground bg-muted/10 px-2 py-1 rounded">
                            ax_dev_xxxx...xxxx
                          </code>
                          <Button variant="ghost" size="sm">
                            Copy
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created Jan 10, 2024 • Last used 1 day ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data & Privacy Section */}
              {activeSection === "data" && (
                <div className="max-w-2xl space-y-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                      Data & Privacy
                    </h2>
                    <p className="text-muted-foreground">
                      Manage your data and privacy preferences
                    </p>
                  </div>

                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Data Export
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Download a copy of your data including predictions,
                      reports, and settings.
                    </p>
                    <Button variant="outline">Request Data Export</Button>
                  </div>

                  <div className="bg-[#12121a] rounded-xl border border-white/5 p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Delete Account
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
