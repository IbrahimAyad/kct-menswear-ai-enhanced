"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Ruler, 
  Package, 
  Heart, 
  Crown,
  Settings,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react'
import { MeasurementProfiles } from '@/components/profile/MeasurementProfiles'
import { OrderHistory } from '@/components/profile/OrderHistory'
import { Wishlist } from '@/components/profile/Wishlist'
import { useCustomerStore } from '@/store/customerStore'
import { cn } from '@/lib/utils/cn'

type TabType = 'overview' | 'measurements' | 'orders' | 'wishlist' | 'settings'

const LOYALTY_TIERS = {
  Sterling: { icon: '🥈', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  Gold: { icon: '🥇', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  Platinum: { icon: '💎', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  Crown: { icon: '👑', color: 'text-burgundy', bgColor: 'bg-burgundy/10' }
}

export default function ProfilePage() {
  const { profile, isAuthenticated, logout, getLoyaltyStatus } = useCustomerStore()
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  if (!isAuthenticated || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container-main py-12">
          <Card className="max-w-md mx-auto p-8 text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-serif mb-2">Sign In Required</h1>
            <p className="text-gray-600 mb-6">
              Please sign in to access your profile and exclusive features
            </p>
            <Button className="bg-burgundy hover:bg-burgundy-700 w-full">
              Sign In
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const loyaltyStatus = getLoyaltyStatus()
  const tierConfig = LOYALTY_TIERS[profile.tier.name]

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: User },
    { id: 'measurements' as TabType, label: 'Measurements', icon: Ruler },
    { id: 'orders' as TabType, label: 'Orders', icon: Package },
    { id: 'wishlist' as TabType, label: 'Wishlist', icon: Heart },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-main py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 bg-burgundy rounded-full flex items-center justify-center text-white text-2xl font-serif">
                  {profile.firstName?.[0]}{profile.lastName?.[0]}
                </div>
                <div>
                  <h1 className="text-2xl font-serif">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-gray-600">{profile.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={cn(
                      "px-3 py-1 rounded-full flex items-center gap-2",
                      tierConfig.bgColor
                    )}>
                      <span className="text-lg">{tierConfig.icon}</span>
                      <span className={cn("font-medium", tierConfig.color)}>
                        {profile.tier.name} Member
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {loyaltyStatus.points.toLocaleString()} points
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={logout}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>

            {/* Loyalty Progress */}
            {loyaltyStatus.nextTier !== profile.tier.name && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Progress to {loyaltyStatus.nextTier}
                  </span>
                  <span className="text-sm text-gray-600">
                    {loyaltyStatus.pointsToNext.toLocaleString()} points to go
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-burgundy h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${((loyaltyStatus.points % 5000) / 5000) * 100}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2",
                  activeTab === tab.id && "bg-burgundy hover:bg-burgundy-700"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Info */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span>{profile.email}</span>
                    </div>
                    {profile.phoneNumber && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span>{profile.phoneNumber}</span>
                      </div>
                    )}
                    {profile.dateOfBirth && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span>Birthday: {new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Crown className="h-5 w-5 text-gray-400" />
                      <span>Member since {new Date(profile.createdAt).getFullYear()}</span>
                    </div>
                  </div>
                </Card>

                {/* Style Preferences */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Style Preferences</h2>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Preferred Fit:</span>
                      <p className="font-medium capitalize">{profile.preferences.preferredFit}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Style Personality:</span>
                      <p className="font-medium capitalize">{profile.preferences.stylePersonality}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Favorite Colors:</span>
                      <div className="flex gap-2 mt-1">
                        {profile.preferences.favoriteColors.map(color => (
                          <Badge key={color} variant="secondary">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setActiveTab('settings')}
                  >
                    Edit Preferences
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>

                {/* Recent Orders */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Orders</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab('orders')}
                    >
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                  <OrderHistory limit={3} showPagination={false} />
                </Card>

                {/* Addresses */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Saved Addresses</h2>
                  <div className="space-y-3">
                    {profile.addresses.slice(0, 2).map(address => (
                      <div key={address.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.streetAddress1}
                              {address.streetAddress2 && `, ${address.streetAddress2}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                          </div>
                          {address.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setActiveTab('settings')}
                  >
                    Manage Addresses
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              </div>
            )}

            {activeTab === 'measurements' && <MeasurementProfiles />}
            {activeTab === 'orders' && <OrderHistory />}
            {activeTab === 'wishlist' && <Wishlist />}

            {activeTab === 'settings' && (
              <Card className="p-6">
                <h2 className="text-2xl font-serif mb-6">Account Settings</h2>
                <p className="text-gray-600">
                  Settings page coming soon. You'll be able to update your profile, 
                  manage addresses, payment methods, and preferences here.
                </p>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}