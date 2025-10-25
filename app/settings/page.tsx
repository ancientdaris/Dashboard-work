'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ActivityLog } from './activity-log'
import { Sidebar } from "@/components/layout/sidebar";

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and view activity logs.
            </p>
          </div>
          
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="space-y-4">
              <ActivityLog />
            </TabsContent>
            
            <TabsContent value="profile">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Profile Settings</h2>
                <p className="text-muted-foreground">
                  Update your profile information and preferences.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="security">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Security Settings</h2>
                <p className="text-muted-foreground">
                  Manage your account security settings.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
