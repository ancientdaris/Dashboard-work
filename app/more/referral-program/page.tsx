'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Share2, TrendingUp, Users, Copy, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Sidebar } from '@/components/layout/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

interface ReferralCode {
  id: string;
  referrer_id: string;
  referral_code: string;
  is_active: boolean;
  created_at: string;
}

interface ReferralTransaction {
  id: string;
  referrer_id: string;
  referee_id: string;
  referral_code_id: string;
  created_at: string;
}

interface ReferralReward {
  id: string;
  user_id: string;
  reward_amount: number;
  status: 'active' | 'redeemed' | 'expired';
  created_at: string;
}

interface Stats {
  totalRefers: number;
  totalRewards: number;
  activeRewards: number;
}

export default function ReferralProgramPage() {
  const [myCode, setMyCode] = useState<ReferralCode | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalRefers: 0,
    totalRewards: 0,
    activeRewards: 0
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setRefreshing(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to view your referral program.',
          variant: 'destructive',
        });
        return;
      }

      // Get my referral code
      let { data: code } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('referrer_id', user.id)
        .eq('is_active', true)
        .single();

      if (!code) {
        // No code exists, create one
        const newCode = `REF${user.id.substring(0, 8).toUpperCase()}`;
        const { data: created } = await supabase
          .from('referral_codes')
          .insert({
            referrer_id: user.id,
            referral_code: newCode,
            is_active: true
          })
          .select()
          .single();
        code = created;
      }

      setMyCode(code);

      // Get my referral stats
      const { data: transactions } = await supabase
        .from('referral_transactions')
        .select('*')
        .eq('referrer_id', user.id);

      const { data: rewards } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('user_id', user.id);

      setStats({
        totalRefers: transactions?.length || 0,
        totalRewards: rewards?.reduce((sum: number, r: ReferralReward) => sum + parseFloat(r.reward_amount.toString()), 0) || 0,
        activeRewards: rewards?.filter((r: ReferralReward) => r.status === 'active').length || 0
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load referral data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const copyReferralCode = async () => {
    if (!myCode) return;

    try {
      await navigator.clipboard.writeText(myCode.referral_code);
      toast({
        title: 'Copied!',
        description: 'Referral code copied to clipboard',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to copy referral code',
        variant: 'destructive',
      });
    }
  };

  const shareReferralCode = async () => {
    if (!myCode) return;

    const shareText = `Join OSAS 360 using my referral code: ${myCode.referral_code}\n\nGet exclusive rewards and benefits!`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'OSAS 360 Referral',
          text: shareText,
        });
      } else {
        // Fallback to copying
        await navigator.clipboard.writeText(shareText);
        toast({
          title: 'Copied!',
          description: 'Referral message copied to clipboard',
        });
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast({
          title: 'Error',
          description: 'Failed to share referral code',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container p-4 md:p-8 max-w-7xl">
            {/* Page Header */}
            <div className="mb-8 space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Referral Program
              </h1>
              <p className="text-muted-foreground">
                Refer retailers and earn rewards for every successful signup
              </p>
            </div>

            <div className="space-y-6">
              {/* Header Stats Card */}
              <Card className="bg-gradient-to-r from-pink-600 to-rose-700 border-none text-white">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Gift className="h-6 w-6" />
                    <CardTitle className="text-2xl text-white">Your Referral Stats</CardTitle>
                  </div>
                  <CardDescription className="text-pink-100">
                    Track your referrals and rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="flex flex-col items-center">
                      <Users className="h-5 w-5 mb-2" />
                      <div className="text-3xl font-bold">{stats.totalRefers}</div>
                      <div className="text-sm text-pink-200">Referrals</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <TrendingUp className="h-5 w-5 mb-2" />
                      <div className="text-3xl font-bold">
                        ₹{(stats.totalRewards / 1000).toFixed(1)}K
                      </div>
                      <div className="text-sm text-pink-200">Earned</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <Gift className="h-5 w-5 mb-2 text-yellow-200" />
                      <div className="text-3xl font-bold text-yellow-200">{stats.activeRewards}</div>
                      <div className="text-sm text-pink-200">Active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Referral Code Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Referral Code</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Card className="bg-pink-50 border-pink-200">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-pink-700 tracking-widest">
                            {myCode?.referral_code || 'Loading...'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-2">
                      <Button 
                        size="lg" 
                        className="flex-1 bg-pink-600 hover:bg-pink-700"
                        onClick={shareReferralCode}
                        disabled={!myCode}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Code
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline"
                        onClick={copyReferralCode}
                        disabled={!myCode}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline"
                        onClick={fetchReferralData}
                        disabled={refreshing}
                      >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Benefits Card */}
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-900">Referral Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-green-800">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Earn ₹500 for every successful referral</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Your referee gets ₹300 welcome bonus</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Rewards can be redeemed for orders</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>No limit on referrals</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
