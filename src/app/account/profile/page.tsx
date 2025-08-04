'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  ChevronLeft,
  Shield,
  Trash2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  first_name: string
  last_name: string
  phone: string
  date_of_birth: string
  preferences: {
    newsletter: boolean
    sms_notifications: boolean
    size_reminders: boolean
  }
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile>({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    preferences: {
      newsletter: true,
      sms_notifications: false,
      size_reminders: true,
    }
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirectTo=/account/profile')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      // Extract name from user metadata
      const userMeta = user.user_metadata || {}
      setProfile(prev => ({
        ...prev,
        first_name: userMeta.first_name || '',
        last_name: userMeta.last_name || '',
        phone: userMeta.phone || '',
        date_of_birth: userMeta.date_of_birth || '',
        preferences: userMeta.preferences || prev.preferences,
      }))
      setEditedProfile(prev => ({
        ...prev,
        first_name: userMeta.first_name || '',
        last_name: userMeta.last_name || '',
        phone: userMeta.phone || '',
        date_of_birth: userMeta.date_of_birth || '',
        preferences: userMeta.preferences || prev.preferences,
      }))
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: editedProfile.first_name,
          last_name: editedProfile.last_name,
          phone: editedProfile.phone,
          date_of_birth: editedProfile.date_of_birth,
          preferences: editedProfile.preferences,
        }
      })

      if (error) throw error

      setProfile(editedProfile)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/account" className="hover:text-black">
              Account
            </Link>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span className="text-black">Profile Settings</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Personal Information</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.first_name}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, first_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    ) : (
                      <p className="py-2 text-gray-900">{profile.first_name || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.last_name}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, last_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    ) : (
                      <p className="py-2 text-gray-900">{profile.last_name || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="py-2 text-gray-900">{user.email}</p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="py-2 text-gray-900">{profile.phone || 'Not provided'}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editedProfile.date_of_birth}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="py-2 text-gray-900">
                        {profile.date_of_birth 
                          ? new Date(profile.date_of_birth).toLocaleDateString()
                          : 'Not provided'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Communication Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Newsletter</p>
                    <p className="text-sm text-gray-600">Receive updates about new products and offers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEditing ? editedProfile.preferences.newsletter : profile.preferences.newsletter}
                      onChange={(e) => isEditing && setEditedProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, newsletter: e.target.checked }
                      }))}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Get order updates via text message</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEditing ? editedProfile.preferences.sms_notifications : profile.preferences.sms_notifications}
                      onChange={(e) => isEditing && setEditedProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, sms_notifications: e.target.checked }
                      }))}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Size Reminders</p>
                    <p className="text-sm text-gray-600">Remember your size preferences for faster shopping</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEditing ? editedProfile.preferences.size_reminders : profile.preferences.size_reminders}
                      onChange={(e) => isEditing && setEditedProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, size_reminders: e.target.checked }
                      }))}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Account Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold">Account Security</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email Verified</span>
                  <span className="text-green-600 font-medium">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button 
                  onClick={async () => {
                    try {
                      const { error } = await supabase.auth.resetPasswordForEmail(user.email!, {
                        redirectTo: `${window.location.origin}/auth/reset-password`
                      });
                      if (error) throw error;
                      alert('Password reset link sent to your email');
                    } catch (error) {
                      console.error('Failed to send reset email:', error);
                      alert('Failed to send reset email. Please try again.');
                    }
                  }}
                  className="w-full text-left text-sm text-black hover:text-gray-700 font-medium py-2"
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-4 text-red-600">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button 
                onClick={async () => {
                  const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
                  if (confirmed) {
                    try {
                      // In a real app, you'd want to call a backend endpoint to properly delete user data
                      alert('Account deletion functionality would be implemented here with proper backend integration.');
                    } catch (error) {
                      console.error('Failed to delete account:', error);
                    }
                  }
                }}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}