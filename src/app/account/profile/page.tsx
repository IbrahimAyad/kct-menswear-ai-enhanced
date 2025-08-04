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

                      if (error) throw error;
                      alert('Password reset link sent to your email');
                    } catch (error) {

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