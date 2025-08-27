"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authApi, User } from "@/lib/api";
import { getIcon } from "../icons";

// Mock notifications data - replace with real API call later
const notifications = [
  {
    id: 1,
    title: "Assignment Due",
    message: "Math homework due tomorrow",
    time: "2 hours ago",
    unread: true
  },
  {
    id: 2,
    title: "New Course Available",
    message: "Advanced Physics course is now available",
    time: "1 day ago",
    unread: false
  }
];

const UserNav = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                className="h-5 w-5 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              StudySmart
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 01-3.46 0"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Mark all read
                    </Button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b hover:bg-muted/50 cursor-pointer ${
                        notification.unread ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread
                              ? "bg-primary"
                              : "bg-transparent"
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t">
                  <Button variant="ghost" size="sm" className="w-full text-sm">
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="relative">
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full p-0"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profilePicture || "https://github.com/shadcn.png"} />
                <AvatarFallback className="text-sm font-medium">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.profilePicture || "https://github.com/shadcn.png"} />
                      <AvatarFallback className="text-sm font-medium">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user?.username || "Loading..."}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user?.email || "Loading..."}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-muted text-red-600"
                    onClick={() => {
                      setShowUserMenu(false);
                      authApi.clearToken();
                      window.location.href = '/auth/login';
                    }}
                  >
                    <svg
                      className="mr-3 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </nav>
  );
};

export default UserNav;
