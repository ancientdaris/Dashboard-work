'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ActivityLog } from './activity-log'
import { Sidebar } from "@/components/layout/sidebar";
import { Smartphone, Monitor, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Session {
  id: string;
  user_agent: string;
  ip: string;
  created_at: string;
  updated_at: string;
}

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
  business_type: string | null;
  account_status: string | null;
  gst_number: string | null;
  pan_number: string | null;
  business_name: string | null;
  verification_documents: unknown;
  verified_at: string | null;
  verified_by: string | null;
};

function SettingsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'activity');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    fetchSessions();
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev: Partial<Profile>) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile((prev: Partial<Profile>) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updateData = {
        full_name: profile.full_name,
        business_name: profile.business_name,
        business_type: profile.business_type,
        gst_number: profile.gst_number,
        pan_number: profile.pan_number,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await (supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('profiles') as any)
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setCurrentSessionId(session.access_token);
        // Note: Supabase doesn't provide a built-in way to list all sessions
        // This is a placeholder - you would need to implement session tracking
        // in your database if you want to show multiple devices
        setSessions([{
          id: session.access_token,
          user_agent: navigator.userAgent,
          ip: 'Current location',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load device information',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const parseUserAgent = (userAgent: string) => {
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    const isIOS = /iPhone|iPad/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);
    const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
    const isChrome = /Chrome/i.test(userAgent);
    const isFirefox = /Firefox/i.test(userAgent);
    const isEdge = /Edg/i.test(userAgent);

    let deviceType = 'Desktop';
    let browser = 'Unknown';
    let icon = Monitor;

    if (isTablet) {
      deviceType = isIOS ? 'iPad' : 'Tablet';
      icon = Tablet;
    } else if (isMobile) {
      deviceType = isIOS ? 'iPhone' : isAndroid ? 'Android Phone' : 'Mobile';
      icon = Smartphone;
    }

    if (isChrome) browser = 'Chrome';
    else if (isSafari) browser = 'Safari';
    else if (isFirefox) browser = 'Firefox';
    else if (isEdge) browser = 'Edge';

    return { deviceType, browser, icon };
  };

  const handleSignOutAllDevices = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      toast({
        title: 'Success',
        description: 'Signed out from all devices',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out from all devices',
        variant: 'destructive',
      });
    }
  };
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="space-y-4">
              <ActivityLog />
            </TabsContent>
            
            <TabsContent value="profile">
              {isProfileLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold">Profile Settings</h2>
                    <p className="text-muted-foreground">
                      Update your profile information and business details
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email || ''}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Full Name</Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            value={profile.full_name || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Account Status</Label>
                          <div className="p-2 rounded-md bg-muted text-muted-foreground h-10 flex items-center">
                            {profile.account_status ? 
                              profile.account_status.charAt(0).toUpperCase() + profile.account_status.slice(1) : 
                              'N/A'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="business_name">Business Name</Label>
                          <Input
                            id="business_name"
                            name="business_name"
                            value={profile.business_name || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="business_type">Business Type</Label>
                          <Select
                            value={profile.business_type || ''}
                            onValueChange={(value) => handleSelectChange('business_type', value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="wholesaler">Wholesaler</SelectItem>
                              <SelectItem value="retailer">Retailer</SelectItem>
                              <SelectItem value="designer">Designer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <div className="p-2 rounded-md bg-muted text-muted-foreground h-10 flex items-center">
                            {profile.role ? 
                              profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 
                              'N/A'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gst_number">GST Number</Label>
                          <Input
                            id="gst_number"
                            name="gst_number"
                            value={profile.gst_number || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="22AAAAA0000A1Z5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pan_number">PAN Number</Label>
                          <Input
                            id="pan_number"
                            name="pan_number"
                            value={profile.pan_number || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder="AAAAA0000A"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="created_at">Member Since</Label>
                          <div className="p-2 rounded-md bg-muted text-muted-foreground h-10 flex items-center">
                            {profile.created_at ? 
                              new Date(profile.created_at).toLocaleDateString('en-IN', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              }) : 
                              'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      {isEditing ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              fetchProfile();
                              setIsEditing(false);
                            }}
                            disabled={isProfileLoading}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isProfileLoading}>
                            {isProfileLoading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="bg-primary"
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="security">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Security Settings</h2>
                <p className="text-muted-foreground">
                  Manage your account security settings.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="devices">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Connected Devices</h2>
                  <p className="text-muted-foreground">
                    Manage devices that have access to your account.
                  </p>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : sessions.length === 0 ? (
                  <Card>
                    <CardHeader>
                      <CardDescription>
                        No active sessions found.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => {
                      const { deviceType, browser, icon: DeviceIcon } = parseUserAgent(session.user_agent);
                      const isCurrentSession = session.id === currentSessionId;
                      const lastActive = new Date(session.updated_at);
                      const now = new Date();
                      const diffMinutes = Math.floor((now.getTime() - lastActive.getTime()) / 60000);
                      
                      let lastActiveText = 'Now';
                      if (diffMinutes > 0) {
                        if (diffMinutes < 60) {
                          lastActiveText = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
                        } else if (diffMinutes < 1440) {
                          const hours = Math.floor(diffMinutes / 60);
                          lastActiveText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
                        } else {
                          const days = Math.floor(diffMinutes / 1440);
                          lastActiveText = `${days} day${days > 1 ? 's' : ''} ago`;
                        }
                      }

                      return (
                        <Card key={session.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-lg ${isCurrentSession ? 'bg-primary/10' : 'bg-gray-100'}`}>
                                  <DeviceIcon className={`h-6 w-6 ${isCurrentSession ? 'text-primary' : 'text-gray-600'}`} />
                                </div>
                                <div>
                                  <CardTitle className="text-base">{deviceType} - {browser}</CardTitle>
                                  <CardDescription>
                                    {session.ip} • Last active: {lastActiveText}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {isCurrentSession ? (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    Current Device
                                  </span>
                                ) : (
                                  <Button variant="outline" size="sm">
                                    Remove
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {sessions.length > 1 && (
                  <div className="pt-4">
                    <Button 
                      variant="destructive" 
                      className="w-full sm:w-auto"
                      onClick={handleSignOutAllDevices}
                    >
                      Sign Out All Other Devices
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
