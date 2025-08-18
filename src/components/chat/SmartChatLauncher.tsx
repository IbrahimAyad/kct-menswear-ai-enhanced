"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Sparkles, 
  Ruler, 
  HeadphonesIcon,
  ChevronRight,
  Bot,
  User,
  Zap
} from "lucide-react";

interface ChatOption {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

export function SmartChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({
    support: 0,
    stylist: 0,
    sizing: 0
  });

  const chatOptions: ChatOption[] = [
    {
      id: "support",
      title: "Customer Support",
      subtitle: "Order help & questions",
      icon: <HeadphonesIcon className="w-5 h-5" />,
      color: "text-white",
      bgGradient: "bg-gradient-to-br from-burgundy to-burgundy-700"
    },
    {
      id: "stylist",
      title: "Atelier Stylist",
      subtitle: "Personal style advice",
      icon: <Sparkles className="w-5 h-5" />,
      color: "text-white",
      bgGradient: "bg-gradient-to-br from-burgundy-600 to-purple-700"
    },
    {
      id: "sizing",
      title: "Size Assistant",
      subtitle: "Perfect fit finder",
      icon: <Ruler className="w-5 h-5" />,
      color: "text-white",
      bgGradient: "bg-gradient-to-br from-burgundy-500 to-pink-600"
    }
  ];

  // Auto-show options when main button is clicked
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowOptions(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowOptions(false);
      setSelectedChat(null);
    }
  }, [isOpen]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    // Here you would open the specific chat interface
    console.log(`Opening ${chatId} chat`);
    
    // You can integrate with existing chat components or create new ones
    switch(chatId) {
      case 'support':
        // Open customer support chat
        break;
      case 'stylist':
        // Open AI stylist chat
        break;
      case 'sizing':
        // Open size assistant
        break;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowOptions(false);
    setSelectedChat(null);
  };

  return (
    <>
      {/* Main Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-burgundy text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          >
            <MessageCircle className="w-6 h-6" />
            
            {/* Pulse animation for attention */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            
            {/* Hover tooltip */}
            <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Need help? Chat with us!
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Chat Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* Chat Options Container */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-burgundy to-burgundy-700 text-white px-6 py-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  How can we help you today?
                </h3>
                <p className="text-sm text-white/80 mt-1">Choose a specialist</p>
              </div>

              {/* Chat Options */}
              <div className="p-4 space-y-3">
                <AnimatePresence>
                  {showOptions && chatOptions.map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleChatSelect(option.id)}
                      className={`w-full p-4 rounded-xl ${option.bgGradient} ${option.color} hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg group`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                            {option.icon}
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold">{option.title}</h4>
                            <p className="text-xs opacity-90">{option.subtitle}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>

                      {/* Unread indicator */}
                      {unreadCounts[option.id as keyof typeof unreadCounts] > 0 && (
                        <span className="absolute top-2 right-2 w-5 h-5 bg-white text-burgundy text-xs font-bold rounded-full flex items-center justify-center">
                          {unreadCounts[option.id as keyof typeof unreadCounts]}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>

                {/* Quick Actions */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Quick Actions</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors">
                      Track Order
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors">
                      Size Guide
                    </button>
                  </div>
                </div>

                {/* Atelier AI Branding */}
                <div className="flex items-center justify-center gap-2 pt-3 text-xs text-gray-400">
                  <Zap className="w-3 h-3" />
                  <span>Powered by Atelier AI</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Individual Chat Windows would go here */}
      {selectedChat === 'support' && (
        // Customer Support Chat Component
        <div className="fixed bottom-24 right-6 z-40">
          {/* Add your support chat component */}
        </div>
      )}

      {selectedChat === 'stylist' && (
        // Atelier Stylist Chat Component
        <div className="fixed bottom-24 right-6 z-40">
          {/* Add your stylist chat component */}
        </div>
      )}

      {selectedChat === 'sizing' && (
        // Size Assistant Chat Component
        <div className="fixed bottom-24 right-6 z-40">
          {/* Add your sizing chat component */}
        </div>
      )}
    </>
  );
}