"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Package, Heart, Settings, Calendar, Ruler } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { customer } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  // Mock customer data for demo
  const mockCustomer = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    measurements: {
      chest: 42,
      waist: 34,
      inseam: 32,
      neck: 16,
      sleeve: 34,
    },
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "measurements", label: "Measurements", icon: Ruler },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container-main py-16">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-gold mb-4">
            <div className="h-px w-12 bg-gold"></div>
            <span className="text-sm font-semibold tracking-widest uppercase">Personal Dashboard</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif">My Account</h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-0 shadow-lg">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 font-medium ${
                        activeTab === tab.id
                          ? "bg-gold text-black shadow-md"
                          : "hover:bg-gold/10 hover:text-gold"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <Card className="p-8 border-0 shadow-lg">
                <h2 className="text-3xl font-serif mb-8">Profile Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={mockCustomer.firstName}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue={mockCustomer.lastName}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={mockCustomer.email}
                      className="w-full px-3 py-2 border rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue={mockCustomer.phone}
                      className="w-full px-3 py-2 border rounded-sm"
                    />
                  </div>
                  <Button className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-2.5 shadow-md hover:shadow-lg transition-all duration-300">Save Changes</Button>
                </div>
              </Card>
            )}

            {activeTab === "orders" && (
              <Card className="p-8 border-0 shadow-lg">
                <h2 className="text-3xl font-serif mb-8">Order History</h2>
                <div className="space-y-4">
                  {/* Mock Order */}
                  <div className="border border-gold/20 rounded-sm p-6 hover:border-gold hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Order #KCT-2024-001</p>
                        <p className="text-sm text-gray-600">January 15, 2024</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-sm">
                        Delivered
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600">3 items • $1,299.00</p>
                      <Button variant="outline" size="sm" className="border-gold/30 hover:border-gold hover:bg-gold/10 transition-all duration-200">
                        View Details
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No more orders found</p>
                    <Link href="/products">
                      <Button className="mt-4 bg-gold hover:bg-gold/90 text-black font-semibold shadow-md hover:shadow-lg transition-all duration-300">Start Shopping</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "measurements" && (
              <Card className="p-8 border-0 shadow-lg">
                <h2 className="text-3xl font-serif mb-8">My Measurements</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {Object.entries(mockCustomer.measurements).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">
                        {key}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={value}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                        />
                        <span className="text-sm text-gray-500">inches</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Button className="bg-gold hover:bg-gold/90 text-black font-semibold shadow-md hover:shadow-lg transition-all duration-300">Save Measurements</Button>
                  <Button variant="outline" className="border-gold/30 hover:border-gold hover:bg-gold/10 transition-all duration-200">Book Fitting Appointment</Button>
                </div>
              </Card>
            )}

            {activeTab === "appointments" && (
              <Card className="p-8 border-0 shadow-lg">
                <h2 className="text-3xl font-serif mb-8">Appointments</h2>
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No upcoming appointments</p>
                  <Button className="mt-4 bg-gold hover:bg-gold/90 text-black font-semibold shadow-md hover:shadow-lg transition-all duration-300">Book Appointment</Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}