"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authApi, User } from "@/lib/api";

const SettingsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
          setProfile({
            name: response.data.username || "",
            email: response.data.email || "",
            avatar: response.data.profilePicture || "https://github.com/shadcn.png",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    username: "",
    bio: "",
    location: "",
    website: "",
  });

  // Update profileData when user data is fetched
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        username: user.username || "",
        bio: "",
        location: "",
        website: "",
      });
    }
  }, [user]);

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    studyReminders: true,
    darkMode: false,
    language: "English",
    timezone: "PST",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "account", label: "Account", icon: "⚙️" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
    { id: "billing", label: "Billing", icon: "💳" },
  ];

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: boolean | string) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-card border rounded-lg p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Profile Information
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <Input
                        value={profileData.fullName}
                        onChange={(e) =>
                          handleProfileChange("fullName", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Username
                      </label>
                      <Input
                        value={profileData.username}
                        onChange={(e) =>
                          handleProfileChange("username", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleProfileChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Bio
                      </label>
                      <textarea
                        className="w-full p-3 border rounded-md resize-none"
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) =>
                          handleProfileChange("bio", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location
                      </label>
                      <Input
                        value={profileData.location}
                        onChange={(e) =>
                          handleProfileChange("location", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Website
                      </label>
                      <Input
                        value={profileData.website}
                        onChange={(e) =>
                          handleProfileChange("website", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">
                    Profile Picture
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Upload New Picture
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Account Settings
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Change Password</h3>
                      <div className="space-y-3 max-w-md">
                        <Input type="password" placeholder="Current password" />
                        <Input type="password" placeholder="New password" />
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                        />
                        <Button size="sm">Update Password</Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline" size="sm">
                        Enable 2FA
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">Connected Accounts</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">🔗</span>
                            <div>
                              <p className="font-medium">Google</p>
                              <p className="text-sm text-muted-foreground">
                                Connected
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Disconnect
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">🔗</span>
                            <div>
                              <p className="font-medium">GitHub</p>
                              <p className="text-sm text-muted-foreground">
                                Not connected
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
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.emailNotifications}
                          onChange={(e) =>
                            handlePreferenceChange(
                              "emailNotifications",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications in browser
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.pushNotifications}
                          onChange={(e) =>
                            handlePreferenceChange(
                              "pushNotifications",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Weekly Digest</h3>
                        <p className="text-sm text-muted-foreground">
                          Get a summary of your weekly progress
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.weeklyDigest}
                          onChange={(e) =>
                            handlePreferenceChange(
                              "weeklyDigest",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Study Reminders</h3>
                        <p className="text-sm text-muted-foreground">
                          Get reminded about your study schedule
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.studyReminders}
                          onChange={(e) =>
                            handlePreferenceChange(
                              "studyReminders",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Privacy Settings
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Profile Visibility</h3>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="visibility"
                            defaultChecked
                          />
                          <span className="text-sm">
                            Public - Anyone can see your profile
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="visibility" />
                          <span className="text-sm">
                            Friends only - Only your connections can see your
                            profile
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="visibility" />
                          <span className="text-sm">
                            Private - Only you can see your profile
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">Data & Analytics</h3>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">
                            Allow analytics to improve your learning experience
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">
                            Share anonymous usage data to help improve the
                            platform
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">
                        Data Export & Deletion
                      </h3>
                      <div className="space-x-2 ">
                        <Button variant="outline" size="sm">
                          Download My Data
                        </Button>
                        <Button variant="destructive" size="sm">
                          Delete Account
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Account deletion is permanent and cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Billing & Subscription
                  </h2>

                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg bg-primary/5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Current Plan: Pro</h3>
                        <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Access to all courses, AI tutor, and premium features
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">
                          $29.99/month
                        </span>
                        <Button variant="outline" size="sm">
                          Change Plan
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Payment Method</h3>
                      <div className="p-3 border rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">💳</span>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-muted-foreground">
                              Expires 12/25
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Billing History</h3>
                      <div className="space-y-2">
                        {[
                          {
                            date: "Jan 1, 2024",
                            amount: "$29.99",
                            status: "Paid",
                          },
                          {
                            date: "Dec 1, 2023",
                            amount: "$29.99",
                            status: "Paid",
                          },
                          {
                            date: "Nov 1, 2023",
                            amount: "$29.99",
                            status: "Paid",
                          },
                        ].map((invoice, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{invoice.date}</p>
                              <p className="text-sm text-muted-foreground">
                                Pro Plan
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{invoice.amount}</p>
                              <p className="text-sm text-green-600">
                                {invoice.status}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
