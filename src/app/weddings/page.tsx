'use client';

import { useState } from 'react';
import { WeddingPortal } from '@/components/wedding/WeddingPortal';
import { WeddingStudio } from '@/components/wedding/WeddingStudio';
import { Wedding, WeddingMember } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Users, Calendar, ShoppingBag, Camera, BookOpen } from 'lucide-react';

// Mock wedding data
const mockWedding: Wedding = {
  id: 'w-123',
  weddingDate: new Date('2024-08-15'),
  groomId: 'user-1',
  status: 'planning',
  partyMembers: [
    {
      id: 'user-1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'groom',
      measurements: {
        chest: 40,
        waist: 32,
        hips: 38,
        neck: 15.5,
        inseam: 32,
        sleeve: 34,
      },
    },
    {
      id: 'user-2',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'best_man',
      measurements: undefined,
    },
    {
      id: 'user-3',
      name: 'David Lee',
      email: 'david@example.com',
      role: 'groomsman',
      measurements: {
        chest: 42,
        waist: 34,
        hips: 40,
        neck: 16,
        inseam: 30,
        sleeve: 33,
      },
    },
    {
      id: 'user-4',
      name: 'Chris Wilson',
      email: 'chris@example.com',
      role: 'groomsman',
      measurements: undefined,
    },
  ],
};

export default function WeddingsPage() {
  const [wedding, setWedding] = useState<Wedding>(mockWedding);
  const [showWeddingStudio, setShowWeddingStudio] = useState(false);
  const currentUserId = 'user-1'; // Mock current user

  const handleUpdateWedding = (updatedWedding: Wedding) => {
    setWedding(updatedWedding);
    console.log('Wedding updated:', updatedWedding);
  };

  const handleSendMessage = (message: string, recipientId?: string) => {
    console.log('Sending message:', message, 'to:', recipientId || 'all');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            
            <div className="flex gap-4">
              <Link 
                href="/weddings/collections" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold/90 text-black rounded-sm font-medium transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Browse Collections
              </Link>
              <Link 
                href="/weddings/coordination" 
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black hover:bg-black hover:text-white rounded-sm font-medium transition-colors"
              >
                <Users className="h-4 w-4" />
                Group Tools
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Content */}
      {showWeddingStudio ? (
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setShowWeddingStudio(false)}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Wedding Portal
              </button>
            </div>
            <WeddingStudio />
          </div>
        </div>
      ) : (
        <>
          {/* Wedding Portal */}
          <WeddingPortal
            wedding={wedding}
            currentUserId={currentUserId}
            onUpdateWedding={handleUpdateWedding}
            onSendMessage={handleSendMessage}
          />

          {/* Quick Actions */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif mb-8 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link 
              href="/weddings/collections"
              className="group p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/30 transition-colors">
                  <ShoppingBag className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Browse Collections</h3>
                <p className="text-gray-600">Explore curated wedding styles for your party</p>
              </div>
            </Link>

            <Link 
              href="/weddings/coordination"
              className="group p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/30 transition-colors">
                  <Users className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Coordinate Group</h3>
                <p className="text-gray-600">Manage invitations, sizes, and orders</p>
              </div>
            </Link>

            <Link 
              href="/builder"
              className="group p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/30 transition-colors">
                  <Calendar className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Custom Design</h3>
                <p className="text-gray-600">Create unique suits for your special day</p>
              </div>
            </Link>

            <button 
              onClick={() => setShowWeddingStudio(true)}
              className="group p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/30 transition-colors">
                  <Camera className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Wedding Studio</h3>
                <p className="text-gray-600">AI-powered wedding visualization</p>
              </div>
            </button>

            <Link 
              href="/wedding-guide"
              className="group p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/30 transition-colors">
                  <BookOpen className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Style Guide</h3>
                <p className="text-gray-600">Discover your perfect wedding style</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
        </>
      )}
    </div>
  );
}